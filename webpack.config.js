const path = require("path");

const dev = process.env.mode === "development";

const config = {
  entry: {
    background: "./src/background/worker.ts",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "./dist"),
  },
};

module.exports = () => {
  if (dev) config.devtool = "source-map";

  return config;
};
