const nextJest = require('next/jest');

const createJestConfig = nextJest();

/** @type {import('jest').Config} */
const customJestConfig = {
  testMatch: ['**/*.test.ts(x)?'],
  collectCoverage: true,
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

module.exports = async () => ({
  /**
   * Using ...(await createJestConfig(customJestConfig)()) to override transformIgnorePatterns
   * provided byt next/jest.
   *
   * @link https://github.com/vercel/next.js/issues/36077#issuecomment-1096635363
   */
  ...(await createJestConfig(customJestConfig)()),
  /**
   * Next-intl uses ECMAScript Modules (ESM) and Jest provides some experimental support for it
   * but "node_modules" are not transpiled by next/jest yet.
   *
   * @link https://github.com/vercel/next.js/issues/36077#issuecomment-1096698456
   * @link https://jestjs.io/docs/ecmascript-modules
   */
  transformIgnorePatterns: ['node_modules/(?!(next-intl)/)'],
});
