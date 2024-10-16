module.exports = {
    roots: ['<rootDir>/components', '<rootDir>/hooks', '<rootDir>/services'],
    setupFilesAfterEnv: ['<rootDir>/.jest/setup.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    testMatch: ['**/*.tests.(ts|tsx)'],
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    moduleNameMapper: {
        '\\.css$': 'identity-obj-proxy',
        '\\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|pdf)$':
            '<rootDir>/.jest/file.ts',
        "\\.svg": "<rootDir>.jest/svg.tsx"
    },
    coverageDirectory: '<rootDir>/.coverage',
    coveragePathIgnorePatterns: ['.jest', 'index.ts'],
    clearMocks: true
};
