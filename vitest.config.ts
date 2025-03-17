import { defineConfig, TestProjectConfiguration } from 'vitest/config';

const testsGlob = '**/*.tests.(ts|tsx)';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        workspace: [getWorkspaceConfig('components'), getWorkspaceConfig('hooks'), getWorkspaceConfig('packages')]
    }
});

function getWorkspaceConfig(name: string): TestProjectConfiguration {
    return {
        extends: true,
        test: {
            name,
            include: [`./${name}/${testsGlob}`],
            setupFiles: ['./setupTests.ts']
        }
    };
}
