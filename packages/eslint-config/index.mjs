// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import vitest from 'eslint-plugin-vitest';
import testingLibrary from 'eslint-plugin-testing-library';
import prettierFlatConfig from 'eslint-config-prettier/flat';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    reactPlugin.configs.flat['jsx-runtime'],
    reactHooks.configs['recommended-latest'],
    {
        files: ['**/*.{ts,tsx}'],
        extends: [importPlugin.flatConfigs.recommended, importPlugin.flatConfigs.typescript]
    },
    {
        files: ['**/*.test{s,}.ts{x,}'],
        ...testingLibrary.configs['flat/react'],
        plugins: {
            vitest,
            ...testingLibrary.configs['flat/react'].plugins
        },
        rules: {
            ...vitest.configs.recommended.rules,
            ...testingLibrary.configs['flat/react'].rules
        }
    },
    jsxA11y.flatConfigs.recommended,
    prettierFlatConfig
);
