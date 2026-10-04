import {readFileSync,writeFileSync,mkdirSync,readdirSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
const root=process.cwd(),site=path.join(root,'site');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.mp4':'video/mp4'};
const assets={};
function collect(folder){for(const name of readdirSync(folder)){const file=path.join(folder,name);if(statSync(file).isDirectory()){collect(file);continue;}const type=mime[path.extname(name)];if(!type)throw new Error('Unexpected site asset '+file);const bytes=readFileSync(file);assets['/'+path.relative(site,file).split(path.sep).join('/')]={type,bytes:bytes.length,base64:bytes.toString('base64'),etag:'"'+createHash('sha256').update(bytes).digest('hex')+'"'};}}
collect(site);
const videos=JSON.parse(readFileSync(path.join(root,'worker/video-files.json'),'utf8'));
const media=Object.fromEntries(Object.entries(videos).map(([name,bytes])=>['/assets/videos/'+name+'.mp4',{key:'original-videos/'+name+'.mp4',bytes}]));
const dist=path.join(root,'dist');mkdirSync(path.join(dist,'server'),{recursive:true});mkdirSync(path.join(dist,'.openai'),{recursive:true});
writeFileSync(path.join(dist,'server/index.js'),'const UPLOAD_EXPIRES_AT='+(Date.now()+86400000)+';\nconst STATIC_ASSETS='+JSON.stringify(assets)+';\nconst VIDEO_FILES='+JSON.stringify(media)+';\nconst RESUME_UPLOAD='+readFileSync(path.join(root,'worker/concert-upload-plan.json'),'utf8')+';\n'+readFileSync(path.join(root,'worker/index.mjs'),'utf8'));
writeFileSync(path.join(dist,'.openai/hosting.json'),readFileSync(path.join(root,'.openai/hosting.json')));
console.log(JSON.stringify({assets:Object.keys(assets).length,workerBytes:statSync(path.join(dist,'server/index.js')).size,originalVideos:Object.keys(media).length}));
