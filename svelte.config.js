const preprocess = require("svelte-preprocess");

module.exports = {
  preprocess: preprocess(),
  compilerOptions: {
    cssHash: ({ hash, css }) => hash(css),
  },
};
