const path = require('path');

module.exports = {
    displayName: 'event-handler',
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: 'src',
    testRegex: '.*\\.spec\\.ts$',
    moduleFileExtensions: ['js', 'json', 'ts'],

    transform: {
        '^.+\\.(t|j)s$': [
            'ts-jest',
            {
                tsconfig: path.resolve(__dirname, './tsconfig.test.json'),
            },
        ],
    },
    moduleNameMapper: {
        "^@pwa/shared/(.*)$": "<rootDir>/../pwa-shared/src/$1"
    },

    transformIgnorePatterns: ['/node_modules/'],
    moduleDirectories: ['node_modules', '<rootDir>'],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
    ],
};