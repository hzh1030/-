"use strict";
(() => {
  const toggle = document.querySelector("#motion-toggle"), hero = document.querySelector("#hero");
  if (!toggle || !hero) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let enabled = !reduced.matches;
  function sync() {
    document.body.classList.toggle("ocean-still", !enabled);
    toggle.hidden = false;
    toggle.setAttribute("aria-pressed", String(enabled));
    toggle.title = enabled ? "关闭动效" : "开启动效";
    toggle.querySelector(".motion-state").textContent = enabled ? "开" : "关";
    window.dispatchEvent(new CustomEvent("portfolio-motion-change", { detail: { enabled } }));
  }
  toggle.addEventListener("click", () => { enabled = !enabled; sync(); });
  reduced.addEventListener("change", () => { enabled = !reduced.matches; sync(); });
  function header() { document.body.classList.toggle("glass-past-hero", hero.getBoundingClientRect().bottom < 100); }
  addEventListener("scroll", header, { passive: true });
  addEventListener("resize", header, { passive: true });
  function reveal(hash) {
    if (!hash || hash === "#") return null;
    let target; try { target = document.querySelector(hash); } catch { return null; }
    const parent = target?.closest(".project-case"); if (parent) parent.open = true;
    return target;
  }
  document.addEventListener("click", event => { const link = event.target.closest?.("a[href^='#']"); if (link) reveal(link.getAttribute("href")); });
  addEventListener("hashchange", () => { const target = reveal(location.hash); if (target?.closest(".project-case")) requestAnimationFrame(() => target.scrollIntoView({ block: "start", behavior: "auto" })); });
  const target = reveal(location.hash); if (target?.closest(".project-case")) requestAnimationFrame(() => target.scrollIntoView({ block: "start", behavior: "auto" }));
  sync(); header();
})();
