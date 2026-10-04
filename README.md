# ZH的个站

韩子和的个人介绍与作品展示，包含狼人杀游戏、视频标注协作平台、团团与小猫的日常、美雪相册、演唱会与弹唱、两项兴趣记录和微信联系。按用户要求排除 PDF 的开场白、结尾、工作信息及第三项成就。没有添加未提供的学历、岗位、技术栈或业绩。

## 页面与动效

首页 `site/index.html` 按用户提供的 Design World 规格实现黑色全屏首屏。Poppins 大标题绘制到 CanvasTexture，玻璃模型用 Three.js 0.169.0 的两张半浮点渲染目标、背面及正面两次折射绘制，实现六色带色散；支持拖拽、惯性、左右90度旋转、切换圆点和手机布局。首屏 CSS 和 JS 内联，指定 GLB 从用户给定的 CloudFront URL 直接加载，不下载到本地或替换；加载失败时使用 RoundedBoxGeometry。

侧边 ZH 装饰采用 React Bits Electric Logo 的距离场和电弧 Shader，保留用户提供的参数，适配为内联原生模块。`REACT-BITS-NOTICE.txt` 及源码注释包含完整许可。首屏渲染、侧边电流、照片轮播与光标可通过右下角开关控制，遵循系统减少动态设置并允许手动开启；离屏和标签页隐藏时暂停。WebGL不可用或第三方脚本无法加载时，Canvas标题、ZH图形及普通图片链接仍可显示。作品区保留暗色卡片及可展开详情。“关于我”介绍已改写为更自然的个人表达。

作品与生活预览使用 React Bits Flex Carousel 的真实WebGL液态折射，保留五张现有图片、点击聚焦、左右拖动、键盘切换及对应详情入口；照片以每秒18像素连续缓慢横移，拖动、聚焦或键盘操作时暂停，结束后平滑恢复，关闭动效、系统减少动态或离屏时停止。Glow Cursor沿用用户提供的青紫颜色、40点拖尾、光晕、跟随速度和闲置淡出参数，细指针设备使用；触屏不显示光标层，不阻挡按钮、滚动和视频。

左下角液态玻璃音乐播放器使用用户提供的56首完整MP3。文件从E盘复制到D:\个站\.sites-runtime\original-audio，逐文件SHA256核对，保留320 kbps原音质；没有重新编码。旧539条QQ目录、QMPlayer、外部QQ入口和一分钟试听均已移除。播放器使用单一原生Audio实例，支持播放/暂停、进度、音量、搜索、上一首、下一首、顺序播放、随机播放及历史回退；缩小面板继续播放。自动播放偏好控制进入页面时尝试播放及曲目结束后的连播。浏览器阻止有声自动播放时，真实用户点击可以解锁播放。所有56个真实MP3均通过浏览器完整时长检查，实际播放超过一分钟、缩小、真实ended连播、随机、搜索、音量和手机宽度测试均已通过。

`/resume`（也支持 `/resume/` 和 `/resume.html`）为简历作品精简版，保留个人介绍、两个真实项目、两项兴趣记录和微信联系。简历版沿用宇宙背景。用户选定的第二版动漫形象保存为 `site/assets/zh-anime.png`。

游戏截图顶部24px窗口标题栏通过CSS展示裁剪，原始PNG字节不变，放大预览保持一致。平台四张原始PNG均可点击放大。游戏当前为局域网版本，本站展示画面；游戏本体联机服务未部署到本站。

## 原视频

新版七段MP4与56首MP3通过稳定GitHub Release资源地址提供Range播放和原文件下载，全部原文件已经上传并逐文件核对GitHub返回的SHA256与大小。不重编码、不降分辨率、不压缩音视频。旧Sites的R2副本仍保留，新版不依赖旧域名或个人电脑提供媒体。团团与小猫的视频仅修改90°显示方向，逐流SHA256与原文件一致。部分HEVC视频需要设备支持，不支持时可下载原视频。

导入通过临时Sites runtime secret授权，令牌不写入源码、Git或备份。导入结束后移除该密钥。补传过程检查文件大小、每块SHA256和MD5，并校验最终对象大小、SHA元数据及multipart ETag。`worker/concert-upload-plan.json`只含文件校验和与分块会话信息，不含授权密钥。

## 构建

`site`为发布文件。已补齐React、TypeScript、Vite、Tailwind CSS 4.0.17与shadcn/ui目录配置；`components/ui/comet-card.tsx`为用户提供的3D倾斜卡片，本站在“关于我”使用动漫头像卡片。正文背景使用用户提供的动态视频，首屏保持原样。开发入口、安装步骤及组件路径见`docs/react-components.md`。

```text
npm ci
npm run build
```

React静态产物保存在`site/assets/comet`。不加载Tailwind全局preflight，避免重置原页面；卡片支持键盘、触屏及减少动态。背景视频仅在滚动到正文后加载，关闭动效或离屏时暂停。背景视频不会暂停音乐。

历史Sites构建：`worker/index.mjs`提供静态页面和原视频资源；`worker/video-files.json`记录原始视频大小。

```text
node scripts/build-worker.mjs
node scripts/test-worker.mjs
```

构建输出为 `dist/server/index.js` 与 `dist/.openai/hosting.json`，通过构建脚本生成，不进入源码 Git。七段个人原视频保存在 R2，不包含在网站部署包或源码备份中，支持 HEAD、ETag 与 Range 请求。网页静态视频接口也支持范围请求，并限制每次解码所需字节。

所有项目文件、素材、备份、缓存和发布包位于D:\个站。`.sites-runtime`不进入Git，包含本地预览、浏览器配置、素材处理记录及发布记录；不得上传该目录作为公开源码。网站便签仅保存在当前浏览器的localStorage。

## 云端迁移

原Sites域名存在匿名Cloudflare拦截。前端已改为Vercel Hobby独立云端托管；根目录vercel.json指定site为输出目录。正式固定地址为https://zh-personal-space-hzh1030.vercel.app/ ，个人电脑关机不影响前端与云端媒体服务。本人重新授权Vercel CLI后成功发布，公开项目不要求访客登录。认证缓存仅保存在D盘忽略目录，不进入源码或备份。

原视频与56首MP3合计1,995,894,574字节，由production分支的GitHub Actions一次性读取指定媒体，校验每个SHA256，再上传到portfolio-media-v1 Release。63个文件已经全部完成云端上传；临时导入服务与通道已关闭，导入清单不再保留临时网址。实际云端MP3超过一分钟、缩小续播与下一首均通过触屏手机模拟测试，七段视频与三个音频抽样通过云端Range原字节检查。没有实际物理手机测试。原音视频不进入Git源码或Vercel前端部署包。

GitHub仓库hzh1030/-的main分支保留可维护的前端源码，production分支保留迁移工作流。正式Vercel项目为zh-personal-space-hzh1030，后续向同一项目发布会沿用固定网址。Pages尚未启用。
