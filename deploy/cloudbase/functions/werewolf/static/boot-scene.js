// The HTML image is the baseline: never hide characters behind optional checks.
// Upgrade to a fully validated decode to avoid incomplete embedded-browser PNGs.
(() => {
  const cast = document.querySelector('.boot-splash-cast');
  const target = cast?.querySelector('.boot-cast-base');
  if (!target) return;
  const expectedHash = '004a8b537060ca11af29e1cfe3fe7755fb3477c431837400ff302ff4ae2a1063';
  const directSource = target.getAttribute('src') || target.dataset.src;
  let artwork;
  let sequenceFailed = false;
  function prepareCharacterSequence() {
    if (sequenceFailed || !target.complete || !target.naturalWidth) return;
    if (artwork) {
      if (artwork.getAttribute('href') !== target.currentSrc) artwork.setAttribute('href', target.currentSrc);
      return;
    }
    try {
      // Render the original poster through separate overlapping-region masks.
      // Foreground regions subtract from those behind them, so no pixel is
      // revealed twice and the final composition keeps its original positions.
      const regions = [
        ['villager-woman', 'M0 0H1672V941H0Z'],
        ['villager-man', 'M205 186H391L448 327 462 447 407 557 233 548 208 431Z'],
        ['knight', 'M387 55H637L708 202 713 370 685 768 402 823 386 574 398 328Z'],
        ['wolf-king', 'M749 0H928L944 124 991 172 1016 250 1046 298 1040 376 1021 474 967 755 673 740 674 637 704 513 713 429 697 375 684 291 665 259 659 208 675 172 714 125Z'],
        ['witch', 'M1098 71L1178 79 1211 150 1246 185 1252 180 1247 125 1264 113 1306 120 1314 158 1300 240 1311 256 1300 319 1336 361 1310 683 1015 718 1005 506 1033 424 1047 352 1028 290 1023 242 1039 197 1026 163 1043 130Z'],
        ['guard', 'M1418 288H1672V941H1402L1387 798 1409 639 1404 478Z'],
        ['hunter', 'M1245 204L1350 204 1446 327 1481 479 1478 579 1571 693 1544 724 1467 651 1474 818 1540 941H1230L1202 746 1211 549 1224 400Z'],
        ['elder', 'M297 377L325 371 350 381 361 404 361 425 349 446 366 465 395 484 430 602 411 797 378 927H112L111 822 139 710 142 567 161 481 182 455 213 438 249 420 276 412 284 393Z'],
        ['girl', 'M348 471L421 465 459 515 478 574 507 599 509 670 548 746 572 797 644 875 622 941H220L218 861 260 802 287 718 309 646 330 574Z'],
        ['wolf', 'M573 412L615 376 670 394 709 422 769 453 813 502 851 581 868 653 902 745 918 839 962 915 962 941H752L714 889 682 850 653 765 619 831 614 893 558 919H448L465 865 501 805 527 736 517 685 480 694 473 646 480 624 541 621 582 607 613 600 617 583 603 573 589 556 582 536 565 523 566 563 560 572 561 588 548 580 554 565 538 574 539 559 518 570 519 549 515 545 517 530 529 516 534 502 531 491 544 463 549 442Z'],
        ['seer', 'M1030 288L1073 288 1119 310 1139 368 1158 396 1206 424 1228 456 1244 487 1242 524 1261 557 1272 595 1330 602 1374 636 1382 691 1360 736 1362 795 1405 819 1450 831 1405 830 1385 828 1358 845 1338 850 1328 865 1335 869 1327 885 1304 893 1288 890 1309 941H1026L990 926 944 923 919 906 903 887 883 877 890 862 876 856 873 838 891 816 876 799 874 777 892 751 886 739 863 751 855 741 869 706 890 672 897 640 914 603 921 557 942 503 949 471 961 419 985 382 1006 337 1024 318Z'],
      ];
      // Reveal front-to-back: existing occlusions are already covered when a
      // figure behind them arrives, instead of exposing cut-out body sections.
      const order = ['seer','wolf','girl','elder','hunter','guard','witch','wolf-king','knight','villager-man','villager-woman'];
      const ns = 'http://www.w3.org/2000/svg';
      const element = (name, attributes = {}) => {
        const node = document.createElementNS(ns, name);
        for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
        return node;
      };
      const svg = element('svg', { class: 'boot-cast-actors', viewBox: '0 0 1672 941', 'aria-hidden': 'true', focusable: 'false' });
      const defs = element('defs');
      artwork = element('image', { id: 'boot-character-artwork', width: '1672', height: '941' });
      defs.append(artwork);
      regions.forEach(([name, path], index) => {
        const mask = element('mask', { id: `boot-region-${name}`, maskUnits: 'userSpaceOnUse', x: '0', y: '0', width: '1672', height: '941', style: 'mask-type:luminance' });
        mask.append(element('path', { d: path, fill: 'white' }));
        for (const [, front] of regions.slice(index + 1)) mask.append(element('path', { d: front, fill: 'black' }));
        defs.append(mask);
      });
      svg.append(defs);
      order.forEach((name, index) => {
        const layer = element('g', { class: 'boot-character-layer', 'data-character': name, style: `--character-arrival:${(1.2 + index * 0.43).toFixed(2)}s`, mask: `url(#boot-region-${name})` });
        layer.append(element('use', { href: '#boot-character-artwork' }));
        svg.append(layer);
      });
      artwork.addEventListener('load', () => {
        // Match the existing opening clock, also when a slow image finishes late.
        if (!cast.classList.contains('is-sequential')) {
          cast.style.setProperty('--boot-sequence-offset', `${-(performance.now() / 1000)}s`);
          cast.classList.add('is-sequential');
        }
      });
      artwork.addEventListener('error', () => {
        sequenceFailed = true;
        cast.classList.remove('is-sequential');
        svg.remove();
      });
      cast.append(svg);
      artwork.setAttribute('href', target.currentSrc);
    } catch (error) {
      sequenceFailed = true;
      cast.classList.remove('is-sequential');
      cast.querySelector('.boot-cast-actors')?.remove();
      console.warn('Character sequence unavailable; keeping original illustration:', error.message);
    }
  }
  const markVisible = () => {
    if (!target.complete || !target.naturalWidth) return false;
    cast.classList.add('is-ready');
    if (cast.dataset.imageState !== 'ready') cast.dataset.imageState = 'fallback';
    prepareCharacterSequence();
    return true;
  };
  target.addEventListener('load', markVisible);
  markVisible();
  const nativeReady = new Promise(resolve => {
    if (markVisible()) { resolve(true); return; }
    const finish = () => {
      clearTimeout(timer);
      target.removeEventListener('load', finish);
      target.removeEventListener('error', finish);
      resolve(markVisible());
    };
    const timer = setTimeout(finish, 8000);
    target.addEventListener('load', finish);
    target.addEventListener('error', finish);
  });
  let objectUrl;
  window.bootSceneReady = (async () => {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);
      let candidateUrl;
      let promoted = false;
      try {
        const url = new URL(target.dataset.src, location.href);
        if (attempt) url.searchParams.set('retry', Date.now().toString());
        const response = await fetch(url, { cache: 'reload', signal: controller.signal });
        if (!response.ok) throw new Error(`Illustration HTTP ${response.status}`);
        const bytes = await response.arrayBuffer();
        if (bytes.byteLength !== 2625688) throw new Error('Incomplete illustration');
        if (window.crypto?.subtle) {
          const digest = await crypto.subtle.digest('SHA-256', bytes);
          const hash = Array.from(new Uint8Array(digest), n => n.toString(16).padStart(2, '0')).join('');
          if (hash !== expectedHash) throw new Error('Illustration checksum mismatch');
        }
        candidateUrl = URL.createObjectURL(new Blob([bytes], { type: 'image/png' }));
        const decoded = new Image();
        decoded.src = candidateUrl;
        await decoded.decode();
        if (decoded.naturalWidth !== 1672 || decoded.naturalHeight !== 941) throw new Error('Unexpected illustration size');
        // Also works on LAN HTTP where Web Crypto is not available.
        const canvas = document.createElement('canvas');
        canvas.width = 1672; canvas.height = 1;
        const context = canvas.getContext('2d');
        context.drawImage(decoded, 0, 890, 1672, 1, 0, 0, 1672, 1);
        const pixels = context.getImageData(0, 0, 1672, 1).data;
        let visible = 0;
        for (let i = 3; i < pixels.length; i += 4) if (pixels[i] > 128) visible += 1;
        if (visible < 500) throw new Error('Illustration foot region missing');
        target.src = candidateUrl;
        promoted = true;
        await target.decode();
        objectUrl = candidateUrl;
        cast.classList.add('is-ready');
        cast.dataset.imageState = 'ready';
        return true;
      } catch (error) {
        // A rejected enhancement must not leave the img pointing at a revoked blob.
        if (promoted) target.src = directSource;
        if (candidateUrl) URL.revokeObjectURL(candidateUrl);
        if (attempt === 1) {
          cast.dataset.validationState = 'failed';
          if (!markVisible()) cast.dataset.imageState = 'loading';
          console.warn('Opening illustration enhancement unavailable; keeping native image:', error.message);
        }
      } finally {
        clearTimeout(timeout);
      }
    }
    return markVisible() || await nativeReady;
  })();
  window.addEventListener('pagehide', event => {
    if (!event.persisted && objectUrl) URL.revokeObjectURL(objectUrl);
  });
})();
