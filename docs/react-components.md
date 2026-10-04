# React 组件维护

原站为静态 HTML，现已加入 React、TypeScript、Vite、Tailwind CSS **4.0.17** 和 shadcn/ui 目录配置，无须再次初始化。

- 可复用 UI：`D:\个站\components\ui`，由 `@/components/ui` 引用。
- 页面组合：`D:\个站\components`，包括原版 `comet-card-demo.tsx` 与本站头像卡片。
- 类名工具：`D:\个站\lib\utils.ts`。
- 新组件样式：`D:\个站\styles\react-islands.css`。
- React 挂载入口：`D:\个站\src\react-islands.tsx`。
- 静态产物：`D:\个站\site\assets\comet`，发布时直接使用。

`components/ui` 是 shadcn 组件约定目录，`components.json` 的 `ui` 别名和 TypeScript/Vite 的 `@` 别名均指向这里。统一该路径可让后续组件的导入保持一致，避免复制组件后找不到文件。

已安装环境的复现与构建：

```powershell
cd D:\个站
npm ci --cache D:\个站\.sites-runtime\npm-cache
npm run build
```

若从空目录重建 React 工程，可先用以下官方脚手架流程，再复制本站别名、组件和样式配置；无需在已完成的本站重复执行：

```powershell
cd D:\个站
npm create vite@latest 新的React项目 -- --template react-ts
cd 新的React项目
npm install
npm install -D tailwindcss@4.0.17 @tailwindcss/vite@4.0.17 typescript
npx shadcn@latest init
npm install motion clsx tailwind-merge
```

本站只对头像和正文背景挂载 React；首屏 HTML、首屏脚本、作品、简历及播放器保持原有入口。Tailwind 不加载全局 preflight，避免重置旧页面。组件支持触屏、键盘及系统减少动态；背景视频来自用户提供的参考网址，在首屏之后才加载，循环使用 500ms 淡出/淡入，关闭动效时暂停。

官方参考：[Vite 安装](https://ui.shadcn.com/docs/installation/vite)、[Tailwind Vite 插件](https://tailwindcss.com/docs/installation/using-vite)、[Motion 组件](https://motion.dev/docs/react-motion-component)。
