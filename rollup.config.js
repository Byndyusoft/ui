import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import peerDependencies from 'rollup-plugin-peer-deps-external';

export default [
    {
        input: ['src/index.ts'],
        output: {
            exports: 'named',
            format: 'esm',
            dir: 'lib',
            preserveModules: true,
            preserveModulesRoot: 'src',
            sourcemap: true
        },
        plugins: [del({ targets: 'lib/*', verbose: true }), peerDependencies(), resolve(), commonjs(), typescript()]
    }
];
