import typescript from '@rollup/plugin-typescript';
import baseConfig from '../../rollup.base.config';
import postcss from 'rollup-plugin-postcss';

export default {
    ...baseConfig,
    input: ['src/index.ts'],
    plugins: [
        ...baseConfig.plugins,
        typescript({
            tsconfig: './tsconfig.json',
            module: 'ESNext',
            exclude: [
                'src/**/*.stories.tsx',
                'src/**/*.tests.tsx',
                'src/**/__stories__/**',
                'src/**/__tests__/**',
                'node_modules/**'
            ]
        }),
        postcss({
            modules: true,
            extract: false,
            minimize: true,
            sourceMap: true,
            inject: true
        })
    ]
};
