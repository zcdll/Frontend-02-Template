const webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const CopyPlugin = require("copy-webpack-plugin");

const path = require("path");

const a = `${__dirname}/src/main.js`;

console.log(a, "---a");

module.exports = {
  entry: path.resolve(`${__dirname}/src/main.js`),
  // output: {
  //   path: path.resolve(__dirname, "dist"),
  //   filename: "my-first-webpack.bundle.js",
  // },
  module: {
    rules: [
      { test: /\.vue$/, use: "vue-loader" },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
      },
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            // plugins: ["istanbul"],
            // sourceMaps: "inline",
          },
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyPlugin({
      patterns: [{ from: "src/*.html", to: "[name].[ext]" }],
    }),
  ],
};
