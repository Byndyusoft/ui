import typescript from '@rollup/plugin-typescript';
import compiler from 'typescript';
import baseConfig from '../../rollup.base.config.mjs';

// The plugin creates a watch program even for one-off builds. Its filesystem watchers
// can outlive program.close() on macOS. Rollup still receives the full initial typecheck
// and emit; only a genuine watch build needs TypeScript's persistent subscriptions.
const buildCompiler = process.env.ROLLUP_WATCH
    ? compiler
    : {
          ...compiler,
          sys: {
              ...compiler.sys,
              watchFile: () => ({ close() {} }),
              watchDirectory: () => ({ close() {} })
          }
      };

export default {
    ...baseConfig,
    // Keep all engine subpaths external: duplicate ProseMirror instances break plugin keys and selections.
    external: id => id.startsWith('@tiptap/'),
    plugins: [
        ...baseConfig.plugins,
        typescript({
            typescript: buildCompiler,
            tsconfig: './tsconfig.json',
            exclude: [
                'src/**/*.stories.*',
                'src/**/__stories__/**',
                'src/**/*.docs.*',
                'src/**/*.{test,tests,spec}.{ts,tsx}',
                'src/**/*.tests-d.ts',
                'src/**/__tests__/**'
            ]
        })
    ]
};
