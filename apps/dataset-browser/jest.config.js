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

/**
 * Don't try to transform the package `next-intl`, or else you will get the error:
 * "SyntaxError: Cannot use import statement outside a module"
 *
 * `next-intl` uses ECMAScript Modules (ESM) and Jest provides some experimental support for it
 * but "node_modules" are not transpiled by next/jest yet.
 *
 * @link https://github.com/vercel/next.js/issues/36077#issuecomment-1096698456
 * @link https://jestjs.io/docs/ecmascript-modules
 *
 * To set `transformIgnorePatterns` you first need to load the jest config.
 * @link https://github.com/vercel/next.js/issues/36077#issuecomment-1096635363
 */

module.exports = async () => ({
  ...(await createJestConfig(customJestConfig)()),

  transformIgnorePatterns: ['node_modules/(?!(next-intl)/)'],
});
