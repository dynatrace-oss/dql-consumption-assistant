/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: '@dynatrace/js-runtime/lib/test-environment',
  clearMocks: true,
  displayName: 'actions',
  rootDir: '../',
  roots: ['<rootDir>/actions'],
  testMatch: ['**/*.?(stateful-)action.test.ts'],
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/actions/tsconfig.action.test.json',
        isolatedModules: true,
      },
    ],
  },
};
