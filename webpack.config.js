var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')
var ROOT_PATH = path.resolve(__dirname)
var ENTRY_PATH = path.resolve(ROOT_PATH, 'src/index.js')
var SRC_PATH = path.resolve(ROOT_PATH, 'src')
var STATIC_PATH = path.resolve(ROOT_PATH, 'static')
var VENDOR_PATH = path.resolve(ROOT_PATH, 'vendor')
var COMPONENTS_PATH = path.resolve(ROOT_PATH, 'src/components')
var STYL_PATH = path.resolve(ROOT_PATH, 'src/styl')
var LIB_PATH = path.resolve(ROOT_PATH, 'src/lib')
var GLSL_PATH = path.resolve(ROOT_PATH, 'src/glsl')
var TEMPLATE_PATH = path.resolve(ROOT_PATH, 'src/index.html')
var SHADERS_PATH = path.resolve(ROOT_PATH, 'src/shaders')
var BUILD_PATH = path.resolve(ROOT_PATH, 'dist')
var debug = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: ENTRY_PATH,
  plugins: [
    new HtmlWebpackPlugin({
      title: 'WebGL Project Boilerplate',
      template: TEMPLATE_PATH,
      inject: 'body'
    }),
    new BrowserSyncPlugin(
      // BrowserSync options
      {
        // browse to http://localhost:3000/ during development
        host: 'localhost',
        port: 3000,
        // proxy the Webpack Dev Server endpoint
        // (which should be serving on http://localhost:3100/)
        // through BrowserSync
        proxy: 'http://localhost:8080/'
      },
      // plugin options
      {
        // prevent BrowserSync from reloading the page
        // and let Webpack Dev Server take care of this
        reload: false
      }
    )
  ],
  output: {
    path: BUILD_PATH,
    filename: '[name].js'
  },
  resolve: {
    root: SRC_PATH,
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'static': STATIC_PATH,
      'vendor': VENDOR_PATH,
      'components': COMPONENTS_PATH,
      'lib': LIB_PATH,
      'styl': STYL_PATH,
      'shaders': SHADERS_PATH
    }
  },
  module: {
    loaders: [{
      test: /\.js$/,
      include: SRC_PATH,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel',
      query: {
        cacheDirectory: true,
        presets: ['es2015']
      }
    },
    {
      test: /\.glsl$/,
      include: SHADERS_PATH,
      loader: 'webpack-glsl'
    },
    {
      test: /\.fs$/,
      include: SHADERS_PATH,
      loader: 'webpack-glsl'
    },
    // {
    //   test: /\.vs$/,
    //   include: SHADERS_PATH,
    //   loader: 'webpack-glsl'
    // },
    {
      test: /\.(glsl|frag|vert)$/,
      loader: 'raw',
      include: SHADERS_PATH
    },
    {
      test: /\.(glsl|frag|vert)$/,
      loader: 'glslify',
      include: SHADERS_PATH
    },
    {
      test: /\.styl$/,
      loader: 'style!css!stylus',
      exculde: /node_modules/
    }
    ]
  },
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
  debug: debug,
  devtool: debug ? 'eval-source-map' : 'source-map'
}
