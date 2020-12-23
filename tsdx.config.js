const copy = require('rollup-plugin-copy');

module.exports = {
  rollup(config) {
    // config.plugins.unshift(
    //   copy({
    //     targets: [{ src: 'src/**/*.css', dest: 'dist' }],
    //     flatten: false,
    //   })
    // );
    // console.log(config.plugins);
    return config;
  },
};
