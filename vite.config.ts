import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [tailwindcss()],
  define: { "process.env.NODE_ENV": '"production"' },
  resolve: {
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
  build: {
    minify: "esbuild",
    outDir: "site/assets/comet",
    // The existing website and original media must survive island builds.
    emptyOutDir: false,
    lib: {
      entry: "src/react-islands.tsx",
      formats: ["es"],
      fileName: "react-islands",
      cssFileName: "react-islands",
    },
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        warn(warning);
      },
    },
  },
});
