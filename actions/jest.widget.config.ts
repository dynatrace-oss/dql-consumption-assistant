const { stratoPreset } = require('@dynatrace/strato-components-preview-testing/jest/preset');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  ...stratoPreset,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  clearMocks: true,
  displayName: 'widgets',
  rootDir: '../',
  roots: ['<rootDir>/actions'],
  testMatch: ['**/*.widget.test.tsx'],
  setupFiles: ['@dynatrace-sdk/navigation/testing'],
  setupFilesAfterEnv: ['<rootDir>/src/setupJest.ts', '@dynatrace/strato-components-preview-testing/jest/setup'],
  transform: {
    '^.+\\.(t|j)sx$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/actions/tsconfig.widget.test.json',
        isolatedModules: true,
      },
    ],
  },
};
