import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import peerDeps from 'rollup-plugin-peer-deps-external';
import svgr from 'vite-plugin-svgr';

export default {
    output: {
        exports: 'named',
        format: 'cjs',
        dir: 'dist',
        preserveModules: true,
        preserveModulesRoot: 'src'
    },
    plugins: [
        svgr(),
        peerDeps(),
        resolve(),
        commonjs()
    ]
};
