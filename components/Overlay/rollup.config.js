// import typescript from '@rollup/plugin-typescript';
// import baseConfig from '../../rollup.base.config';
// import wyw from '@wyw-in-js/rollup';
// import css from 'rollup-plugin-css-only';
// import linaria from '@linaria/vite';
// import babel from '@rollup/plugin-babel';

// export default {
//     ...baseConfig,
//     input: ['src/index.ts'],
//     plugins: [
//         ...baseConfig.plugins,
//         typescript({b
//             tsconfig: './tsconfig.json',
//             module: 'ESNext',
//             exclude: ['src/*.stories.tsx', 'src/*.tests.tsx', 'node_modules']
//         }),
//         wyw({
//             sourceMap: process.env.NODE_ENV !== 'production'
//         }),
//         css({
//             output: 'styles.css'
//         }),
//         babel({
//             babelHelpers: 'bundled',
//             extensions: ['.js', '.jsx', '.ts', '.tsx'],
//             exclude: 'node_modules/**',
//             rootMode: 'upward' // Здесь указываем rootMode
//         })
//     ]
// };

import linaria from '@linaria/rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/index.ts',
    output: {
        exports: 'named',
        format: 'cjs',
        dir: 'dist',
        preserveModules: true,
        preserveModulesRoot: 'src',
        assetFileNames: '[name]-[hash][extname]'
    },
    plugins: [
        nodeResolve({
            extensions: ['.js', '.jsx', '.ts', '.tsx']
        }),
        commonjs(),
        linaria({
            sourceMap: process.env.NODE_ENV !== 'production',
            babelOptions: {
                presets: [
                    '@babel/preset-env',
                    '@babel/preset-react',
                    '@babel/preset-typescript',
                    'linaria/babel-preset' // Используйте пресет Linaria
                ]
                // plugins: [
                //     'rollup/babel'
                // ]
            }
        })
    ]
};
