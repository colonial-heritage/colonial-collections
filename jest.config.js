const nextJest = require('next/jest');

const createJestConfig = nextJest();

const customJestConfig = {
  testMatch: ['**/*.test.ts(x)?'],
  collectCoverage: true,
  setupFiles: ['<rootDir>/jest.setup.js'],
};

module.exports = createJestConfig(customJestConfig);
