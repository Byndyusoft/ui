module.exports = {
    roots: ['<rootDir>/src'],
    setupFilesAfterEnv: ['<rootDir>/.jest/setup.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    moduleNameMapper: {
        '\\.css$': 'identity-obj-proxy',
        '\\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|pdf)$':'<rootDir>/.jest/file.ts'
    },
    coveragePathIgnorePatterns: ['index.ts']
};
