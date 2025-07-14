module.exports = {
    extends: '@byndyusoft/eslint-config/frontend',
    parserOptions: {
        project: 'tsconfig.json'
    },
    env: {
        node: true
    },
    overrides: [
        {
            files: ['src/**/*.{tests,stories}.@(ts|tsx|js|jsx)', '**/__tests__/**'],
            rules: {
                '@typescript-eslint/no-magic-numbers': 'off',
                '@typescript-eslint/explicit-module-boundary-types': 'warn',
                'react/button-has-type': 'off',
                'react/forbid-dom-props': 'off'
            }
        }
    ]
};
