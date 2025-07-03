import svgr from 'vite-plugin-svgr';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import autoExternal from 'rollup-plugin-auto-external';

export default {
    output: {
        exports: 'named',
        format: 'cjs',
        dir: 'dist',
        preserveModules: true,
        preserveModulesRoot: 'src'
    },
    plugins: [svgr(), nodeResolve(), commonjs(), autoExternal()]
};
