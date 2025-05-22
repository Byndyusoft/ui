import typescript from '@rollup/plugin-typescript';
import baseConfig from '../../rollup.base.config';

export default {
    ...baseConfig,
    input: ['src/index.ts'],
    plugins: [
        ...baseConfig.plugins,
        typescript({ tsconfig: './tsconfig.json', exclude: ['node_modules'] })
    ]
};
