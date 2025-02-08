// filepath: /home/kuroki/php-do-not-overwrite-variable/server/vite.config.ts
import { defineConfig } from "vite";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default defineConfig({
  esbuild: {
    minifyIdentifiers: false,
  },
  plugins: [nodeResolve()],
  build: {
    outDir: "out",
    target: "es2020",
    lib: {
      entry: "./src/server.ts",
      name: "extension",
      formats: ["cjs"],
      fileName: () => "server.js",
    },
    rollupOptions: {
      preserveEntrySignatures: "strict",
    },
    sourcemap: true,
  },
});
