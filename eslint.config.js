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
            files: ['src/**/*.tests.@(ts|tsx|js|jsx)', 'src/**/*.stories.@(ts|tsx|js|jsx)'],
            rules: {
                '@typescript-eslint/no-magic-numbers': 'off',
                'react/button-has-type': 'off'
            }
        }
    ]
};
