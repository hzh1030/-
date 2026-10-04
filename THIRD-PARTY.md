# 首屏资源

- Three.js 0.169.0：按用户给定的 jsDelivr importmap URL 加载，使用官方 GLTFLoader、BufferGeometryUtils、RoundedBoxGeometry。
- Poppins：按用户给定的 Google Fonts URL 加载 300、400、500、600、700、800 字重。
- 玻璃模型：从用户提供的 CloudFront GLB URL 直接由 GLTFLoader 加载，不下载到项目目录；失败时使用指定圆角几何。
- React Bits Electric Logo：https://reactbits.dev/animations/electric-logo ，使用上游提交 `ca44b3f9ee180676a06d7de8ec6bea84cddff85b` 的距离场、电流 Shader 和参数，移除 React 生命周期以嵌入本站。保留完整声明于源码及 `REACT-BITS-NOTICE.txt`。
- OGL 1.0.11：Electric Logo 的渲染依赖，从 `https://cdn.jsdelivr.net/npm/ogl@1.0.11/+esm` 加载。

用户提供的照片、截图与个人视频保持原文件；头像使用用户认可的动漫版本。首屏主标题为 Canvas 内容，中央玻璃实际采样并折射该纹理。所有第三方网络资源加载失败时保留可见标题及静态 ZH 图形。
