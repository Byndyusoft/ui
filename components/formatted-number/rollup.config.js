import typescript from '@rollup/plugin-typescript';
import baseConfig from '../../rollup.base.config';

export default {
    ...baseConfig,
    input: ['src/index.ts'],
    plugins: [
        ...baseConfig.plugins,
        typescript({
            tsconfig: './tsconfig.json',
            module: 'ESNext',
            exclude: ['src/**/*.stories.tsx', 'src/__tests__/*', 'node_modules']
        })
    ]
};
