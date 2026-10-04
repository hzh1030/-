import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve(import.meta.dirname, '..');
const source = 'D:/AI/ai小游戏/游戏初识';
const target = path.join(root, 'deploy/cloudbase/functions/werewolf');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const evidence = [];

function copy(sourceFile, targetFile, transform) {
  const original = fs.readFileSync(sourceFile);
  const data = transform ? Buffer.from(transform(original.toString('utf8'))) : original;
  fs.mkdirSync(path.dirname(targetFile), {recursive: true});
  fs.writeFileSync(targetFile, data);
  evidence.push({path: path.relative(target, targetFile).replaceAll('\\', '/'), sourceSHA256: sha(original), SHA256: sha(data), bytes: data.length, changed: !original.equals(data)});
}

for (const name of ['server.py', 'werewolf_engine.py', 'network_settings.py']) {
  copy(path.join(source, name), path.join(target, name));
}

for (const entry of fs.readdirSync(path.join(source, 'static'), {withFileTypes: true})) {
  if (!entry.isFile()) continue;
  const name = entry.name;
  copy(path.join(source, 'static', name), path.join(target, 'static', name), text => {
    text = text.replaceAll('/static/', '/game/static/').replaceAll('/api/', '/game/api/').replaceAll('/service-worker.js', '/game/service-worker.js');
    for (const [before, after] of [
      ['手机与电脑连接同一局域网', '手机流量或不同 Wi-Fi 都能加入同一个房间'],
      ['局域网加入链接', '在线加入链接'],
      ['局域网可发现房间', '在线公开房间'],
      ['创建房间后，可将局域网链接发送到手机。', '创建房间后，将邀请链接发送给朋友即可加入。'],
      ['当前为局域网房间：手机请连接与电脑相同的路由器网络，不能用流量或异地网络。房主须保持游戏开启；重开游戏后请重新发送邀请。', '当前为云端在线房间：朋友使用手机流量或不同 Wi-Fi，都可以打开邀请链接加入。无需房主电脑保持开机。'],
      ['同一局域网 · 扫码或房间号加入', '在线联机 · 扫码或房间号加入'],
      ['复制上方局域网链接到手机浏览器', '复制上方邀请链接到手机浏览器'],
      ['将房间链接发送到同一局域网的手机；打开链接后即可入房并一起游戏。', '将邀请链接发给朋友；使用手机流量或不同 Wi-Fi 都能入房一起玩。'],
      ['链接已复制，可发送给同一 Wi-Fi 的好友。', '链接已复制，可发送给任何网络下的好友。'],
    ]) text = text.replaceAll(before, after);
    if (name === 'app.js') {
      text = text.replace('${window.location.host}/ws', '${window.location.host}/game/ws')
        .replaceAll('已连接到局域网房间服务。', '已连接到在线房间服务。');
    }
    if (name === 'manifest.webmanifest') {
      const manifest = JSON.parse(text);
      Object.assign(manifest, {id: '/game/', start_url: '/game/', scope: '/game/', description: '在线多人狼人杀游戏'});
      text = JSON.stringify(manifest, null, 2) + '\n';
    }
    if (name === 'service-worker.js') {
      text = text.replace('lan-werewolf-static-v26-sequential-opening', 'zh-werewolf-static-v2')
        .replaceAll('"/"', '"/game/"')
        .replace('key !== CACHE_NAME', 'key.startsWith("zh-werewolf-static-") && key !== CACHE_NAME')
        .replace('url.pathname.startsWith("/game/api/")', '!url.pathname.startsWith("/game/") || url.pathname.startsWith("/game/api/")');
    }
    return text;
  });
}

for (const name of fs.readdirSync(path.join(source, 'static/images'))) {
  const file = path.join(source, 'static/images', name);
  if (fs.statSync(file).isFile()) copy(file, path.join(target, 'static/images', name));
}

const report = {source, target, published: false, originalProjectUnmodified: true, files: evidence, originalRulesPreserved: evidence.filter(e => /^(server|werewolf_engine|network_settings)\.py$/.test(e.path)).every(e => !e.changed)};
fs.mkdirSync(path.join(root, '.sites-runtime/qa'), {recursive: true});
fs.writeFileSync(path.join(root, '.sites-runtime/qa/cloudbase-game-source.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({files: evidence.length, bytes: evidence.reduce((n, e) => n + e.bytes, 0), originalRulesPreserved: report.originalRulesPreserved, published: false}));
