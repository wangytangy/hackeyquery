module.exports = {
  context: __dirname,
  entry: './lib/javascript/main.js',
  output: {
    path: './lib/javascript',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js']
  },
  devtool: 'source-maps'
};
