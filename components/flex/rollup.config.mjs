import typescript from '@rollup/plugin-typescript';
import baseConfig from '../../rollup.base.config.mjs';

export default {
    ...baseConfig,
    plugins: [
        ...baseConfig.plugins,
        typescript({
            tsconfig: './tsconfig.json',
            exclude: [
                'src/**/*.stories.*',
                'src/**/__stories__',
                'src/**/*.docs.*',
                'src/**/*.tests.*',
                'src/**/__tests__'
            ]
        })
    ]
};
