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
  pluginOptions: {
    lintStyleOnBuild: false,
    stylelint: {}
  },

  // ✅ Use the repo name as base for Prod (GitHub Pages)
  publicPath: process.env.NODE_ENV === 'production'
    ? '/Mouse-Tracking-for-Albanian-Experiment-/'   // note the trailing slash and hyphen
    : '/',

  // ✅ Remove the default progress plugin (avoids the schema clash entirely)
  chainWebpack: (config) => {
    config.plugins.delete('progress');
  }
};
