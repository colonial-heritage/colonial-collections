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

module.exports = createJestConfig(customJestConfig);
