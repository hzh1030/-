"use strict";
(() => {
  const canvas = document.querySelector("#ambient-canvas");
  const scene = document.querySelector(".ambient-scene");
  const toggle = document.querySelector("#motion-toggle");
  const ctx = canvas?.getContext("2d");
  if (!ctx || !scene || !toggle) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  let enabled = !reduced.matches;
  let width = 0, height = 0, frame = 0, lastTime = 0;
  let ripples = [];
  let stars = [];
  const pointer = {x: 0, y: 0, targetX: 0, targetY: 0, active: false};
  const cards = [...document.querySelectorAll(".hero-art, .achievement-card, .featured-game")];
  cards.forEach(card => card.classList.add("reactive-card"));

  function resize() {
    width = innerWidth;
    height = innerHeight;
    const scale = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    stars = Array.from({length: Math.min(110, Math.max(38, Math.round(width * height / 14000)))}, () => ({
      x: Math.random() * width, y: Math.random() * height,
      radius: .7 + Math.random() * 1.2, phase: Math.random() * Math.PI * 2
    }));
    ripples = [];
    paint(0);
  }

  function paint(time) {
    ctx.clearRect(0, 0, width, height);
    const seconds = time / 1000;
    const drift = pointer.active ? (pointer.y / height - .5) * height * .08 : 0;
    const shades = [[117,94,212], [42,151,221], [30,178,176]];
    for (let band = 0; band < (width < 600 ? 2 : 3); band++) {
      const center = height * (.23 + band * .22) + drift;
      const thickness = height * .16;
      const phase = seconds * .22 + band * 1.7 + (pointer.active ? pointer.x / width * .5 : 0);
      const waveY = x => center + Math.sin(x / width * 4.8 + phase) * height * .08 + Math.sin(x / width * 8 - phase * .7) * height * .025;
      const [r, g, b] = shades[band];
      const ribbon = ctx.createLinearGradient(0, center - height * .2, width * .3, center + thickness + height * .14);
      ribbon.addColorStop(0, `rgba(${r},${g},${b},0)`);
      ribbon.addColorStop(.35, `rgba(${r},${g},${b},.055)`);
      ribbon.addColorStop(.55, `rgba(${r},${g},${b},.13)`);
      ribbon.addColorStop(.7, `rgba(${r},${g},${b},.06)`);
      ribbon.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = ribbon;
      ctx.beginPath(); ctx.moveTo(-80, waveY(-80));
      for (let i = 0; i <= 40; i++) {const x = -80 + (width + 160) * i / 40; ctx.lineTo(x, waveY(x));}
      for (let i = 40; i >= 0; i--) {const x = -80 + (width + 160) * i / 40; ctx.lineTo(x, waveY(x) + thickness);}
      ctx.closePath(); ctx.fill();
    }
    for (const star of stars) {
      const close = enabled && pointer.active && Math.hypot(star.x - pointer.x, star.y - pointer.y) < 170;
      const light = .17 + (Math.sin(seconds * .75 + star.phase) + 1) * .14 + (close ? .18 : 0);
      ctx.fillStyle = `rgba(197,220,255,${light})`;
      ctx.beginPath(); ctx.arc(star.x, star.y, star.radius + (close ? .35 : 0), 0, Math.PI * 2); ctx.fill();
    }
    if (enabled && seconds > 0) {
      const cycle = seconds % 12;
      if (cycle < 1.5) {
        const x = width * .7 - cycle * width * .24, y = height * .14 + cycle * height * .2;
        const trail = ctx.createLinearGradient(x, y, x + 100, y - 65);
        trail.addColorStop(0, "rgba(222,239,255,.75)");
        trail.addColorStop(1, "rgba(160,199,255,0)");
        ctx.fillStyle = trail; ctx.beginPath();
        ctx.moveTo(x, y); ctx.lineTo(x + 100, y - 65); ctx.lineTo(x + 102, y - 63); ctx.lineTo(x + 1.5, y + 1.5);
        ctx.closePath(); ctx.fill();
      }
    }
    ripples = ripples.filter(ripple => time - ripple.start < 1100);
    for (const ripple of ripples) {
      const age = (time - ripple.start) / 1100;
      const radius = 40 + age * 200;
      const glow = ctx.createRadialGradient(ripple.x, ripple.y, 0, ripple.x, ripple.y, radius);
      glow.addColorStop(0, `rgba(74,187,214,${(1 - age) * .28})`);
      glow.addColorStop(.45, `rgba(143,113,213,${(1 - age) * .16})`);
      glow.addColorStop(1, "rgba(143,113,213,0)");
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2); ctx.fill();
    }
  }

  function animate(time) {
    frame = 0;
    if (!enabled || document.hidden) return;
    if (!lastTime || time - lastTime >= 32) {
      lastTime = time;
      if (pointer.active) {
        pointer.x += (pointer.targetX - pointer.x) * .16;
        pointer.y += (pointer.targetY - pointer.y) * .16;
        scene.style.setProperty("--pointer-x", `${pointer.x}px`);
        scene.style.setProperty("--pointer-y", `${pointer.y}px`);
        scene.style.setProperty("--drift-x", `${(pointer.x / width - .5) * 110}px`);
        scene.style.setProperty("--drift-y", `${(pointer.y / height - .5) * 80}px`);
      }
      paint(time);
    }
    frame = requestAnimationFrame(animate);
  }

  function sync() {
    cancelAnimationFrame(frame);
    frame = 0; lastTime = 0;
    toggle.setAttribute("aria-pressed", String(enabled));
    toggle.title = enabled ? "关闭背景动效" : "开启背景动效";
    toggle.querySelector(".motion-state").textContent = enabled ? "开" : "关";
    document.body.classList.toggle("motion-enabled", enabled);
    document.body.classList.toggle("motion-hidden", document.hidden);
    scene.classList.toggle("pointer-active", enabled && pointer.active);
    if (!enabled) {ripples = []; paint(0);}
    if (enabled && !document.hidden) frame = requestAnimationFrame(animate);
  }

  toggle.hidden = false;
  toggle.addEventListener("click", () => {enabled = !enabled; sync();});
  reduced.addEventListener("change", () => {enabled = !reduced.matches; sync();});
  document.addEventListener("visibilitychange", sync);
  window.addEventListener("resize", resize, {passive: true});
  document.addEventListener("pointermove", event => {
    if (!enabled || !finePointer.matches || event.pointerType === "touch" || document.body.classList.contains("dialog-open")) return;
    pointer.targetX = event.clientX; pointer.targetY = event.clientY;
    if (!pointer.active) {pointer.x = event.clientX; pointer.y = event.clientY;}
    pointer.active = true; scene.classList.add("pointer-active");
  }, {passive: true});
  document.documentElement.addEventListener("pointerleave", () => {pointer.active = false; scene.classList.remove("pointer-active");});
  document.addEventListener("pointerdown", event => {
    if (!enabled || !event.isPrimary || event.button !== 0 || document.body.classList.contains("dialog-open")) return;
    if (event.target.closest("a,button,input,textarea,select,label,summary,video,dialog,[contenteditable]")) return;
    if (event.pointerType === "touch") {
      scene.style.setProperty("--drift-x", `${(event.clientX / width - .5) * 75}px`);
      scene.style.setProperty("--drift-y", `${(event.clientY / height - .5) * 55}px`);
    }
    ripples.push({x: event.clientX, y: event.clientY, start: performance.now()});
    if (ripples.length > 4) ripples.shift();
  }, {passive: true});
  for (const card of cards) {
    card.addEventListener("pointermove", event => {
      if (!enabled || !finePointer.matches || event.pointerType === "touch") return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--card-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--card-y", `${event.clientY - rect.top}px`);
    }, {passive: true});
  }
  resize(); sync();
})();
