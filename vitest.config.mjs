import { defineConfig } from 'vitest/config';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    plugins: [svgr()],
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['**/*.{test,tests,spec}.[jt]s?(x)'],
        setupFiles: ['./setupTests.ts'],
        typecheck: {
            include: ['**/*.tests-d.ts']
        }
    }
});
