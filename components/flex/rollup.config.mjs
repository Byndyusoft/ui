import typescript from '@rollup/plugin-typescript';
import baseConfig from '../../rollup.base.config.mjs';
import postcss from 'rollup-plugin-postcss';

export default {
    ...baseConfig,
    input: ['src/index.ts'],
    plugins: [
        ...baseConfig.plugins,
        postcss(),
        typescript({
            tsconfig: './tsconfig.json',
            exclude: ['src/**/*.stories.tsx', 'src/**/*.tests.tsx', 'node_modules']
        })
    ]
};
