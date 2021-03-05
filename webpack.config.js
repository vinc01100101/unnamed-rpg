const path = require("path");

const nodeEnv = process.env.NODE_ENV.trim();
console.log("NODE_ENV is: " + nodeEnv);

module.exports = {
  entry: {
    MainPage: "./client-src-unbundled/MainPage.js",
    MapMaker: "./client-src-unbundled/MapMaker.js",
  },
  output: {
    path: path.join(__dirname, "dist/js/"),
    publicPath: "/js/",
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  mode: nodeEnv,
  plugins: [],
  optimization: {
    runtimeChunk: "single",
    minimize: true,
  },
};
