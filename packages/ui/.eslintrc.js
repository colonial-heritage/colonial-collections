module.exports = {
  root: true,
  extends: ['custom'],
  rules: {
    'node/no-unpublished-require': [
      'error',
      {
        allowModules: ['tailwind-config'],
      },
    ],
  },
};
