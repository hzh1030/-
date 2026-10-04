// Build prepends STATIC_ASSETS and VIDEO_FILES, which contain no secrets.
const json=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
const authorized=(request,env)=>{
  const expected=env.MEDIA_UPLOAD_TOKEN;
  if(!expected||Date.now()>UPLOAD_EXPIRES_AT)return false;
  const actual=request.headers.get('Authorization')??'';
  const value='Bearer '+expected;
  let difference=actual.length^value.length;
  for(let i=0;i<value.length;i++)difference|=value.charCodeAt(i)^(actual.charCodeAt(i)||0);
  return difference===0;
};
function rangeFor(header,size){
  if(!header)return null;
  const match=/^bytes=(\d*)-(\d*)$/.exec(header);
  if(!match||(!match[1]&&!match[2]))return false;
  let start,end;
  if(!match[1]){const suffix=Number(match[2]);if(!Number.isSafeInteger(suffix)||suffix<=0)return false;start=Math.max(0,size-suffix);end=size-1;}
  else {start=Number(match[1]);end=match[2]?Math.min(Number(match[2]),size-1):size-1;}
  if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>=size||end<start)return false;
  return {offset:start,length:end-start+1};
}
function decodeStaticBytes(base64,offset,length){
  const bytes=new Uint8Array(length);
  // Base64 groups map to three bytes. Decode only the requested groups, in
  // bounded chunks, so a video seek never decodes the entire embedded file.
  const first=Math.floor(offset/3)*4;
  const last=Math.min(base64.length,Math.ceil((offset+length)/3)*4);
  for(let position=first;position<last;position+=65536){
    const decoded=atob(base64.slice(position,Math.min(position+65536,last)));
    const decodedOffset=position/4*3;
    const start=Math.max(0,offset-decodedOffset);
    const end=Math.min(decoded.length,offset+length-decodedOffset);
    let target=Math.max(0,decodedOffset-offset);
    for(let index=start;index<end;index++)bytes[target++]=decoded.charCodeAt(index);
  }
  return bytes;
}
function serveStatic(request,asset){
  const headers=new Headers({'Content-Type':asset.type,'ETag':asset.etag,'Cache-Control':'public, max-age=0, must-revalidate','X-Content-Type-Options':'nosniff'});
  const isVideo=asset.type==='video/mp4';
  if(isVideo)headers.set('Accept-Ranges','bytes');
  if(request.headers.get('If-None-Match')===asset.etag)return new Response(null,{status:304,headers});
  const ifRange=request.headers.get('If-Range');
  const rangeHeader=!isVideo||request.method==='HEAD'||(ifRange&&ifRange!==asset.etag)?null:request.headers.get('Range');
  const range=rangeFor(rangeHeader,asset.bytes);
  if(range===false){headers.set('Content-Range','bytes */'+asset.bytes);return new Response(null,{status:416,headers});}
  headers.set('Content-Length',String(range?.length??asset.bytes));
  if(range)headers.set('Content-Range',`bytes ${range.offset}-${range.offset+range.length-1}/${asset.bytes}`);
  if(request.method==='HEAD')return new Response(null,{headers});
  const bytes=decodeStaticBytes(asset.base64,range?.offset??0,range?.length??asset.bytes);
  return new Response(bytes,{status:range?206:200,headers});
}
async function upload(request,env,url){
  if(!authorized(request,env))return new Response('Not found',{status:404});
  const name=url.searchParams.get('name');
  const video=VIDEO_FILES['/assets/videos/'+name+'.mp4'];
  if(!video)return json({error:'Unknown media'},400);
  if(!env.BUCKET)return json({error:'Storage unavailable'},503);
  const action=url.searchParams.get('action');
  if(request.method==='GET'&&action==='resume'&&name==='concert-02')return json(RESUME_UPLOAD);
  if(request.method==='POST'&&action==='complete'&&name==='concert-02'){
    const current=await env.BUCKET.head(video.key);
    if(current&&current.size===RESUME_UPLOAD.size&&current.customMetadata?.sha256===RESUME_UPLOAD.sha256&&current.etag?.replaceAll('\"','').toLowerCase()===RESUME_UPLOAD.multipartEtag)return json({size:current.size,etag:current.etag,sha256:current.customMetadata.sha256});
  }
  if(request.method==='POST'&&action==='create'){
    const hash=request.headers.get('X-Content-SHA256');
    if(!/^[a-f0-9]{64}$/.test(hash??''))return json({error:'Missing content checksum'},400);
    const result=await env.BUCKET.createMultipartUpload(video.key,{httpMetadata:{contentType:'video/mp4'},customMetadata:{sha256:hash,original_bytes:String(video.bytes)}});
    return json({uploadId:result.uploadId});
  }
  if(request.method==='GET'&&action==='status'){
    const result=await env.BUCKET.head(video.key);
    return json(result?{size:result.size,sha256:result.customMetadata?.sha256,etag:result.etag}:{size:0});
  }
  const id=url.searchParams.get('uploadId');
  if(!id||id.length>1024)return json({error:'Invalid upload'},400);
  const multipart=env.BUCKET.resumeMultipartUpload(video.key,id);
  if(request.method==='PUT'&&action==='part'){
    const number=Number(url.searchParams.get('part'));
    const length=Number(request.headers.get('Content-Length'));
    if(!Number.isInteger(number)||number<1||number>10000||length<=0||length>20*1024*1024)return json({error:'Invalid part'},400);
    return json(await multipart.uploadPart(number,request.body));
  }
  if(request.method==='POST'&&action==='complete'){
    const {parts}=await request.json();
    if(!Array.isArray(parts)||parts.length<1||parts.length>10000||!parts.every((p,i)=>p.partNumber===i+1&&typeof p.etag==='string'))return json({error:'Invalid part list'},400);
    const object=await multipart.complete(parts);
    if(object.size!==video.bytes)return json({error:'Original file size mismatch'},409);
    console.log(JSON.stringify({event:'original_media_completed',name,bytes:object.size,sha256:object.customMetadata?.sha256}));
    return json({size:object.size,etag:object.etag,sha256:object.customMetadata?.sha256});
  }
  if(request.method==='DELETE'&&action==='abort'){await multipart.abort();return json({aborted:true});}
  return json({error:'Method not allowed'},405);
}
async function serveVideo(request,env,url,video){
  if(!env.BUCKET)return new Response('视频暂时无法加载，请稍后重试。',{status:503});
  const meta=await env.BUCKET.head(video.key);
  if(!meta)return new Response('视频正在准备中，请稍后重试。',{status:503,headers:{'Retry-After':'30'}});
  const headers=new Headers({'Content-Type':'video/mp4','Accept-Ranges':'bytes','ETag':meta.httpEtag,'Cache-Control':env.MEDIA_UPLOAD_TOKEN?'no-store':'public, max-age=3600','X-Content-SHA256':meta.customMetadata?.sha256??'','X-Content-Type-Options':'nosniff'});
  if(request.headers.get('If-None-Match')===meta.httpEtag)return new Response(null,{status:304,headers});
  const ifRange=request.headers.get('If-Range');
  const rangeHeader=request.method==='HEAD'||(ifRange&&ifRange!==meta.httpEtag)?null:request.headers.get('Range');
  const range=rangeFor(rangeHeader,meta.size);
  if(range===false){headers.set('Content-Range','bytes */'+meta.size);return new Response(null,{status:416,headers});}
  headers.set('Content-Length',String(range?.length??meta.size));
  if(range)headers.set('Content-Range',`bytes ${range.offset}-${range.offset+range.length-1}/${meta.size}`);
  if(request.method==='HEAD')return new Response(null,{status:range?206:200,headers});
  const object=await env.BUCKET.get(video.key,range?{range}:undefined);
  if(!object)return new Response('视频暂时无法加载，请稍后重试。',{status:503});
  return new Response(object.body,{status:range?206:200,headers});
}
export default {
  async fetch(request,env){
    const url=new URL(request.url);
    try {
      if(url.pathname==='/_owner_media')return await upload(request,env,url);
      if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
      const video=VIDEO_FILES[url.pathname];
      if(video)return await serveVideo(request,env,url,video);
      const key=url.pathname==='/_owner_upload'?'/owner-upload.html':url.pathname==='/'?'/index.html':['/resume','/resume/'].includes(url.pathname)?'/resume.html':url.pathname;
      const asset=STATIC_ASSETS[key];
      if(!asset)return new Response('页面不存在。',{status:404});
      return serveStatic(request,asset);
    } catch(error){
      console.error('Site resource request failed',url.pathname,error?.name);
      return new Response('暂时无法加载，请稍后重试。',{status:503});
    }
  }
};
