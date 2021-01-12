/* eslint-disable */

import path from 'path';
import fs from 'fs-extra';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import styles from 'rollup-plugin-styles';

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
            styles({
                mode: 'extract',
                onExtract: data => {
                    if (!data.name.includes('/index.css')) {
                        fs.outputFile(path.resolve(__dirname, 'lib', data.name), data.css, err => {
                            if (err) {
                                console.error('Error with bundling css', err);
                            }
                        });
                    }
                    return false;
                }
            }),
            typescript({
                exclude: ['**/*.stories.tsx']
            })
        ]
    }
];
