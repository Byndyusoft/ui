import typescript from '@rollup/plugin-typescript';
import baseConfig from '../../rollup.base.config.mjs';
import { commonjsOutput, importDeclarations } from '../../rollup.commonjs-output.mjs';

export default {
    ...baseConfig,
    output: { ...baseConfig.output, ...commonjsOutput },
    plugins: [
        ...baseConfig.plugins,
        typescript({
            tsconfig: './tsconfig.json',
            exclude: [
                'src/**/*.stories.*',
                'src/**/__stories__',
                'src/**/*.docs.*',
                'src/**/*.tests.*',
                'src/**/__tests__/**'
            ]
        }),
        importDeclarations()
    ]
};
