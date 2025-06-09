import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    jsx: "transform",
    jsxInject: `import { h, Fragment } from '@/libs/jsx-runtime'`,
    jsxDev: false,
    jsxFactory: "h",
    jsxFragment: "Fragment",
  },
});
