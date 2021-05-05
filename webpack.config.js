const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/script.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    publicPath: "/",
    contentBase: "./dist",
    hot: true,
  },
};

//   module: {
//     rules: [
//       {
//         test: /\.m?js$/,
//         exclude: /(node_modules|bower_components)/,
//         use: {
//           loader: "babel-loader",
//           options: {
//             presets: ["@babel/preset-env"],
//             plugins: [
//               "@babel/plugin-proposal-class-properties",
//               ["@babel/transform-runtime"],
//             ],
//           },
//         },
//       },
//     ],
//   },
// };
