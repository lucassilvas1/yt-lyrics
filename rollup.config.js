import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import css from "rollup-plugin-css-only";
import autoPreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";

const dev = process.env.NODE_ENV === "development";

export default {
  input: "src/content/main.js",
  output: {
    sourcemap: dev,
    format: "iife",
    name: "app",
    file: "dist/content.js",
  },
  plugins: [
    svelte({
      preprocess: autoPreprocess(),
      compilerOptions: {
        // enable run-time checks when not in prod
        dev,
      },
    }),
    typescript({ sourceMap: dev }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: "content.css" }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),
    // If we're building for prod (npm run build
    // instead of npm run dev), minify
    !dev && terser(),
  ],
};
