module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-custom`
  extends: ['custom'],
  env: {
    jest: true,
  },
  rules: {
    'node/no-unpublished-import': [
      'error',
      {
        allowModules: ['@jest/globals'],
      },
    ],
  },
};
