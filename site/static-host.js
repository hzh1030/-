// GitHub Pages hosts the portfolio files; original videos remain on Sites.
if (location.hostname === 'hzh1030.github.io') {
  const origin = 'https://zh-personal-space-20261003.sleek-goby-0888.chatgpt.site/';
  for (const source of document.querySelectorAll('video source[src^="assets/videos/"]')) source.src = new URL(source.getAttribute('src'), origin).href;
  for (const link of document.querySelectorAll('a.video-file-link[href^="assets/videos/"]')) link.href = new URL(link.getAttribute('href'), origin).href;
}

// The cloud copy keeps photos and projects available when the home computer is off.
// Original-quality videos open in the separate, currently running full portfolio.
if (['rawcdn.githack.com', 'raw.githack.com'].includes(location.hostname)) {
  const fullSite = 'https://tamper-reason-opposing.ngrok-free.dev/zh/';
  const style = document.createElement('style');
  style.textContent = '.cloud-video-entry{display:block;position:relative;color:#effaff;text-decoration:none;background:#071018;overflow:hidden;border-radius:14px}.cloud-video-entry img{display:block;width:100%;max-height:420px;object-fit:contain}.cloud-video-entry span{display:block;padding:14px 16px;background:linear-gradient(120deg,#102734,#112036);font-size:14px}.cloud-video-entry:hover span{color:#67e8f9}.cloud-video-entry:focus-visible{outline:2px solid #67e8f9;outline-offset:4px}';
  document.head.append(style);
  for (const video of document.querySelectorAll('.video-card video')) {
    const card = video.closest('.video-card');
    const section = card.closest('section[id]');
    const url = fullSite + (section ? '#' + section.id : '#life');
    const entry = document.createElement('a');
    entry.className = 'cloud-video-entry';
    entry.href = url;
    entry.target = '_blank';
    entry.rel = 'noopener noreferrer';
    const poster = document.createElement('img');
    poster.src = video.poster;
    poster.alt = card.querySelector('figcaption span')?.textContent || '视频封面';
    poster.loading = 'lazy';
    const label = document.createElement('span');
    label.textContent = '▷ 打开原画质视频 ↗';
    entry.append(poster, label);
    video.pause();
    video.removeAttribute('src');
    video.querySelectorAll('source').forEach(source => source.remove());
    video.hidden = true;
    card.insertBefore(entry, video);
    const download = card.querySelector('.video-file-link');
    if (download) {
      download.href = url;
      download.removeAttribute('download');
      download.target = '_blank';
      download.rel = 'noopener noreferrer';
      download.textContent = '原画质视频在完整个站打开';
    }
    const error = card.querySelector('.video-error');
    if (error) error.hidden = true;
  }
}
