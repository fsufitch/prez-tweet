// Based on https://github.com/preboot/angular-webpack/blob/master/webpack.config.js

// Helper: root() is defined at the bottom
var path = require('path');
var webpack = require('webpack');

var ENV = process.env.ENV;
var isDeploy = ENV === 'deploy';
var isProd = (ENV === 'prod') || isDeploy;
var isDev = (ENV === 'dev') || (!isProd);
var envText = isDeploy ? 'deploy' : isProd ? 'prod' : 'dev'

console.log('Resolved build environment: '  + envText);

// Webpack Plugins
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => {
  var config = {};

  if (isDev) {
    config.devtool = 'inline-source-map';
  } else {
    config.devtool = 'source-map';
  }

  config.entry = {
    app: './prez-tweet-ui/main.ts',
    polyfill: './prez-tweet-ui/polyfill.ts',
    vendor: './prez-tweet-ui/vendor.ts',
  };

  config.output = {
    path: root('dist', envText),
    filename: '[name].bundle.js',
  };

  config.resolve = {
    extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html'],
  };

  var atlConfigFile = root('prez-tweet-ui', 'tsconfig.json');
  config.module = {
    rules: [
      {test: /\.ts$/, loader: 'awesome-typescript-loader?configFileName=' + atlConfigFile},
      {test: /\.(png|woff|woff2|ttf|eot)$/, loader: 'url-loader'},
      {test: /\.json$/, loader: 'json-loader'},
      {test: /\.(scss|sass)$/, loaders: ['to-string-loader', 'css-loader', 'sass-loader']},
      {test: /\.html$/, loader: 'raw-loader'}
    ]
  };

  config.plugins = [
    new CommonsChunkPlugin({
      name: ['vendor', 'polyfill'],
    }),
    new webpack.DefinePlugin({
      'process.env': {
        ENV: JSON.stringify(envText),
      }
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({sourceMap: true, mangle: { keep_fnames: true }}),
    new HtmlWebpackPlugin({
        template: root('prez-tweet-ui', 'index.html'),
        chunksSortMode: 'dependency',
      }),
  ];

  config.devServer = {
    contentBase: root('prez-tweet-ui'),
    historyApiFallback: true,
    quiet: false,
    stats: 'normal', // none (or false), errors-only, minimal, normal (or true) and verbose
    port: 8888,
  };

  return config
}


// Helper functions
function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}
