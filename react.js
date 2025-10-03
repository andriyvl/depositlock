module.exports = {
  extends: [require.resolve('./base'), 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    // React specific rules
  }
}; 