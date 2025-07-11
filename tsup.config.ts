import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"], // entry point (create this file soon)
  format: ["esm", "cjs"], // build both module types
  dts: true, // generate .d.ts types
  sourcemap: true, // useful for debugging in user projects
  clean: true, // clean dist before build
  external: ["react", "react-dom", "gsap"], // mark peer deps as external
});
