/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: '@dynatrace/js-runtime/lib/test-environment',
  clearMocks: true,
};
