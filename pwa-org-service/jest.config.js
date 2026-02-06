const path = require('path');

module.exports = {
    displayName: 'org-service',
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '.',
    roots: ['<rootDir>/src'],
    testRegex: '.*\\.spec\\.ts$',
    moduleFileExtensions: ['js', 'json', 'ts'],

    transform: {
        '^.+\\.(t|j)s$': [
            'ts-jest',
            {
                tsconfig: path.resolve(__dirname, './tsconfig.test.json'),
                useESM: true,
            },
        ],
    },

    transformIgnorePatterns: [
        'node_modules/(?!(jose)/)'
    ],

    moduleNameMapper: {
        "^@pwa/shared/(.*)$": "<rootDir>/../pwa-shared/src/$1"
    },

    moduleDirectories: ['node_modules', '<rootDir>'],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
    ],
};