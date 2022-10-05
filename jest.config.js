module.exports = {
    roots: ['<rootDir>/hooks'],
    setupFilesAfterEnv: ['<rootDir>/.jest/setup.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    testMatch: ['**/*.tests.(ts|tsx)'],
    testEnvironment: 'jsdom',
    moduleDirectories: ['node_modules'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    moduleNameMapper: {
        '\\.css$': 'identity-obj-proxy',
        '\\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|pdf)$':
            '<rootDir>/.jest/file.ts'
    },
    coverageDirectory: '<rootDir>/.coverage',
    coveragePathIgnorePatterns: ['index.ts']
};
