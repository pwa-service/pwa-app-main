const path = require('path');
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.test.json');

module.exports = {
    displayName: 'auth-service',
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

    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>/',
    }),

    moduleDirectories: ['node_modules', '<rootDir>'],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
    ],
};