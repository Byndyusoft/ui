import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
    open: true,
    nodeResolve: true,
    appIndex: './packages/ui-esbuild/src/index.html',
    rootDir: '../../',
    plugins: [esbuildPlugin({ target: 'auto', ts: true, tsx: true, jsxFactory: 'h', jsxFragment: 'Fragment' })]
};
