// Main webpack config used for development and production builds
const appVersion = require('./package.json').version
const copyWebpackPlugin = require('copy-webpack-plugin')
const env = process.env.NODE_ENV || 'development'
const extractTextWebpackPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const stylelintWebpackPlugin = require('stylelint-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  context: path.join(__dirname, 'src'),
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    historyApiFallback: true,
    https: false,
    noInfo: false,
    port: 8000,
    quiet: false,
    stats: {
      assets: true,
      children: true,
      chunks: false,
      errors: true,
      errorDetails: true,
      hash: false,
      publicPath: false,
      source: false,
      timings: false,
      warnings: true,
      version: false
    }
  },
  // Using 'source-map' will give the browser the browser
  // the non-transpiled es6 source code for debugging.
  // https://webpack.js.org/configuration/devtool/#devtool
  devtool: 'source-map',
  entry: {
    index: './index.entry.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: extractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader'
          ]
        })
      },
      {
        test: /\.pug$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'pug-loader'
          },
          {
            loader: 'pug-lint-loader',
            options: Object.assign(
              { emitError: true },
              require('./.pug-lintrc.js')
            )
          }
        ]
      },
      {
        exclude: [
          /node_modules/,
          /\.spec\.js$/
        ],
        test: /.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  'env',
                  {
                    // Don't hijack webpack's "import" function.
                    // This is important for tree shaking.
                    modules: false,
                    // Polyfills are only needed for the following targets
                    targets: {
                      // This is our advertised list of supported browsers
                      browsers: [
                        'last 2 Chrome versions',
                        'last 2 Firefox versions',
                        'last 2 Safari versions',
                        'IE >= 11'
                      ]
                    }
                  }
                ]
              ]
            }
          },
          {
            loader: 'eslint-loader'
          }
        ]
      },
      {
        test: /\.(eot|gif|jpg|png|svg|ttf|woff)$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.scss$/,
        use: extractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'resolve-url-loader'
            },
            {
              loader: 'sass-loader',
              options: {
                // Check these directories when attempting to import a file without a given path,
                // so doing "@import 'foo';" will first try to resolve to "./foo.scss", then check
                // inside the directories listed below from first to last.
                includePaths: [
                  path.resolve(__dirname, 'src', 'stylesheets'),
                  path.resolve(__dirname, 'node_modules', 'compass-mixins', 'lib')
                ],
                sourceMap: true
              }
            }
          ]
        })
      }
    ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, '/dist/')
  },
  plugins: [
    new extractTextWebpackPlugin('index.bundle.css'),
    new stylelintWebpackPlugin({
      failOnError: false
    }),
    new webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(appVersion),
      NODE_ENV: JSON.stringify(env)
    }),
    new copyWebpackPlugin([
      {
        from: '*.html',
        to: '.'
      }
    ])
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js',
      'vue-router': 'vue-router/dist/vue-router.js'
    }
  }
}
