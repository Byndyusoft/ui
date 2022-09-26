module.exports = {
    extends: '@byndyusoft/eslint-config/frontend',
    parserOptions: {
        project: 'tsconfig.json'
    },
    overrides: [
        {
            files: ['src/**/*.tests.@(ts|tsx|js|jsx)'],
            rules: {
                '@typescript-eslint/no-magic-numbers': 'off'
            }
        }
    ]
};
