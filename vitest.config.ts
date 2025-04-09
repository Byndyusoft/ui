import { defineConfig, TestProjectConfiguration } from 'vitest/config';

const testsGlob = '**/*.tests.(ts|tsx)';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        //https://vitest.dev/guide/workspace
        workspace: [
            'hooks/use-timeout', //workspace example. 'hooks/*' plus separate vitest.config.ts in each workspace like in README.md will work too.
            getWorkspaceConfig('components'),
            getWorkspaceConfig('hooks'),
            getWorkspaceConfig('packages')
        ]
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
