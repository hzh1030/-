// Prepare an unpublished, self-contained hosting copy. Production is unchanged.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {createReadStream} from 'node:fs';
import {Readable} from 'node:stream';
import {pipeline} from 'node:stream/promises';

const root = path.resolve(import.meta.dirname, '..');
const runtime = path.join(root, '.sites-runtime');
const target = path.join(runtime, 'domestic-site');
const packages = path.join(runtime, 'tooling/domestic-assets/node_modules');
const cache = path.join(runtime, 'domestic-downloads');
const modelURL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260929_212926_92423081-b0e4-4f5a-b650-14af6c05c058.glb';
const backgroundURL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4';
await fs.mkdir(target, {recursive: true});
await fs.mkdir(cache, {recursive: true});
await fs.cp(path.join(root, 'site'), target, {recursive: true});

async function hash(file) {
  const sum = crypto.createHash('sha256');
  for await (const chunk of createReadStream(file)) sum.update(chunk);
  return sum.digest('hex');
}

async function download(url, destination) {
  await fs.mkdir(path.dirname(destination), {recursive: true});
  const existing = await fs.stat(destination).catch(() => null);
  if (existing?.size) return;
  const response = await fetch(url, {
    signal: AbortSignal.timeout(120000),
    headers: {'user-agent': 'Mozilla/5.0 Chrome/128.0.0.0 Safari/537.36'},
  });
  if (!response.ok || !response.body) throw new Error(`Required asset download failed: ${response.status}`);
  const temporary = destination + '.partial';
  await pipeline(Readable.fromWeb(response.body), createWriteStream(temporary));
  const bytes = (await fs.stat(temporary)).size;
  const expected = Number(response.headers.get('content-length') || 0);
  // fetch decodes HTTP compression; Content-Length can describe wire bytes.
  if (!bytes || (expected && !response.headers.get('content-encoding') && bytes !== expected)) throw new Error('Incomplete asset download');
  await fs.rename(temporary, destination);
}
const {createWriteStream} = await import('node:fs');

// Keep the same pinned rendering-library versions as the existing website.
const vendor = path.join(target, 'assets/vendor');
await fs.mkdir(vendor, {recursive: true});
await fs.cp(path.join(packages, 'three/build'), path.join(vendor, 'three/build'), {recursive: true});
await fs.cp(path.join(packages, 'three/examples/jsm'), path.join(vendor, 'three/examples/jsm'), {recursive: true});
await fs.copyFile(path.join(packages, 'three/LICENSE'), path.join(vendor, 'three/LICENSE'));
await fs.cp(path.join(packages, 'ogl/src'), path.join(vendor, 'ogl/src'), {recursive: true});
await fs.copyFile(path.join(packages, 'ogl/package.json'), path.join(vendor, 'ogl/package.json'));

await Promise.all([
  download(modelURL, path.join(cache, 'hero.glb')),
  download(backgroundURL, path.join(cache, 'liquid-background.mp4')),
]);
await fs.mkdir(path.join(target, 'assets/models'), {recursive: true});
await fs.mkdir(path.join(target, 'assets/videos'), {recursive: true});
await fs.copyFile(path.join(cache, 'hero.glb'), path.join(target, 'assets/models/hero.glb'));
await fs.copyFile(path.join(cache, 'liquid-background.mp4'), path.join(target, 'assets/videos/liquid-background.mp4'));

// Fetch the exact Google Fonts CSS used by the current page, then host its fonts.
const fontURL = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap';
const fontCSSFile = path.join(cache, 'poppins.css');
await download(fontURL, fontCSSFile);
let fontCSS = await fs.readFile(fontCSSFile, 'utf8');
const fontURLs = [...new Set([...fontCSS.matchAll(/https:\/\/fonts\.gstatic\.com\/[^)\s]+/g)].map(match => match[0]))];
for (const url of fontURLs) {
  const name = path.basename(new URL(url).pathname);
  const cached = path.join(cache, 'fonts', name);
  await download(url, cached);
  await fs.mkdir(path.join(vendor, 'poppins'), {recursive: true});
  await fs.copyFile(cached, path.join(vendor, 'poppins', name));
  fontCSS = fontCSS.replaceAll(url, './poppins/' + name);
}
await fs.writeFile(path.join(vendor, 'poppins.css'), fontCSS);

for (const name of ['index.html', 'flex-carousel.js', 'glow-cursor.js', 'assets/comet/react-islands.js']) {
  const file = path.join(target, name);
  let text = await fs.readFile(file, 'utf8');
  text = text.replaceAll('https://cdn.jsdelivr.net/npm/ogl@1.0.11/+esm', '/assets/vendor/ogl/src/index.js')
    .replaceAll('https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js', '/assets/vendor/three/build/three.module.js')
    .replaceAll('https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/', '/assets/vendor/three/examples/jsm/')
    .replaceAll(modelURL, '/assets/models/hero.glb')
    .replaceAll(backgroundURL, '/assets/videos/liquid-background.mp4');
  if (name === 'index.html') {
    text = text.replace(/\s*<link[^>]+href="https:\/\/fonts\.(?:googleapis|gstatic)\.com[^>]*>/g, '')
      .replace('</head>', '<link rel="stylesheet" href="assets/vendor/poppins.css">\n</head>');
  }
  await fs.writeFile(file, text);
}

// All songs and clips come from the verified original files, without transcoding.
const media = [];
for (const [directory, category, pattern] of [
  [path.join(runtime, 'original-audio'), 'audio', /^joker-\d{3}\.mp3$/],
  [path.join(runtime, 'ngrok-share/videos'), 'videos', /^(?:concert-0[12]|girlfriend-performance|tuantuan-0[12]|tuantuan-cat|xuliang-live)\.mp4$/],
]) {
  const output = path.join(target, 'assets', category);
  await fs.mkdir(output, {recursive: true});
  for (const name of (await fs.readdir(directory)).filter(name => pattern.test(name)).sort()) {
    const source = path.join(directory, name);
    const destination = path.join(output, name);
    await fs.copyFile(source, destination);
    const sourceHash = await hash(source);
    const destinationHash = await hash(destination);
    if (sourceHash !== destinationHash) throw new Error(`Media integrity failed: ${name}`);
    media.push({path: `assets/${category}/${name}`, bytes: (await fs.stat(destination)).size, sha256: sourceHash});
  }
}
if (media.filter(file => file.path.endsWith('.mp3')).length !== 56 || media.filter(file => file.path.endsWith('.mp4')).length !== 7) {
  throw new Error('The verified 56-song / 7-video inventory is incomplete');
}
await fs.writeFile(path.join(target, 'static-host.js'), `// Media is hosted alongside this website; no desktop or foreign release server is required.\nwindow.portfolioMediaUrl = relative => new URL(relative.replace(/^assets\\/music\\//, 'assets/audio/'), document.baseURI).href;\n`);
const bytes = media.reduce((sum, file) => sum + file.bytes, 0);
const report = {
  stage: target, published: false, productionUnchanged: true,
  mediaOriginalBytesPreserved: true, media, mediaBytes: bytes, hostedFonts: fontURLs.length,
  localAssets: ['assets/models/hero.glb', 'assets/videos/liquid-background.mp4'],
  note: 'Free hosting capability, quota and actual mainland access still require account and deployment verification.',
};
await fs.writeFile(path.join(runtime, 'qa/domestic-site-manifest.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({stage: target, published: false, songs: 56, videos: 7, mediaBytes: bytes, hostedFonts: fontURLs.length}));
