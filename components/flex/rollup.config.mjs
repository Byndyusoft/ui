import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';
import typescript from '@rollup/plugin-typescript';
import baseConfig from '../../rollup.base.config.mjs';

export default {
    ...baseConfig,
    input: ['src/index.ts'],
    plugins: [
        ...baseConfig.plugins,
        postcss({
            inject: true,
            extract: false,
            minimize: true,
            plugins: [postcssImport()]
        }),
        typescript({
            tsconfig: './tsconfig.json',
            exclude: ['src/**/*.stories.tsx', 'src/**/*.tests.tsx', 'node_modules'],
            module: 'ESNext'
        })
    ]
};
