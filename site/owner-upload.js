"use strict";
(() => {
 const token=location.hash.slice(1);history.replaceState(null,"",location.pathname);
 const input=document.querySelector("#original"),button=document.querySelector("#start"),status=document.querySelector("#status"),bar=document.querySelector("#progress");
 let plan,busy=false;
 const message=text=>{status.textContent=text;};
 const hex=bytes=>[...new Uint8Array(bytes)].map(n=>n.toString(16).padStart(2,"0")).join("");
 const digest=async blob=>hex(await crypto.subtle.digest("SHA-256",await blob.arrayBuffer()));
 const endpoint=(action,params={})=>"/_owner_media?"+new URLSearchParams({name:"concert-02",action,...params});
 async function request(action,method="GET",body,params={},extra={}){
  const response=await fetch(endpoint(action,params),{method,body,headers:{Authorization:"Bearer "+token,...extra},cache:"no-store"});
  if(!response.ok){let detail="";try{detail=(await response.json()).error||"";}catch{}
   throw Error(response.status===403?"托管安全服务阻止了浏览器请求，上传未完成。":response.status===404?"补传权限已失效，请回到聊天更新补传入口。":"上传失败（"+response.status+"）"+(detail?"："+detail:""));}
  return response.json();
 }
 function finish(){message("上传完成。原视频的大小与分块校验均通过，现在可以在个站播放或下载。");status.classList.add("success");bar.value=100;button.disabled=true;input.disabled=true;}
 async function initialize(){
  if(!/^[a-f0-9]{64}$/.test(token)){message("此入口缺少补传权限，请使用聊天中提供的完整补传链接。");input.disabled=true;return;}
  try{
   plan=await request("resume");
   const current=await request("status");
   if(current.size===plan.size&&current.sha256===plan.sha256&&current.etag?.replaceAll('"',"").toLowerCase()===plan.multipartEtag){finish();return;}
   const complete=plan.parts.filter(Boolean).length;
   bar.value=complete/plan.digests.length*100;
   message("已上传 "+complete+" / "+plan.digests.length+" 块，剩余约 "+Math.ceil((plan.size-complete*plan.partSize)/1e6)+" MB。\n选择原文件后，点击“继续上传”。");
   button.disabled=!input.files.length;
  }catch(error){message(error.message);input.disabled=true;}
 }
 input.addEventListener("change",()=>{button.disabled=busy||!plan||!input.files.length;});
 button.addEventListener("click",async()=>{
  if(busy||!plan||!input.files[0])return;
  busy=true;button.disabled=true;input.disabled=true;
  try{
   const file=input.files[0];
   if(file.size!==plan.size)throw Error("文件大小不匹配，请选择 E:\\xzq 中的原始 MP4。");
   message("正在校验所选原文件…");
   if(await digest(file.slice(0,plan.partSize))!==plan.digests[0].sha256||await digest(file.slice((plan.digests.length-1)*plan.partSize))!==plan.digests.at(-1).sha256)throw Error("所选文件与原片不一致，请重新选择。");
   const parts=plan.parts.map(part=>part?{...part}:null);
   let finished=parts.filter(Boolean).length,next=0,failed=false;
   async function task(){
    while(!failed){
     const index=next++;if(index>=plan.digests.length)return;if(parts[index])continue;
     const blob=file.slice(index*plan.partSize,Math.min(file.size,(index+1)*plan.partSize));
     if(await digest(blob)!==plan.digests[index].sha256)throw Error("第 "+(index+1)+" 块与原片不一致，已停止上传。");
     const result=await request("part","PUT",blob,{uploadId:plan.uploadId,part:String(index+1)},{"Content-Type":"application/octet-stream"});
     if(result.etag?.replaceAll('"',"").toLowerCase()!==plan.digests[index].md5)throw Error("上传校验未通过，已停止合并。");
     parts[index]={partNumber:index+1,etag:result.etag};plan.parts[index]=parts[index];finished++;
     bar.value=finished/parts.length*100;message("正在上传："+finished+" / "+parts.length+" 块。\n原画质保留，请保持此页打开。");
    }
   }
   const tasks=await Promise.allSettled([task().catch(error=>{failed=true;throw error;}),task().catch(error=>{failed=true;throw error;})]);
   const failure=tasks.find(item=>item.status==="rejected");if(failure)throw failure.reason;
   message("全部分块已上传，正在合并并校验原片…");
   const complete=await request("complete","POST",JSON.stringify({parts}),{uploadId:plan.uploadId},{"Content-Type":"application/json"});
   if(complete.size!==plan.size||complete.sha256!==plan.sha256||complete.etag?.replaceAll('"',"").toLowerCase()!==plan.multipartEtag)throw Error("最终文件校验未通过，请回到聊天检查上传结果。");
   finish();
  }catch(error){message(error.message+"\n保留当前页面可再次点击“继续上传”。");button.disabled=false;input.disabled=false;}
  finally{busy=false;}
 });
 initialize();
})();