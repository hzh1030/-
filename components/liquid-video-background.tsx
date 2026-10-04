import { useEffect, useRef } from "react";

const VIDEO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4";

export default function LiquidVideoBackground() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const container = document.getElementById("portfolio-background");
    if (!container) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    let frame = 0;
    let restart: ReturnType<typeof setTimeout> | undefined;
    let fadingOut = false;
    let disposed = false;

    const fade = (target: number) => {
      cancelAnimationFrame(frame);
      const from = Number(video.style.opacity) || 0;
      const started = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - started) / 500);
        video.style.opacity = String(from + (target - from) * progress);
        if (progress < 1 && !disposed) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      if (!inView || document.hidden || reduced.matches || document.body.classList.contains("ocean-still")) {
        video.pause();
        if (reduced.matches && video.readyState >= 2) video.style.opacity = "1";
        return;
      }
      void video.play().then(() => {
        if (!disposed && !fadingOut) fade(1);
      }).catch(() => { /* Keep the dark fallback; retry on a real interaction. */ });
    };
    const canPlay = () => {
      container.dataset.ready = "true";
      sync();
    };
    const timeUpdate = () => {
      if (Number.isFinite(video.duration) && video.duration - video.currentTime <= 0.55 && !fadingOut && !reduced.matches) {
        fadingOut = true;
        fade(0);
      }
    };
    const ended = () => {
      video.style.opacity = "0";
      restart = setTimeout(() => {
        if (disposed) return;
        video.currentTime = 0;
        fadingOut = false;
        sync();
      }, 100);
    };
    const error = () => { container.dataset.ready = "false"; };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio > 0.001;
      // Defer the decorative video's network use until after the first screen.
      if (inView && !video.getAttribute("src")) {
        video.src = VIDEO;
        video.load();
      }
      sync();
    }, { threshold: [0, 0.002] });
    observer.observe(container);
    video.addEventListener("canplay", canPlay);
    video.addEventListener("timeupdate", timeUpdate);
    video.addEventListener("ended", ended);
    video.addEventListener("error", error);
    document.addEventListener("visibilitychange", sync);
    document.addEventListener("pointerdown", sync);
    document.addEventListener("keydown", sync);
    window.addEventListener("portfolio-motion-change", sync);
    reduced.addEventListener("change", sync);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      clearTimeout(restart);
      observer.disconnect();
      video.pause();
      video.removeEventListener("canplay", canPlay);
      video.removeEventListener("timeupdate", timeUpdate);
      video.removeEventListener("ended", ended);
      video.removeEventListener("error", error);
      document.removeEventListener("visibilitychange", sync);
      document.removeEventListener("pointerdown", sync);
      document.removeEventListener("keydown", sync);
      window.removeEventListener("portfolio-motion-change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  return <>
    <video ref={ref} className="liquid-background-video" data-decorative="" muted playsInline preload="none" tabIndex={-1} style={{ opacity: 0 }} />
    <div className="liquid-background-shade" />
  </>;
}
