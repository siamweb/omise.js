/**
 * --------------------------------------------------------
 * Webpack production config
 * --------------------------------------------------------
 */

var CleanPlugin = require('clean-webpack-plugin');

module.exports = {

  entry: "./src/omise.ts",

  output: {
    filename: "./dist/omise.js"
  },

  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".js"]
  },

  module: {
    loaders: [
      { test: /\.ts$/, loader: "ts-loader" }
    ]
  },

  plugins: [
    new CleanPlugin('dist')
  ]
}
