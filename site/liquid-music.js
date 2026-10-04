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
let active = 0;
let mountedId = null;

const formatTime = seconds => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
function mountPlayer() {
  const song = songs[active];
  if (mountedId === song.id) return;
  const frame = document.createElement('iframe');
  frame.title = `${song.title} · QQ音乐官方播放器，点击播放并可拖动进度`;
  frame.src = `https://i.y.qq.com/n2/m/outchain/player/index.html?songid=${song.id}&songtype=0`;
  frame.allow = 'autoplay';
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  mount.replaceChildren(frame);
  mountedId = song.id;
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
  const song = songs[active];
  title.textContent = song.title;
  album.textContent = song.subtitle || song.album;
  cover.src = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${song.albumMid}.jpg?max_age=2592000`;
  cover.alt = `${song.album}专辑封面`;
  sourceLink.href = `https://y.qq.com/n/ryqq/songDetail/${song.mid}`;
  live.textContent = `已选择 ${song.title}，在下方QQ音乐播放器中点击播放。`;
  renderSongs();
  if (!panel.hidden) mountPlayer();
}
function setOpen(open) {
  panel.hidden = !open;
  launcher.setAttribute('aria-expanded', String(open));
  if (open) { mountPlayer(); panel.querySelector('.music-close').focus({ preventScroll: true }); }
  else { mount.replaceChildren(); mountedId = null; launcher.focus({ preventScroll: true }); }
}
launcher.addEventListener('click', () => setOpen(panel.hidden));
panel.querySelector('.music-close').addEventListener('click', () => setOpen(false));
panel.querySelector('[data-music-step="-1"]').addEventListener('click', () => select(active - 1));
panel.querySelector('[data-music-step="1"]').addEventListener('click', () => select(active + 1));
panel.querySelector('.music-stop').addEventListener('click', () => { mount.replaceChildren(); mountedId = null; live.textContent = '播放已停止，点击下方按钮重新载入。'; const button = document.createElement('button'); button.type = 'button'; button.textContent = '重新载入播放器'; button.className = 'music-reload'; button.onclick = mountPlayer; mount.append(button); });
search.addEventListener('input', renderSongs);
list.addEventListener('click', event => { const button = event.target.closest('[data-song-index]'); if (button) select(Number(button.dataset.songIndex)); });
panel.addEventListener('keydown', event => { if (event.key === 'Escape') { setOpen(false); event.stopPropagation(); } });
panel.addEventListener('pointermove', event => { const rect = panel.getBoundingClientRect(); panel.style.setProperty('--music-x', `${((event.clientX - rect.left) / rect.width) * 100}%`); panel.style.setProperty('--music-y', `${((event.clientY - rect.top) / rect.height) * 100}%`); });
document.addEventListener('play', event => { if (event.target instanceof HTMLMediaElement && mountedId !== null) { mount.replaceChildren(); mountedId = null; live.textContent = '视频播放中，音乐已停止。'; const button = document.createElement('button'); button.type = 'button'; button.className = 'music-reload'; button.textContent = '载入音乐播放器'; button.onclick = mountPlayer; mount.append(button); } }, true);
window.portfolioMusic = { getState: () => ({ total: songs.length, active, song: songs[active].title, open: !panel.hidden, mountedId, source: CATALOG.source, catalogDate: CATALOG.fetchedAt }), select };
select(0);
