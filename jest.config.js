module.exports = {
    roots: ['<rootDir>/src'],
    setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx']
};
