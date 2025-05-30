import typescript from '@rollup/plugin-typescript';
import baseConfig from '../../rollup.base.config.mjs';
import scss from 'rollup-plugin-scss';

export default {
    ...baseConfig,
    input: ['src/index.ts'],
    plugins: [
        ...baseConfig.plugins,
        scss(),
        typescript({
            tsconfig: './tsconfig.json',
            exclude: ['src/**/*.stories.tsx', 'src/**/*.tests.tsx', 'node_modules']
        })
    ]
};
