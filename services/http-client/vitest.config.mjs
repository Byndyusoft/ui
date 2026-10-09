import { defineProject } from 'vitest/config';

export default defineProject({
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['test/**/*.{test,tests,spec}.[jt]s?(x)'],
        setupFiles: ['../../setupTests.ts'],
        typecheck: {
            include: ['test/**/*.tests-d.ts'],
            tsconfig: './tsconfig.json'
        }
    }
});
