import CATALOG from './music-catalog.js';

const launcher = document.querySelector('#music-launcher');
const panel = document.querySelector('#liquid-music');
const list = panel.querySelector('.music-song-list');
const mount = panel.querySelector('.music-embed');
const search = panel.querySelector('#music-search');
const title = panel.querySelector('.music-current-title');
const album = panel.querySelector('.music-current-album');
const cover = panel.querySelector('.music-cover');
const sourceLink = panel.querySelector('.music-official-song');
const count = panel.querySelector('.music-catalog-count');
const live = panel.querySelector('.music-live');
const songs = CATALOG.songs;
const modeControl = panel.querySelector('#music-mode');
const autoControl = panel.querySelector('#music-auto');
let preferences = { mode: 'sequential', automatic: true };
try { const saved = JSON.parse(localStorage.getItem('zh-music-preferences')); if (['sequential', 'random'].includes(saved?.mode)) preferences.mode = saved.mode; if (typeof saved?.automatic === 'boolean') preferences.automatic = saved.automatic; } catch {}
let shuffleBag = [], history = [];
const persistPreferences = () => { try { localStorage.setItem('zh-music-preferences', JSON.stringify(preferences)); } catch {} };
function syncPreferences() { modeControl.value = preferences.mode; autoControl.checked = preferences.automatic; autoControl.disabled = provider === 'qq-official'; }
function stepSong(delta) {
  if (preferences.mode !== 'random') { select(active + delta); return; }
  if (delta < 0) { if (history.length > 1) { history.pop(); select(history.pop()); } return; }
  shuffleBag = shuffleBag.filter(index => index !== active);
  if (!shuffleBag.length) { shuffleBag = songs.map((_, index) => index).filter(index => index !== active); for (let i = shuffleBag.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffleBag[i], shuffleBag[j]] = [shuffleBag[j], shuffleBag[i]]; } }
  select(shuffleBag.pop() ?? active);
}
function requestPlay() { if (provider === 'qq-sdk' && player) { if (player.data?.song?.mid === songs[active].mid) player.play(); else player.play(songs[active].mid, { tryPlay: false }); } }
let active = 0;
let mountedId = null;
let generation = 0;
let player = null;
let sdkPromise = null;
let provider = 'stopped';
let playback = 'stopped';
let autoplayAttempted = false;
let autoplayBlocked = false;
let hasStarted = false;
let nativeControls = null;
let handlers = [];

const formatTime = value => { const seconds = Math.max(0, Math.floor(Number(value) || 0)); return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`; };
function announce(message) { live.textContent = message; }
function updateLauncher() {
  launcher.querySelector('span').textContent = mountedId === null ? '听薛之谦' : `${songs[active].title} · ${autoplayBlocked ? '点此播放' : playback === 'playing' ? '播放中' : '展开'}`;
}
function detachPlayer() {
  if (!player) return;
  for (const [event, handler] of handlers) player.off(event, handler);
  handlers = [];
  player.pause();
}
function loadSdk() {
  if (window.QMPlayer) return Promise.resolve(window.QMPlayer);
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const timer = setTimeout(() => reject(new Error('QQ music unavailable')), 8000);
    script.src = 'https://y.qq.com/component/m/qmplayer/qmplayer.full.js?max_age=604800';
    script.onload = () => { clearTimeout(timer); window.QMPlayer ? resolve(window.QMPlayer) : reject(new Error('QQ player unavailable')); };
    script.onerror = () => { clearTimeout(timer); reject(new Error('QQ music unavailable')); };
    document.head.append(script);
  });
  return sdkPromise;
}
function mountOfficialFrame(song, token) {
  if (token !== generation || mountedId !== song.id) return;
  detachPlayer(); nativeControls = null; provider = 'qq-official'; playback = 'needs-qq'; autoplayBlocked = false;
  updateLauncher(); syncPreferences();
  const link = document.createElement('a'); link.className = 'music-open-full'; link.textContent = '去 QQ 音乐播放 ↗'; link.href = sourceLink.href; link.target = '_blank'; link.rel = 'noopener noreferrer'; mount.replaceChildren(link);
  announce('站内未获得完整音频，请在 QQ 音乐登录并按曲目权限播放。外部页面需手动控制。');
}
function drawControls(song) {
  const controls = document.createElement('div');
  controls.className = 'music-inline-controls';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'music-play';
  button.textContent = '播放';
  button.setAttribute('aria-label', `播放 ${song.title}`);
  const seek = document.createElement('input');
  seek.type = 'range'; seek.className = 'music-progress'; seek.min = '0'; seek.max = String(song.duration); seek.step = '0.1'; seek.value = '0';
  seek.setAttribute('aria-label', '歌曲播放进度');
  const time = document.createElement('span');
  time.className = 'music-time';
  time.textContent = `0:00 / ${formatTime(song.duration)}`;
  const timeline = document.createElement('div'); timeline.append(seek, time);
  controls.append(button, timeline);
  mount.replaceChildren(controls);
  button.addEventListener('click', () => {
    if (!player || provider !== 'qq-sdk') return;
    if (playback === 'playing') player.pause();
    else { playback = 'loading'; announce('正在打开歌曲…'); requestPlay(); }
  });
  seek.addEventListener('input', () => { if (player && provider === 'qq-sdk') player.currentTime = Number(seek.value); });
  nativeControls = { button, seek, time };
}
function refreshControls() {
  if (!nativeControls) return;
  const isPlaying = playback === 'playing';
  nativeControls.button.textContent = isPlaying ? '暂停' : '播放';
  nativeControls.button.setAttribute('aria-label', `${isPlaying ? '暂停' : '播放'} ${songs[active].title}`);
}
async function mountPlayer() {
  const song = songs[active];
  if (mountedId === song.id) return;
  const token = ++generation;
  detachPlayer();
  mountedId = song.id;
  hasStarted = false; autoplayBlocked = false;
  provider = 'loading'; playback = 'loading';
  syncPreferences();
  drawControls(song);
  nativeControls.button.disabled = true;
  updateLauncher();
  announce('正在打开歌曲…');
  try {
    const QMPlayer = await loadSdk();
    if (token !== generation) return;
    player ||= new QMPlayer();
    player.target = 'web';
    player.loop = false;
    provider = 'qq-sdk';
    syncPreferences();
    nativeControls.button.disabled = false;
    const listen = (event, handler) => {
      const guarded = data => { if (token === generation && provider === 'qq-sdk') handler(data); };
      player.on(event, guarded); handlers.push([event, guarded]);
    };
    listen('play', () => { playback = 'playing'; hasStarted = true; autoplayBlocked = false; updateLauncher(); announce(`正在播放 ${song.title}，缩小后音乐会继续。`); refreshControls(); });
    listen('pause', () => { playback = 'paused'; autoplayBlocked = !hasStarted; updateLauncher(); announce('点击播放，开始听歌。'); refreshControls(); });
    listen('timeupdate', event => {
      const actualDuration = Number(player.duration);
      if (actualDuration > 0 && actualDuration < song.duration - 10) { mountOfficialFrame(song, token); return; }
      const duration = actualDuration || song.duration;
      const time = Number(event.currentTime) || 0;
      nativeControls.seek.max = String(duration);
      nativeControls.seek.value = String(time);
      nativeControls.time.textContent = `${formatTime(time)} / ${formatTime(duration)}`;
    });
    listen('ended', () => { if (preferences.automatic) stepSong(1); else { playback = 'paused'; updateLauncher(); announce('这首歌播放结束，可以选择下一首。'); refreshControls(); } });
    listen('error', () => mountOfficialFrame(song, token));
    autoplayAttempted = true;
    requestPlay();
  } catch { mountOfficialFrame(song, token); }
}
function renderSongs() {
  const needle = search.value.trim().toLocaleLowerCase();
  const matched = songs.map((song, index) => ({ song, index })).filter(({ song }) => `${song.title} ${song.subtitle || ''} ${song.album}`.toLocaleLowerCase().includes(needle));
  const fragment = document.createDocumentFragment();
  for (const { song, index } of matched) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'music-song';
    button.dataset.songIndex = String(index);
    button.setAttribute('aria-current', index === active ? 'true' : 'false');
    button.setAttribute('aria-label', `选择 ${song.title}${song.subtitle ? '，' + song.subtitle : ''}`);
    const number = document.createElement('span'); number.className = 'music-song-number'; number.textContent = String(index + 1).padStart(2, '0');
    const text = document.createElement('span'); text.className = 'music-song-text';
    const name = document.createElement('strong'); name.textContent = song.title;
    const detail = document.createElement('small'); detail.textContent = song.subtitle || song.album;
    const time = document.createElement('span'); time.className = 'music-song-time'; time.textContent = formatTime(song.duration);
    text.append(name, detail); button.append(number, text, time); fragment.append(button);
  }
  if (!matched.length) { const empty = document.createElement('p'); empty.className = 'music-empty'; empty.textContent = '没有找到这首歌，换个歌名试试。'; fragment.append(empty); }
  list.replaceChildren(fragment);
  count.textContent = needle ? `${matched.length} / ${songs.length} 个版本` : `${songs.length} 个版本 · 含现场与伴奏`;
}
function select(index) {
  active = (index + songs.length) % songs.length;
  history.push(active); if (history.length > 1000) history.shift();
  const song = songs[active];
  title.textContent = song.title;
  album.textContent = song.subtitle || song.album;
  cover.src = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${song.albumMid}.jpg?max_age=2592000`;
  cover.alt = `${song.album}专辑封面`;
  sourceLink.href = `https://y.qq.com/n/ryqq/songDetail/${song.mid}`;
  renderSongs();
  if (!panel.hidden || mountedId !== null) mountPlayer();
}
function setOpen(open, focus = true) {
  panel.hidden = !open;
  launcher.setAttribute('aria-expanded', String(open));
  if (open) { mountPlayer(); if (focus) panel.querySelector('.music-close').focus({ preventScroll: true }); }
  else if (focus) launcher.focus({ preventScroll: true });
}
function stop(message = '播放已停止，点击下方按钮重新打开。') {
  ++generation;
  detachPlayer();
  provider = 'stopped'; playback = 'stopped'; nativeControls = null; autoplayBlocked = false;
  mountedId = null;
  syncPreferences();
  updateLauncher(); announce(message);
  const button = document.createElement('button'); button.type = 'button'; button.textContent = '打开音乐播放器'; button.className = 'music-reload'; button.onclick = mountPlayer;
  mount.replaceChildren(button);
}
launcher.addEventListener('click', () => {
  const open = panel.hidden;
  setOpen(open);
  if (open && autoplayBlocked && provider === 'qq-sdk') requestPlay();
});
panel.querySelector('.music-close').addEventListener('click', () => setOpen(false));
panel.querySelector('[data-music-step="-1"]').addEventListener('click', () => stepSong(-1));
panel.querySelector('[data-music-step="1"]').addEventListener('click', () => stepSong(1));
panel.querySelector('.music-stop').addEventListener('click', () => stop());
search.addEventListener('input', renderSongs);
list.addEventListener('click', event => { const button = event.target.closest('[data-song-index]'); if (button) { history = []; shuffleBag = []; select(Number(button.dataset.songIndex)); } });
modeControl.addEventListener('change', () => { preferences.mode = modeControl.value; shuffleBag = []; history = [active]; persistPreferences(); });
autoControl.addEventListener('change', () => { preferences.automatic = autoControl.checked; persistPreferences(); });
panel.addEventListener('keydown', event => { if (event.key === 'Escape') { setOpen(false); event.stopPropagation(); } });
panel.addEventListener('pointermove', event => { const rect = panel.getBoundingClientRect(); panel.style.setProperty('--music-x', `${((event.clientX - rect.left) / rect.width) * 100}%`); panel.style.setProperty('--music-y', `${((event.clientY - rect.top) / rect.height) * 100}%`); });
document.addEventListener('play', event => { if (event.target instanceof HTMLVideoElement && mountedId !== null) stop('视频播放中，音乐已停止。'); }, true);
window.portfolioMusic = { getState: () => ({ total: songs.length, active, song: songs[active].title, open: !panel.hidden, mountedId, provider, playback, autoplayAttempted, autoplayBlocked, mode: preferences.mode, automatic: preferences.automatic, fullAudioVerified: false, source: CATALOG.source, catalogDate: CATALOG.fetchedAt }), select };
select(0);
syncPreferences();
if (preferences.automatic) mountPlayer();
