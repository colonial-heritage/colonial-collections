module.exports = {
  root: true,
  extends: ['@colonial-collections/eslint-config'],
  env: {
    jest: true,
  },
  rules: {
    'node/no-unpublished-import': [
      'error',
      {
        allowModules: ['@jest/globals', '@rdfjs/types'],
      },
    ],
  },
};
