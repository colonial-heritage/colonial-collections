module.exports = {
  root: true,
  extends: ['@colonial-collections/eslint-config'],
  env: {
    jest: true,
  },
  rules: {
    'node/no-extraneous-import': [
      'error',
      {
        allowModules: ['@jest/globals'],
      },
    ],
  },
};
