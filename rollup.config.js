import del from 'rollup-plugin-delete';
import commonjs from '@rollup/plugin-commonjs';
import multi from '@rollup/plugin-multi-entry';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';

export default [
    {
        input: ['src/index.tsx'],
        output: {
            dir: 'lib',
            preserveModules: true,
            preserveModulesRoot: 'src'
        },
        plugins: [
            del({ targets: 'lib/*' }),
            postcss({
                extract: false
            }),
            // multi(),
            // resolve(),
            // commonjs(),
            typescript()
        ]
    },
    {
        input: ['src/components/Button/Button.css'],
        output: {
            dir: 'output'
        },
        plugins: [
            postcss({
                extract: false
            })
        ]
    }
];
