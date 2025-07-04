import postcss from 'rollup-plugin-postcss';
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
        }),
        typescript({
            tsconfig: './tsconfig.json',
            exclude: ['src/**/*.stories.*', 'src/**/*.docs.*', 'src/**/*.tests.*', 'node_modules']
        })
    ]
};
