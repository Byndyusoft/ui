module.exports = {
    roots: ['<rootDir>/src'],
    setupFilesAfterEnv: ['<rootDir>/.jest/setup.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    coveragePathIgnorePatterns: ['index.ts'],
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': '<rootDir>/.jest/styleMock.js',
        '\\.(gif|ttf|eot|svg)$': '<rootDir>/.jest/fileMock.js'
    }
};
