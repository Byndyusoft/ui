import { readFileSync } from 'node:fs';
import typescript from '@rollup/plugin-typescript';
import { commonjsOutput, importDeclarations } from './rollup.commonjs-output.mjs';

const { dependencies = {}, peerDependencies = {} } = JSON.parse(readFileSync('package.json', 'utf8'));
const externalPackages = Object.keys({ ...dependencies, ...peerDependencies });

export default {
    input: 'src/index.ts',
    external: id => externalPackages.some(name => id === name || id.startsWith(`${name}/`)),
    output: { ...commonjsOutput, entryFileNames: 'index.js' },
    plugins: [
        typescript({
            tsconfig: './tsconfig.build.json',
            module: 'ESNext',
            rootDir: 'src'
        }),
        importDeclarations()
    ]
};
