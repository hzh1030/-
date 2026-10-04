"use strict";
const HoloGeometry = (() => {
  const t = (1 + Math.sqrt(5)) / 2;
  const vertices = [[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]].map(p => p.map(v => v / Math.hypot(...p)));
  const distance = (a,b) => Math.hypot(...a.map((v,i) => v-b[i]));
  const edgeLength = distance(vertices[0],vertices[1]);
  const edges = [], faces = [];
  const adjacent = (a,b) => Math.abs(distance(vertices[a],vertices[b])-edgeLength)<.001;
  for(let a=0;a<12;a++)for(let b=a+1;b<12;b++)if(adjacent(a,b)){
    edges.push([a,b]);
    for(let c=b+1;c<12;c++)if(adjacent(a,c)&&adjacent(b,c))faces.push([a,b,c]);
  }
  return {vertices,edges,faces};
})();
function renderHologram(ctx,width,height,seconds=0,options={}) {
  const ambient = options.ambient === true;
  const mobile = width < 480;
  const aim = options.aim || {x:0,y:0};
  const phase = options.phase ?? seconds;
  const unit = Math.min(width,height)*(ambient ? .37 : .185);
  const center = {x:width*(ambient ? .76 : .5),y:height*(ambient ? .45 : .45)};
  const rotate = (p,x,y,z=0) => {
    let [a,b,c]=p;
    [b,c]=[b*Math.cos(x)-c*Math.sin(x),b*Math.sin(x)+c*Math.cos(x)];
    [a,c]=[a*Math.cos(y)+c*Math.sin(y),-a*Math.sin(y)+c*Math.cos(y)];
    return [a*Math.cos(z)-b*Math.sin(z),a*Math.sin(z)+b*Math.cos(z),c];
  };
  const project = p => {
    const perspective=7/(7+p[2]);
    return {x:center.x+p[0]*unit*perspective,y:center.y+p[1]*unit*perspective,z:p[2]};
  };
  const path = (points,close=false) => {
    ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);
    points.slice(1).forEach(p=>ctx.lineTo(p.x,p.y));
    if(close)ctx.closePath();
  };
  const line = (a,b,color,lineWidth=1) => {ctx.strokeStyle=color;ctx.lineWidth=lineWidth;path([a,b]);ctx.stroke();};
  const dot = (p,radius,color) => {ctx.fillStyle=color;ctx.beginPath();ctx.arc(p.x,p.y,radius,0,Math.PI*2);ctx.fill();};
  ctx.clearRect(0,0,width,height);ctx.save();
  if(!ambient){
    const backdrop=ctx.createLinearGradient(0,0,width,height);
    backdrop.addColorStop(0,"#f4fbff");backdrop.addColorStop(.55,"#d4eaf6");backdrop.addColorStop(1,"#bbd4ef");
    ctx.fillStyle=backdrop;ctx.fillRect(0,0,width,height);
    const halo=ctx.createRadialGradient(center.x,center.y,0,center.x,center.y,unit*2.9);
    halo.addColorStop(0,"#ffffffd9");halo.addColorStop(.55,"#8bdde640");halo.addColorStop(1,"#70b3e900");
    ctx.fillStyle=halo;ctx.fillRect(0,0,width,height);
  }
  const lightSource={x:width*.79+aim.x*width*.018,y:-height*.08};
  for(let ray=0;ray<4;ray++){
    const end={x:center.x+(ray-1.5)*unit*.68+aim.x*unit*.12,y:height*.88};
    const light=ctx.createLinearGradient(lightSource.x,lightSource.y,end.x,end.y);
    light.addColorStop(0,ambient?"#438fc61b":"#ffffff9c");
    light.addColorStop(.5,ambient?"#438fc60c":"#64c0de30");
    light.addColorStop(1,"#58b2de00");
    ctx.fillStyle=light;
    path([{x:lightSource.x-3,y:lightSource.y},{x:lightSource.x+3,y:lightSource.y},{x:end.x+unit*.22,y:end.y},{x:end.x-unit*.22,y:end.y}],true);ctx.fill();
  }
  const camera = p => rotate(p,.21+aim.y*.08,-.26+aim.x*.13);
  for(let index=-5;index<=5;index++){
    line(project(camera([index,1.65,-4])),project(camera([index,1.65,5])),ambient?"#326ba825":"#276b9b30",.8);
    line(project(camera([-5,1.65,index])),project(camera([5,1.65,index])),ambient?"#326ba825":"#276b9b30",.8);
  }
  const floorRing=[];
  for(let n=0;n<=100;n++){
    const angle=n/100*Math.PI*2;
    floorRing.push(project(camera([Math.cos(angle)*2.28,1.5,Math.sin(angle)*2.28])));
  }
  ctx.strokeStyle=ambient?"#2d729345":"#21759d77";ctx.lineWidth=1.3;path(floorRing);ctx.stroke();
  const sweep=(phase*.14)%1;
  const floorScan=[[-4,1.64,-4+sweep*9],[4,1.64,-4+sweep*9],[4,1.64,-3.78+sweep*9],[-4,1.64,-3.78+sweep*9]].map(p=>project(camera(p)));
  ctx.fillStyle=ambient?"#168dac1b":"#31aac845";path(floorScan,true);ctx.fill();
  if(ambient){ctx.restore();return;}
  const yaw=phase*.18+.48+aim.x*.22, pitch=-.24+aim.y*.15;
  const transform=p=>rotate(p,pitch,yaw,.15);
  const cube=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(p=>project(transform(p.map(v=>v*1.38))));
  const cubeEdges=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  if(!mobile)cubeEdges.forEach(([a,b])=>line(cube[a],cube[b],"#4278ae35",.8));
  const orbitPlanes=[[-.35,.3,2.2,"#2755ba"],[.88,-.55,2.35,"#008f9c"],[-.8,.95,2.15,"#7952b9"]];
  const rings=orbitPlanes.slice(0,mobile?2:3).map(([x,y,r,color],i)=>{
    const points=Array.from({length:97},(_,n)=>project(rotate([Math.cos(n/96*Math.PI*2)*r,Math.sin(n/96*Math.PI*2)*r,0],x+aim.y*.12,y+aim.x*.12,phase*.025+i*.2)));
    return {points,color,index:i};
  });
  const drawRings=front=>rings.forEach(({points,color,index})=>{
    for(let n=0;n<96;n++){
      if((points[n].z<=0)!==front)continue;
      const scanAngle=(phase*.22+index*.3)%1;
      const fraction=n/96;
      const bright=Math.abs(fraction-scanAngle)<.075;
      ctx.shadowColor=color;ctx.shadowBlur=front&&bright?9:0;
      line(points[n],points[n+1],color+(front?(bright?"ee":"99"):"45"),bright?3.1:1.2);ctx.shadowBlur=0;
    }
  });
  drawRings(false);
  const core=HoloGeometry.vertices.map(p=>project(transform(p.map(v=>v*1.32))));
  const faces=HoloGeometry.faces.map(ids=>({ids,z:ids.reduce((sum,id)=>sum+core[id].z,0)/3})).sort((a,b)=>b.z-a.z);
  faces.forEach(({ids,z})=>{
    path(ids.map(id=>core[id]),true);
    ctx.fillStyle=z<0?"#328fc42c":"#8377d415";ctx.fill();
  });
  HoloGeometry.edges.forEach(([a,b])=>{
    const front=(core[a].z+core[b].z)/2<0;
    line(core[a],core[b],front?"#17668abf":"#397caa3b",front?1.8:1);
  });
  const scanHeight=Math.sin(phase*.78)*1.2;
  const beam=[[-1.48,scanHeight,0],[1.48,scanHeight,0],[1.48,scanHeight+.055,0],[-1.48,scanHeight+.055,0]].map(p=>project(transform(p)));
  ctx.fillStyle="#20b0c675";path(beam,true);ctx.fill();
  core.forEach(p=>dot(p,p.z<0?3:1.7,p.z<0?"#ecffff":"#3486ab77"));
  core.filter(p=>p.z<0).forEach(p=>{ctx.shadowColor="#13b9d7";ctx.shadowBlur=10;dot(p,2,"#1b95ad");ctx.shadowBlur=0;});
  drawRings(true);
  rings.forEach(({points,index,color})=>{
    const n=Math.floor(((phase*.22+index*.3)%1)*96);
    ctx.shadowColor="#32c8dd";ctx.shadowBlur=14;dot(points[n],3.5,color);ctx.shadowBlur=0;
  });
  const pedestal=project(camera([0,1.51,0]));
  const glow=ctx.createRadialGradient(pedestal.x,pedestal.y,0,pedestal.x,pedestal.y,unit*1.1);
  glow.addColorStop(0,"#4fe5de66");glow.addColorStop(1,"#4fe5de00");
  ctx.fillStyle=glow;ctx.fillRect(pedestal.x-unit*1.1,pedestal.y-unit*.35,unit*2.2,unit*.7);
  ctx.restore();
}
(() => {
  if(typeof document==="undefined")return;
  const canvases=[...document.querySelectorAll("canvas[data-hologram]")];
  const stages=canvases.map(canvas=>({canvas,ctx:canvas.getContext("2d"),visible:true,width:0,height:0})).filter(stage=>stage.ctx);
  if(!stages.length)return;
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  const fine=matchMedia("(hover: hover) and (pointer: fine)");
  let frame=0,last=0,phase=0;
  const aim={x:0,y:0,targetX:0,targetY:0};
  const active=()=>document.body.classList.contains("motion-enabled")&&!document.hidden;
  function size(){
    for(const stage of stages){
      const bounds=stage.canvas.getBoundingClientRect();
      stage.width=Math.max(1,bounds.width);stage.height=Math.max(1,bounds.height);
      const density=Math.min(devicePixelRatio||1,1.5);
      stage.canvas.width=Math.round(stage.width*density);stage.canvas.height=Math.round(stage.height*density);
      stage.ctx.setTransform(density,0,0,density,0,0);
    }
    paint();
  }
  function paint(){
    for(const stage of stages)if(stage.visible){
      renderHologram(stage.ctx,stage.width,stage.height,phase,{aim,ambient:stage.canvas.dataset.hologram==="ambient"});
      stage.canvas.closest(".hologram-stage")?.classList.add("hologram-ready");
    }
  }
  function animate(time){
    frame=0;if(!active()||!stages.some(stage=>stage.visible))return;
    if(!last||time-last>=33){
      const elapsed=last?Math.min((time-last)/1000,.1):0;last=time;phase+=elapsed;
      aim.x+=(aim.targetX-aim.x)*.12;aim.y+=(aim.targetY-aim.y)*.12;
      paint();
    }
    frame=requestAnimationFrame(animate);
  }
  function sync(){
    cancelAnimationFrame(frame);frame=0;last=0;paint();
    if(active()&&stages.some(stage=>stage.visible))frame=requestAnimationFrame(animate);
  }
  if(typeof IntersectionObserver==="function"){
    const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{const stage=stages.find(s=>s.canvas===entry.target);if(stage)stage.visible=entry.isIntersecting;});sync();});
    stages.forEach(stage=>observer.observe(stage.canvas));
  }
  if(typeof ResizeObserver==="function"){
    const observer=new ResizeObserver(size);stages.forEach(stage=>observer.observe(stage.canvas));
  }else window.addEventListener("resize",size,{passive:true});
  document.addEventListener("pointermove",event=>{
    if(!active()||!fine.matches||event.pointerType==="touch")return;
    aim.targetX=(event.clientX/innerWidth-.5)*2;aim.targetY=(event.clientY/innerHeight-.5)*2;
  },{passive:true});
  document.documentElement.addEventListener("pointerleave",()=>{aim.targetX=0;aim.targetY=0;});
  document.addEventListener("click",event=>{if(event.target.closest("#motion-toggle"))sync();});
  document.addEventListener("visibilitychange",sync);reduced.addEventListener("change",sync);
  size();sync();
})();
