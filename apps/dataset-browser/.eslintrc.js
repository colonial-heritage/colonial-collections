module.exports = {
  root: true,
  extends: ['custom'],
  rules: {
    'node/no-extraneous-import': [
      'error',
      {
        allowModules: ['ui'],
      },
    ],
  },
};
