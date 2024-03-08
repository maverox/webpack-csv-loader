const path = require('path')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.csv$/,
        use: ['babel-loader', 'csv-loader'],
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
      },
    ],
  },
  resolveLoader: {
    alias: {
      'csv-loader': path.resolve(__dirname, 'src/csv-loader.js'),
    },
  },
}
