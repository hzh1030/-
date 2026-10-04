import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
const {default:worker}=await import('../dist/server/index.js');
const origin='https://site.test';
const run=(path,options={},env={})=>worker.fetch(new Request(origin+path,options),env);
const response=await run('/');assert.equal(response.status,200);
assert.equal(await response.text(),readFileSync('site/index.html','utf8'));
const resumeSource=readFileSync('site/resume.html','utf8');
for(const path of ['/resume','/resume/','/resume.html']){
  const resume=await run(path);assert.equal(resume.status,200);assert.equal(await resume.text(),resumeSource);
}
const resumeAssets=[...resumeSource.matchAll(/(?:href|src)="(\/[^"#]*?)"/g)].map(match=>match[1]);
for(const path of new Set(resumeAssets))assert.equal((await run(path)).status,200,'Resume resource '+path);
const resumeStyles=await run('/resume.css?v=1');assert.equal(await resumeStyles.text(),readFileSync('site/resume.css','utf8'));
const background=await run('/aurora.css?v=aurora-2');assert.equal(background.status,200);assert.equal(await background.text(),readFileSync('site/aurora.css','utf8'));
const motion=await run('/motion.js?v=aurora-2');assert.equal(motion.status,200);assert.equal(await motion.text(),readFileSync('site/motion.js','utf8'));
const catPoster=await run('/assets/tuantuan-cat-upright-poster.png');assert.equal(catPoster.status,200);assert.deepEqual(Buffer.from(await catPoster.arrayBuffer()),readFileSync('site/assets/tuantuan-cat-upright-poster.png'));
assert.equal((await run('/_owner_media?name=concert-01&action=create',{method:'POST'})).status,404);
assert.equal((await run('/.openai/hosting.json')).status,404);
assert.equal((await run('/unknown')).status,404);
const image=await run('/assets/meixue-1.jpg');assert.deepEqual(Buffer.from(await image.arrayBuffer()),readFileSync('site/assets/meixue-1.jpg'));
const cached=await run('/assets/meixue-1.jpg',{headers:{'If-None-Match':image.headers.get('ETag')}});assert.equal(cached.status,304);
async function checkStaticVideo(fetchVideo,path,original){
  const full=await fetchVideo(path);
  assert.equal(full.status,200);assert.equal(full.headers.get('Content-Type'),'video/mp4');assert.equal(full.headers.get('Accept-Ranges'),'bytes');assert.equal(full.headers.get('Content-Length'),String(original.length));
  const etag=full.headers.get('ETag');assert.ok(etag);
  assert.deepEqual(Buffer.from(await full.arrayBuffer()),original,'Complete static video bytes');
  const cases=[
    ['bytes=3-7',3,7],['bytes=0-0',0,0],
    ['bytes=-7',original.length-7,original.length-1],
    [`bytes=-${original.length+10}`,0,original.length-1],
    [`bytes=${original.length-9}-`,original.length-9,original.length-1],
    [`bytes=${original.length-5}-${original.length+100}`,original.length-5,original.length-1],
    ['bytes=49149-49157',49149,49157],['bytes=49150-110000',49150,110000],
  ];
  for(const [header,start,end] of cases){
    const response=await fetchVideo(path,{headers:{Range:header}});
    assert.equal(response.status,206,header);assert.equal(response.headers.get('Content-Range'),`bytes ${start}-${end}/${original.length}`);assert.equal(response.headers.get('Content-Length'),String(end-start+1));
    assert.deepEqual(Buffer.from(await response.arrayBuffer()),original.subarray(start,end+1),header);
  }
  for(const header of [`bytes=${original.length}-`,'bytes=4-3','bytes=-0','bytes=0-1,3-4','items=0-1','bytes=','bytes=9007199254740992-']){
    const response=await fetchVideo(path,{headers:{Range:header}});assert.equal(response.status,416,header);assert.equal(response.headers.get('Content-Range'),`bytes */${original.length}`);assert.equal(await response.text(),'');
  }
  for(const headers of [{Range:'bytes=3-7','If-Range':etag},{Range:'bytes=3-7','If-Range':'"old"'}]){
    const response=await fetchVideo(path,{headers});const unchanged=headers['If-Range']===etag;assert.equal(response.status,unchanged?206:200);assert.deepEqual(Buffer.from(await response.arrayBuffer()),unchanged?original.subarray(3,8):original);
  }
  const cachedVideo=await fetchVideo(path,{headers:{'If-None-Match':etag,Range:'bytes=3-7'}});assert.equal(cachedVideo.status,304);assert.equal(await cachedVideo.text(),'');
  for(const headers of [{},{Range:'bytes=3-7'},{Range:`bytes=${original.length}-`}]){
    const response=await fetchVideo(path,{method:'HEAD',headers});assert.equal(response.status,200);assert.equal(response.headers.get('Content-Length'),String(original.length));assert.equal(response.headers.get('Content-Range'),null);assert.equal(await response.text(),'');
  }
}
// A binary fixture covers base64 alignment, padding and decode-chunk boundaries
// even before a background clip is available. It never enters the site build.
const fixture=Buffer.alloc(150007);
for(let index=0;index<fixture.length;index++)fixture[index]=(index*31+(index>>8))&255;
const fixtureAssets={'/test.mp4':{type:'video/mp4',bytes:fixture.length,base64:fixture.toString('base64'),etag:'"fixture"'}};
const fixtureModule='const UPLOAD_EXPIRES_AT=0;const VIDEO_FILES={};const RESUME_UPLOAD={};const STATIC_ASSETS='+JSON.stringify(fixtureAssets)+';\n'+readFileSync('worker/index.mjs','utf8');
const {default:fixtureWorker}=await import('data:text/javascript;base64,'+Buffer.from(fixtureModule).toString('base64'));
const runFixture=(path,options={})=>fixtureWorker.fetch(new Request(origin+path,options),{});
await checkStaticVideo(runFixture,'/test.mp4',fixture);
const originalAtob=globalThis.atob,decodedLengths=[];
globalThis.atob=input=>{decodedLengths.push(input.length);return originalAtob(input);};
try{
  const small=await runFixture('/test.mp4',{headers:{Range:'bytes=49151-49158'}});assert.deepEqual(Buffer.from(await small.arrayBuffer()),fixture.subarray(49151,49159));assert.ok(decodedLengths.reduce((sum,length)=>sum+length,0)<=16,'Small seek decodes only its base64 groups');
  decodedLengths.length=0;
  const full=await runFixture('/test.mp4');assert.deepEqual(Buffer.from(await full.arrayBuffer()),fixture);assert.ok(decodedLengths.length>1);assert.ok(decodedLengths.every(length=>length<=65536),'Full video decode uses bounded chunks');
}finally{globalThis.atob=originalAtob;}
const oceanVideo='site/assets/ocean-loop.mp4';
if(existsSync(oceanVideo))await checkStaticVideo(run,'/assets/ocean-loop.mp4',readFileSync(oceanVideo));
const bytes=new TextEncoder().encode('0123456789abcdef');
const meta={size:bytes.length,httpEtag:'"demo"',customMetadata:{sha256:'demo'}};
let range;
const env={BUCKET:{async head(){return meta;},async get(_,options){range=options?.range;const result=range?bytes.slice(range.offset,range.offset+range.length):bytes;return {body:new Blob([result]).stream()};}}};
const part=await run('/assets/videos/concert-01.mp4',{headers:{Range:'bytes=3-7'}},env);
const importing=await run('/assets/videos/tuantuan-cat.mp4?v=upright-90',{method:'HEAD'},{...env,MEDIA_UPLOAD_TOKEN:'temporary'});assert.equal(importing.headers.get('Cache-Control'),'no-store');
assert.equal(part.status,206);assert.equal(await part.text(),'34567');assert.equal(part.headers.get('Content-Range'),'bytes 3-7/16');
const suffix=await run('/assets/videos/concert-01.mp4',{headers:{Range:'bytes=-4'}},env);assert.equal(await suffix.text(),'cdef');
const open=await run('/assets/videos/concert-01.mp4',{headers:{Range:'bytes=12-'}},env);assert.equal(await open.text(),'cdef');
const invalid=await run('/assets/videos/concert-01.mp4',{headers:{Range:'bytes=20-22'}},env);assert.equal(invalid.status,416);
const changed=await run('/assets/videos/concert-01.mp4',{headers:{Range:'bytes=3-7','If-Range':'"old"'}},env);assert.equal(changed.status,200);assert.equal(await changed.text(),'0123456789abcdef');
const multiple=await run('/assets/videos/concert-01.mp4',{headers:{Range:'bytes=0-1,3-4'}},env);assert.equal(multiple.status,416);
const head=await run('/assets/videos/concert-01.mp4',{method:'HEAD'},env);assert.equal(head.status,200);assert.equal(head.headers.get('Content-Length'),'16');assert.equal(await head.text(),'');
const headRange=await run('/assets/videos/concert-01.mp4',{method:'HEAD',headers:{Range:'bytes=2-4'}},env);assert.equal(headRange.status,200);assert.equal(headRange.headers.get('Content-Length'),'16');
const missing=await run('/assets/videos/concert-01.mp4',{}, {BUCKET:{head:async()=>null}});assert.equal(missing.status,503);
console.log('Worker checks passed: original static bytes, upload authorization, missing media, HEAD, ETag, R2 and embedded video ranges, bounded base64 decoding'+(existsSync(oceanVideo)?', original ocean clip bytes.':', binary fixture (ocean clip not present).'));
