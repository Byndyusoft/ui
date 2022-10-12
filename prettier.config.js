module.exports = {
    arrowParens: 'avoid',
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'none',
    printWidth: 120,
    overrides: [
        {
            files: ['*.scss', '.css'],
            options: {
                singleQuote: false
            }
        },
        {
            files: ['*.json'],
            options: {
                tabWidth: 2
            }
        }
    ]
};
