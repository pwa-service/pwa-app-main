const path = require('path');
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.test.json');

module.exports = {
    displayName: 'event-handler',
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
            },
        ],
    },
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>/',
    }),

    transformIgnorePatterns: [
        '/node_modules/(?!(jose)/)'
    ],
    moduleDirectories: ['node_modules', '<rootDir>'],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
    ],
};