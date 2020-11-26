const copy = require('rollup-plugin-copy');

module.exports = {
  rollup(config) {
    config.plugins.push(
      copy({
        targets: [{ src: 'src/**/*.css', dest: 'dist' }],
        flatten: false,
      })
    );

    return config;
  },
};
