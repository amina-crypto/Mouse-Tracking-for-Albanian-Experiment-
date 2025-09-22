module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(csv|tsv)$/,
          loader: 'csv-loader',
          options: { dynamicTyping: true, header: true, skipEmptyLines: true }
        }
      ]
    }
  },
  lintOnSave: false,
  pluginOptions: { lintStyleOnBuild: false, stylelint: {} },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/Mouse-Tracking-for-Albanian-Experiment-/' // <-- exact repo name + trailing slash
    : '/'
};
