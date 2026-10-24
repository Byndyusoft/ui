import typescript from '@rollup/plugin-typescript';
import autoExternal from 'rollup-plugin-auto-external';
import { dts } from 'rollup-plugin-dts';

const javascriptConfig = {
    input: 'src/index.ts',
    output: [
        {
            dir: 'dist/esm',
            entryFileNames: '[name].js',
            chunkFileNames: '[name].js',
            format: 'esm',
            preserveModules: true,
            preserveModulesRoot: 'src'
        },
        {
            dir: 'dist/cjs',
            entryFileNames: '[name].cjs',
            chunkFileNames: '[name].cjs',
            exports: 'named',
            format: 'cjs',
            preserveModules: true,
            preserveModulesRoot: 'src'
        }
    ],
    plugins: [
        autoExternal(),
        typescript({
            declaration: false,
            include: ['src/**/*.ts'],
            target: 'ES2022',
            tsconfig: './tsconfig.json'
        })
    ]
};

const declarationsConfig = {
    input: 'dist/declarations/index.d.ts',
    output: {
        file: 'dist/index.d.ts',
        format: 'es'
    },
    plugins: [dts()]
};

export default [javascriptConfig, declarationsConfig];
