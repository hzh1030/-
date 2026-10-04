import CATALOG from './music-catalog.js';
const launcher=document.querySelector('#music-launcher'),panel=document.querySelector('#liquid-music');
const list=panel.querySelector('.music-song-list'),search=panel.querySelector('#music-search');
const title=panel.querySelector('.music-current-title'),album=panel.querySelector('.music-current-album'),cover=panel.querySelector('.music-cover');
const count=panel.querySelector('.music-catalog-count'),live=panel.querySelector('.music-live');
const modeControl=panel.querySelector('#music-mode'),autoControl=panel.querySelector('#music-auto');
const songs=CATALOG.songs;
// One persistent audio element keeps playing when the panel is minimized.
const audio=document.createElement('audio');audio.id='portfolio-audio';audio.preload='metadata';document.body.append(audio);
const preferences={mode:'sequential',automatic:true,volume:0.65};
try{const saved=JSON.parse(localStorage.getItem('zh-music-preferences'));if(['sequential','random'].includes(saved?.mode))preferences.mode=saved.mode;if(typeof saved?.automatic==='boolean')preferences.automatic=saved.automatic;if(Number.isFinite(saved?.volume))preferences.volume=Math.max(0,Math.min(1,saved.volume));}catch{}
audio.volume=preferences.volume;
let active=Math.max(0,songs.findIndex(song=>song.title==='演员')),mountedId=null,playback='stopped',autoplayBlocked=false,autoplayAttempted=false;
let generation=0,fullAudioVerified=false,shuffleBag=[],history=[active];
const formatTime=value=>{const seconds=Math.max(0,Math.floor(Number(value)||0));return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;};
const announce=message=>{live.textContent=message;};
const persist=()=>{try{localStorage.setItem('zh-music-preferences',JSON.stringify(preferences));}catch{}};
const resolveSource=song=>window.portfolioMediaUrl?.(song.src)||new URL(song.src,document.baseURI).href;
const playButton=document.createElement('button');playButton.type='button';playButton.className='music-play';
const seek=document.createElement('input');seek.type='range';seek.className='music-progress';seek.min='0';seek.max='1';seek.step='0.1';seek.value='0';seek.setAttribute('aria-label','歌曲播放进度');
const time=document.createElement('span');time.className='music-time';
const timeline=document.createElement('div');timeline.append(seek,time);
const transport=document.createElement('div');transport.className='music-inline-controls';transport.append(playButton,timeline);panel.querySelector('.music-embed').replaceChildren(transport);
const volume=panel.querySelector('#music-volume');
function refresh(){
 const playing=playback==='playing';playButton.textContent=playing?'暂停':'播放';playButton.setAttribute('aria-label',`${playing?'暂停':'播放'} ${songs[active].title}`);
 const duration=Number.isFinite(audio.duration)?audio.duration:songs[active].duration;
 seek.max=String(duration);seek.value=String(audio.currentTime||0);time.textContent=`${formatTime(audio.currentTime)} / ${formatTime(duration)}`;
 launcher.querySelector('span').textContent=mountedId===null?'听薛之谦':`${songs[active].title} · ${autoplayBlocked?'点此播放':playing?'播放中':'展开'}`;
}
async function requestPlay(){
 if(mountedId===null||playback==='error')loadSong();const token=generation;autoplayAttempted=true;playback='loading';announce('正在打开歌曲…');refresh();
 try{await audio.play();}catch(error){if(token!==generation||error.name==='AbortError')return;if(error.name==='NotAllowedError'){autoplayBlocked=true;playback='paused';announce('点一次播放，就能开始听歌。');}else{playback='error';announce('这首歌暂时无法加载，点击播放重试。');}refresh();}
}
function loadSong(){++generation;audio.pause();mountedId=songs[active].id;autoplayBlocked=false;fullAudioVerified=false;audio.src=resolveSource(songs[active]);audio.load();playback='paused';refresh();}
function renderSongs(){
 const needle=search.value.trim().toLocaleLowerCase(),matched=songs.map((song,index)=>({song,index})).filter(({song})=>`${song.title} ${song.artist} ${song.album}`.toLocaleLowerCase().includes(needle));
 const fragment=document.createDocumentFragment();
 for(const {song,index} of matched){
  const button=document.createElement('button');button.type='button';button.className='music-song';button.dataset.songIndex=String(index);button.setAttribute('aria-current',index===active?'true':'false');button.setAttribute('aria-label',`选择 ${song.title}`);
  const number=document.createElement('span');number.className='music-song-number';number.textContent=String(index+1).padStart(2,'0');
  const text=document.createElement('span');text.className='music-song-text';const name=document.createElement('strong');name.textContent=song.title;
  const detail=document.createElement('small');detail.textContent=`${song.artist} · ${song.album}`;const duration=document.createElement('span');duration.className='music-song-time';duration.textContent=formatTime(song.duration);
  text.append(name,detail);button.append(number,text,duration);fragment.append(button);
 }
 if(!matched.length){const empty=document.createElement('p');empty.className='music-empty';empty.textContent='没有找到这首歌，换个歌名试试。';fragment.append(empty);}
 list.replaceChildren(fragment);count.textContent=needle?`${matched.length} / ${songs.length} 首`:`${songs.length} 首 · 完整 MP3`;
}
function select(index,{start=true,record=true}={}){
 active=(index+songs.length)%songs.length;if(record){history.push(active);if(history.length>1000)history.shift();}
 title.textContent=songs[active].title;album.textContent=`${songs[active].artist} · ${songs[active].album}`;cover.src=songs[active].cover;cover.alt='ZH的音乐时刻';renderSongs();loadSong();if(start)requestPlay();
}
function stepSong(delta){
 if(preferences.mode!=='random'){select(active+delta);return;}
 if(delta<0){if(history.length>1){history.pop();select(history.at(-1),{record:false});}return;}
 shuffleBag=shuffleBag.filter(index=>index!==active);
 if(!shuffleBag.length){shuffleBag=songs.map((_,index)=>index).filter(index=>index!==active);for(let i=shuffleBag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffleBag[i],shuffleBag[j]]=[shuffleBag[j],shuffleBag[i]];}}
 select(shuffleBag.pop()??active);
}
function setOpen(open,focus=true){panel.hidden=!open;launcher.setAttribute('aria-expanded',String(open));if(open){if(mountedId===null||autoplayBlocked)requestPlay();if(focus)panel.querySelector('.music-close').focus({preventScroll:true});}else if(focus)launcher.focus({preventScroll:true});}
function stop(message='播放已停止。'){++generation;audio.pause();audio.currentTime=0;mountedId=null;autoplayBlocked=false;playback='stopped';refresh();announce(message);}
audio.addEventListener('playing',()=>{if(mountedId===null)return;playback='playing';autoplayBlocked=false;refresh();announce(`正在播放 ${songs[active].title}，缩小后继续。`);});
audio.addEventListener('pause',()=>{if(mountedId===null)return;playback='paused';refresh();});
audio.addEventListener('loadedmetadata',()=>{fullAudioVerified=Number.isFinite(audio.duration)&&Math.abs(audio.duration-songs[active].duration)<2&&audio.duration>60;refresh();});
audio.addEventListener('timeupdate',refresh);
audio.addEventListener('error',()=>{if(mountedId===null)return;playback='error';refresh();announce('这首歌暂时无法加载，点击播放重试。');});
audio.addEventListener('ended',()=>{if(preferences.automatic)stepSong(1);else{playback='paused';refresh();announce('这首歌播放结束，可以选择下一首。');}});
playButton.addEventListener('click',()=>{if(playback==='playing')audio.pause();else requestPlay();});seek.addEventListener('input',()=>{if(Number.isFinite(audio.duration))audio.currentTime=Number(seek.value);});
volume.value=String(preferences.volume);volume.addEventListener('input',()=>{preferences.volume=Number(volume.value);audio.volume=preferences.volume;persist();});
launcher.addEventListener('click',()=>setOpen(panel.hidden));panel.querySelector('.music-close').addEventListener('click',()=>setOpen(false));
panel.querySelector('[data-music-step="-1"]').addEventListener('click',()=>stepSong(-1));panel.querySelector('[data-music-step="1"]').addEventListener('click',()=>stepSong(1));panel.querySelector('.music-stop').addEventListener('click',()=>stop());
search.addEventListener('input',renderSongs);list.addEventListener('click',event=>{const button=event.target.closest('[data-song-index]');if(button){history=[];shuffleBag=[];select(Number(button.dataset.songIndex));}});
modeControl.value=preferences.mode;autoControl.checked=preferences.automatic;
modeControl.addEventListener('change',()=>{preferences.mode=modeControl.value;shuffleBag=[];history=[active];persist();});autoControl.addEventListener('change',()=>{preferences.automatic=autoControl.checked;persist();if(preferences.automatic&&audio.paused)requestPlay();});
panel.addEventListener('keydown',event=>{if(event.key==='Escape'){setOpen(false);event.stopPropagation();}});
panel.addEventListener('pointermove',event=>{const rect=panel.getBoundingClientRect();panel.style.setProperty('--music-x',`${(event.clientX-rect.left)/rect.width*100}%`);panel.style.setProperty('--music-y',`${(event.clientY-rect.top)/rect.height*100}%`);});
document.addEventListener('play',event=>{if(event.target instanceof HTMLVideoElement&&mountedId!==null)stop('视频播放中，音乐已暂停。');},true);
// Audible autoplay is retried during a real visitor gesture when needed.
const unlock=()=>{if(preferences.automatic&&autoplayBlocked&&mountedId!==null)requestPlay();};
document.addEventListener('pointerdown',unlock,{capture:true,passive:true});document.addEventListener('keydown',unlock,{capture:true});
window.portfolioMusic={getState:()=>({total:songs.length,active,song:songs[active].title,open:!panel.hidden,mountedId,provider:'native-mp3',playback,autoplayAttempted,autoplayBlocked,mode:preferences.mode,automatic:preferences.automatic,fullAudioVerified,source:CATALOG.source,catalogDate:CATALOG.fetchedAt}),select};
select(active,{start:preferences.automatic,record:false});
