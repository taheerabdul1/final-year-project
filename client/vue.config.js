const path = require('path');

module.exports = {
  outputDir: path.resolve(__dirname, '../server/views'),
  transpileDependencies: true,
  configureWebpack: {
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
        },
      },
    },
  },
};
