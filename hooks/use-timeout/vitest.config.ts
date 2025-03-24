import { defineProject, mergeConfig } from 'vitest/config';
import configShared from '../../vitest.config';

/**
 * vitest.config for correct vitest workspace detection.
 * export default configShared works too.
 */
export default mergeConfig(configShared, defineProject({
    test: {
        include: ['**/*.tests.(ts|tsx)'],
        setupFiles: ['../../setupTests.ts'],
    }
}));
