import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import peerDeps from 'rollup-plugin-peer-deps-external';
import styles from 'rollup-plugin-styles';

export default {
    output: {
        exports: 'named',
        format: 'cjs',
        dir: 'dist',
        preserveModules: true,
        preserveModulesRoot: 'src',
        assetFileNames: '[name]-[hash][extname]'
    },
    plugins: [peerDeps(), resolve(), commonjs(), styles()]
};
