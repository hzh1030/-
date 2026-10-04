// Cloud media URLs remain stable across frontend deployments. Local previews
// use the byte-identical originals on disk, independently of cloud access.
const localMedia = ['localhost', '127.0.0.1'].includes(location.hostname) || location.hostname.endsWith('.ngrok-free.dev');
const cloudMedia = 'https://github.com/hzh1030/-/releases/download/portfolio-media-v1/';
window.portfolioMediaUrl = relative => {
  const file = relative.split('?')[0].split('/').at(-1);
  if (!/^(?:joker-\d{3}\.mp3|[a-z0-9-]+\.mp4)$/.test(file)) return new URL(relative, document.baseURI).href;
  return localMedia ? new URL(relative, document.baseURI).href : cloudMedia + file;
};
for (const source of document.querySelectorAll('video source[src^="assets/videos/"]')) source.src = window.portfolioMediaUrl(source.getAttribute('src'));
for (const link of document.querySelectorAll('a.video-file-link[href^="assets/videos/"]')) link.href = window.portfolioMediaUrl(link.getAttribute('href'));
