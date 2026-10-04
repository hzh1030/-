import { CometCard } from "@/components/ui/comet-card";

export default function CometProfile() {
  return (
    <CometCard className="zh-comet w-full max-w-80">
      <a
        href="#work"
        className="zh-comet-link flex w-full cursor-pointer flex-col items-stretch rounded-[16px] border-0 bg-[#1F2121] p-2 md:p-3"
        aria-label="浏览韩子和的作品"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[12px] bg-black">
          <img
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            src="assets/zh-anime.png"
            alt="韩子和的动漫形象"
            width={941}
            height={1672}
          />
          <span className="zh-comet-image-shade" aria-hidden="true" />
          <span className="zh-comet-badge" aria-hidden="true">ZH</span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 p-3 font-mono text-white">
          <span className="text-xs tracking-wider">ZH / PERSONAL SPACE</span>
          <span className="text-xs text-gray-300 opacity-60" aria-hidden="true">↗</span>
        </div>
      </a>
    </CometCard>
  );
}
