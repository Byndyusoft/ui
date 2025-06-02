import typescript from '@rollup/plugin-typescript';
import baseConfig from '../../rollup.base.config.mjs';

export default {
    ...baseConfig,
    input: ['src/index.ts'],
    output: {
        ...baseConfig.output,
        format: 'esm',
        preserveModules: false
    },
    plugins: [
        ...baseConfig.plugins,
        typescript({
            tsconfig: './tsconfig.json',
            exclude: ['src/**/*.stories.tsx', 'src/**/*.tests.tsx', 'node_modules'],
            module: 'ESNext'
        })
    ]
};
