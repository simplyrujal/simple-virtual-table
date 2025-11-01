import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import svelteConfig from "./svelte.config.js";

export default defineConfig({
  plugins: [
    svelte({
      ...svelteConfig,
    }),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "SvelteVirtual",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
    },
    rollupOptions: {
      external: ["svelte", /^svelte\//],
      output: {
        globals: {
          svelte: "Svelte",
        },
      },
    },
  },
});
