// GitHub Pages hosts the portfolio files; original videos remain on Sites.
if (location.hostname === 'hzh1030.github.io') {
  const origin = 'https://zh-personal-space-20261003.sleek-goby-0888.chatgpt.site/';
  for (const source of document.querySelectorAll('video source[src^="assets/videos/"]')) source.src = new URL(source.getAttribute('src'), origin).href;
  for (const link of document.querySelectorAll('a.video-file-link[href^="assets/videos/"]')) link.href = new URL(link.getAttribute('href'), origin).href;
}
