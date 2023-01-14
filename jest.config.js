const nextJest = require('next/jest');

const createJestConfig = nextJest();
const customJestConfig = {
  testMatch: ['**/*.test.ts(x)?'],
  collectCoverage: true,
};

module.exports = createJestConfig(customJestConfig);
