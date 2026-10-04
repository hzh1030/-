"use strict";
(() => {
  const section = document.querySelector(".ocean-intro"), stage = document.querySelector(".ocean-sticky");
  const canvas = document.querySelector("#ocean-canvas"), film = document.querySelector("#ocean-film");
  const playButton = document.querySelector("#ocean-play"), toggle = document.querySelector("#motion-toggle");
  if (!section || !stage || !canvas || !film || !playButton || !toggle) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)"), fine = matchMedia("(hover: hover) and (pointer: fine)");
  let enabled = !reduced.matches, visible = true, frame = 0, lastFrame = 0;
  let elapsed = 0, progress = 0, width = 0, height = 0, ready = false, lost = false;
  let playPending = false, blocked = false, mediaError = false, initialization = 0;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let gl, program, buffer, texture;
  const uniform = {};
  const vertex = "attribute vec2 a_position;varying vec2 v_uv;void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}";
  // The native video supplies the sea; WebGL only draws the underwater transition.
  const fragment = `
    precision mediump float;
    varying vec2 v_uv;
    uniform sampler2D u_under;
    uniform vec2 u_view, u_underSize, u_pointer;
    uniform float u_time, u_depth, u_motion;
    vec2 cover(vec2 uv) {
      float imageRatio=u_underSize.x/u_underSize.y, viewRatio=u_view.x/u_view.y;
      if(viewRatio>imageRatio) uv.y=(uv.y-.5)*imageRatio/viewRatio+.5;
      else uv.x=(uv.x-.5)*viewRatio/imageRatio+.5+clamp((1.-viewRatio/imageRatio)*.27,0.,.27);
      return clamp(uv,vec2(.001),vec2(.999));
    }
    void main() {
      vec2 uv=v_uv; float t=u_time*.7;
      float d=smoothstep(.10,.92,u_depth), line=mix(-.06,1.08,d);
      float ripple=(sin(uv.x*9.+t)+.36*sin(uv.x*23.-t*1.3))*.014*sin(d*3.14159)*u_motion;
      float water=1.-smoothstep(line+ripple-.02,line+ripple+.02,uv.y);
      if(water<.001){gl_FragColor=vec4(0.);return;}
      vec2 below=cover(uv+u_pointer*.003*u_motion);
      below+=vec2(sin(below.y*16.+t)*.0016,sin(below.x*22.-t*.6)*.0014)*u_motion;
      vec3 color=texture2D(u_under,clamp(below,vec2(.001),vec2(.999))).rgb;
      float edge=exp(-abs(uv.y-line-ripple)*85.)*sin(d*3.14159);
      color=mix(color,vec3(.05,.34,.43),edge*.28);
      float caustic=pow(max(0.,sin(below.x*56.+sin(below.y*28.+t)*2.+t)),13.)*.016*u_motion;
      color+=vec3(.10,.22,.20)*caustic;
      gl_FragColor=vec4(color,water);
    }`;
  const playbackWanted = () => enabled && visible && !document.hidden && progress < .92;
  function playbackState() {
    const waiting = playbackWanted() && film.paused;
    toggle.querySelector(".motion-state").textContent = !enabled ? "关" : mediaError ? "待重试" : blocked ? "待播放" : waiting ? "加载中" : "开";
    playButton.hidden = !playbackWanted() || (!blocked && !mediaError);
    playButton.textContent = mediaError ? "重试海浪播放 ↻" : "播放海浪 ▶";
  }
  function manageFilm() {
    if (!playbackWanted()) film.pause();
    else if (film.paused && !playPending && !blocked && !mediaError) {
      playPending = true; film.muted = true;
      film.play().catch(error => {
        if (error.name === "NotAllowedError") blocked = true;
        else if (error.name !== "AbortError") mediaError = true;
      }).finally(() => {
        playPending = false;
        if (!playbackWanted()) film.pause();
        playbackState();
        if (playbackWanted() && film.paused && !blocked && !mediaError) queueMicrotask(manageFilm);
      });
    }
    playbackState();
  }
  film.addEventListener("playing", () => { blocked = mediaError = false; stage.classList.add("ocean-film-ready"); playbackState(); });
  film.addEventListener("loadeddata", () => { stage.classList.add("ocean-film-ready"); manageFilm(); });
  function failedFilm() { mediaError = true; film.pause(); playbackState(); }
  film.addEventListener("error", failedFilm);
  film.querySelector("source")?.addEventListener("error", failedFilm);
  playButton.addEventListener("click", () => { const reload = mediaError || film.error; blocked = mediaError = false; if (reload) film.load(); manageFilm(); });
  function stop() { if (frame) cancelAnimationFrame(frame); frame = lastFrame = 0; }
  function render() {
    if (!ready || lost || !gl) return;
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (progress <= .1) { gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); return; }
    gl.useProgram(program);
    gl.uniform2f(uniform.u_view, width, height); gl.uniform2f(uniform.u_pointer, pointer.x, pointer.y);
    gl.uniform1f(uniform.u_time, elapsed); gl.uniform1f(uniform.u_depth, progress); gl.uniform1f(uniform.u_motion, enabled ? 1 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  function update() {
    const rect = section.getBoundingClientRect(), distance = Math.max(1, section.offsetHeight - stage.offsetHeight);
    progress = enabled ? Math.min(1, Math.max(0, -rect.top / distance)) : 0;
    document.body.classList.toggle("ocean-deep", progress > .55 || rect.bottom <= stage.offsetHeight * .4);
    stage.style.setProperty("--copy-rise", (-progress * 22).toFixed(2) + "px");
    stage.style.setProperty("--copy-opacity", String(Math.max(.35, 1 - Math.max(0, progress - .9) * 5)));
    stage.style.setProperty("--dive-fill", (progress * 100).toFixed(1) + "%");
    const x = Math.min(1, Math.max(0, (progress - .1) / .82)), d = x * x * (3 - 2 * x), waterTop = height * (1.06 - 1.14 * d);
    stage.style.setProperty("--water-level", Math.min(100, Math.max(0, (1.06 - 1.14 * d) * 100)).toFixed(2) + "%");
    const stageTop = stage.getBoundingClientRect().top;
    for (const element of stage.querySelectorAll(".hero h1,.hero-description,.hero-identity")) element.style.setProperty("--text-split", (waterTop + stageTop - element.getBoundingClientRect().top).toFixed(1) + "px");
    stage.style.setProperty("--resume-ink", "#eef8f4");
    document.body.classList.toggle("ocean-nav-deep", waterTop < 95 || rect.bottom <= stage.offsetHeight * .4);
    if (!frame) render();
    if (progress <= .1) stop(); else start();
    manageFilm();
  }
  function animate(time) {
    frame = 0;
    if (!enabled || !visible || document.hidden || !ready || lost || progress <= .1) return;
    if (!lastFrame || time - lastFrame >= 32) {
      // Use real elapsed time so slower graphics devices do not slow the animation.
      elapsed += lastFrame ? (time - lastFrame) / 1000 : 0; lastFrame = time;
      pointer.x += (pointer.tx - pointer.x) * .13; pointer.y += (pointer.ty - pointer.y) * .13;
      render();
    }
    frame = requestAnimationFrame(animate);
  }
  function start() { if (enabled && visible && !document.hidden && ready && !lost && progress > .1 && !frame) frame = requestAnimationFrame(animate); }
  function resize() {
    width = stage.clientWidth; height = stage.clientHeight;
    const scale = Math.min(devicePixelRatio || 1, 1.5, Math.sqrt(1800000 / Math.max(1, width * height)));
    canvas.width = Math.max(1, Math.round(width * scale)); canvas.height = Math.max(1, Math.round(height * scale));
    update(); render();
  }
  function shader(type, source) {
    const s = gl.createShader(type); gl.shaderSource(s, source); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); throw new Error("Underwater effect unavailable"); }
    return s;
  }
  async function init() {
    const generation = ++initialization;
    try {
      gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: false, depth: false, powerPreference: "low-power" });
      if (!gl) return;
      const vs = shader(gl.VERTEX_SHADER, vertex), fs = shader(gl.FRAGMENT_SHADER, fragment);
      program = gl.createProgram(); gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program); gl.deleteShader(vs); gl.deleteShader(fs);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Underwater effect unavailable");
      gl.useProgram(program); buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
      const attribute = gl.getAttribLocation(program, "a_position"); gl.enableVertexAttribArray(attribute); gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
      ["u_under", "u_view", "u_underSize", "u_pointer", "u_time", "u_depth", "u_motion"].forEach(key => uniform[key] = gl.getUniformLocation(program, key));
      const image = new Image(); image.decoding = "async"; image.src = "assets/ocean-underwater.png"; await image.decode();
      if (generation !== initialization || lost || gl.isContextLost()) return;
      texture = gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texture); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.uniform1i(uniform.u_under, 0); gl.uniform2f(uniform.u_underSize, image.naturalWidth, image.naturalHeight);
      ready = true; resize(); stage.classList.add("ocean-ready"); start();
    } catch {
      if (generation !== initialization) return;
      ready = false; stop(); stage.classList.remove("ocean-ready");
      // Native sea playback and the CSS underwater transition remain available.
    }
  }
  function sync(preservePosition = false) {
    const work = document.querySelector("#work"), before = work?.getBoundingClientRect().top;
    stop(); document.body.classList.toggle("ocean-still", !enabled);
    toggle.hidden = false; toggle.setAttribute("aria-pressed", String(enabled)); toggle.title = enabled ? "关闭背景动效" : "开启背景动效";
    if (preservePosition && before < 0 && work) {
      const delta = work.getBoundingClientRect().top - before;
      if (delta) { const old = document.documentElement.style.scrollBehavior; document.documentElement.style.scrollBehavior = "auto"; scrollBy(0, delta); document.documentElement.style.scrollBehavior = old; }
    }
    resize(); manageFilm();
  }
  toggle.addEventListener("click", () => { enabled = !enabled; blocked = false; pointer.x = pointer.y = pointer.tx = pointer.ty = 0; sync(true); });
  reduced.addEventListener("change", () => { enabled = !reduced.matches; sync(true); });
  document.addEventListener("visibilitychange", () => { stop(); start(); manageFilm(); });
  addEventListener("scroll", update, { passive: true }); addEventListener("resize", resize, { passive: true });
  stage.addEventListener("pointermove", event => {
    if (!enabled || !fine.matches || event.pointerType === "touch") return;
    const r = stage.getBoundingClientRect(); pointer.tx = (event.clientX - r.left) / r.width - .5; pointer.ty = (event.clientY - r.top) / r.height - .5;
  }, { passive: true });
  stage.addEventListener("pointerleave", () => { pointer.tx = pointer.ty = 0; });
  canvas.addEventListener("webglcontextlost", event => { event.preventDefault(); initialization++; lost = true; ready = false; stop(); stage.classList.remove("ocean-ready"); });
  canvas.addEventListener("webglcontextrestored", () => { lost = false; init(); });
  if ("IntersectionObserver" in window) new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) start(); else stop(); manageFilm(); }, { threshold: 0 }).observe(stage);
  function revealCase(hash) {
    if (!hash || hash === "#") return null;
    let target; try { target = document.querySelector(hash); } catch { return null; }
    const parent = target?.closest(".project-case"); if (parent) parent.open = true; return target;
  }
  document.addEventListener("click", event => { const link = event.target.closest?.("a[href^='#']"); if (link) revealCase(link.getAttribute("href")); });
  addEventListener("hashchange", () => { const target = revealCase(location.hash); if (target?.closest(".project-case")) requestAnimationFrame(() => target.scrollIntoView({ block: "start", behavior: "auto" })); });
  const initialTarget = revealCase(location.hash);
  if (initialTarget?.closest(".project-case")) requestAnimationFrame(() => initialTarget.scrollIntoView({ block: "start", behavior: "auto" }));
  film.muted = true; sync(); init();
})();
