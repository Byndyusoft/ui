import typescript from '@rollup/plugin-typescript';
import baseConfig from '../../rollup.base.config';

export default {
    ...baseConfig,
    input: ['src/index.ts'],
    plugins: [
        ...baseConfig.plugins,
        typescript({
            tsconfig: './tsconfig.json',
            include: ['../../types.d.ts'],
            exclude: ['src/**/*.stories.tsx', 'src/**/*.tests.tsx', 'node_modules']
        })
    ]
};
