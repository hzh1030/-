# 首屏资源

- Three.js 0.169.0：按用户给定的 jsDelivr importmap URL 加载，使用官方 GLTFLoader、BufferGeometryUtils、RoundedBoxGeometry。
- Poppins：按用户给定的 Google Fonts URL 加载 300、400、500、600、700、800 字重。
- 玻璃模型：从用户提供的 CloudFront GLB URL 直接由 GLTFLoader 加载，不下载到项目目录；失败时使用指定圆角几何。
- React Bits Electric Logo：https://reactbits.dev/animations/electric-logo ，使用上游提交 `ca44b3f9ee180676a06d7de8ec6bea84cddff85b` 的距离场、电流 Shader 和参数，移除 React 生命周期以嵌入本站。保留完整声明于源码及 `REACT-BITS-NOTICE.txt`。
- OGL 1.0.11：Electric Logo 的渲染依赖，从 `https://cdn.jsdelivr.net/npm/ogl@1.0.11/+esm` 加载。
- React Bits Flex Carousel：https://reactbits.dev/components/flex-carousel ，保留上游液态镜片、卡片渲染与拖拽引擎，适配为本站原生模块。采用用户给定的 liquid、rise、cardHeight 0.5、gap 12、squeeze 0.2、focusOnClick 与 captions；普通纵向滚轮继续滚动页面，横向滚轮或拖动切换图片。
- React Bits Glow Cursor：https://reactbits.dev/animations/glow-cursor ，保留上游光标 Shader、40点青紫拖尾及用户参数，适配固定视口；闲置淡出后停止渲染，系统减少动态及手动开关可停用，触屏保留原生交互。上述两项亦附完整 `REACT-BITS-NOTICE.txt` 声明。
- QQ音乐：歌手 https://y.qq.com/n/ryqq/singer/002J4UUk29y8BY ，公开曲目元数据来自QQ音乐官方 GetSingerSongList，2026-10-04逐页核对539个条目（含现场、伴奏及其他版本）。音乐不下载、不存储，用户操作后才加载官方外链播放器 `https://i.y.qq.com/n2/m/outchain/player/index.html`；全曲播放能力由QQ音乐账号、地区及曲目权限决定。

用户提供的照片、截图与个人视频保持原文件；头像使用用户认可的动漫版本。首屏主标题为 Canvas 内容，中央玻璃实际采样并折射该纹理。所有第三方网络资源加载失败时保留可见标题及静态 ZH 图形。
