/**
 * -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 * Webpack default config
 * -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 */

const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');


/**
 * --------------------------------------------------------
 * Webpack settings
 * --------------------------------------------------------
 */
const config = {
  entry: './src/index.js',
  output: {
    filename: 'omise.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },

  devtool: false,

  devServer: {
    inline: true,
    host: '0.0.0.0',
    port: 5001,
    historyApiFallback: true,
  },

  resolve: {
    modules: [
      'src',
      'node_modules',
    ],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
        }],
      },
    ],
  },

  plugins: [
    new CleanPlugin('dist'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ]
};

module.exports = config;
