import typescript from '@rollup/plugin-typescript';
import autoExternal from 'rollup-plugin-auto-external';
import { dts } from 'rollup-plugin-dts';

const javascriptConfig = {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.js',
            format: 'esm'
        },
        {
            exports: 'named',
            file: 'dist/index.cjs',
            format: 'cjs'
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
