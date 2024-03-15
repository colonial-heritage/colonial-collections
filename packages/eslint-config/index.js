module.exports = {
  extends: ['next', 'turbo', '../../node_modules/gts/'],
  rules: {
    'capitalized-comments': [
      'error',
      'always',
      {
        ignoreConsecutiveComments: true,
      },
    ],
    'import/no-anonymous-default-export': [2, {allowObject: true}],
  },
};
