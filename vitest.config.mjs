import { defineConfig } from 'vitest/config';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    plugins: [svgr()],
    test: {
        globals: true,
        // React 17 resolves jsx-runtime through the browser bundler for this client-only integration.
        server: { deps: { inline: ['@tiptap/react'] } },
        environment: 'jsdom',
        include: ['**/*.{test,tests,spec}.[jt]s?(x)'],
        setupFiles: ['./setupTests.ts'],
        typecheck: {
            include: ['**/*.tests-d.ts']
        }
    }
});
