module.exports = {
  extends: ['./base.cjs', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    // React specific rules
    'react/react-in-jsx-scope': 'off', // Not needed with React 17+ JSX transform
    'react/no-unescaped-entities': 'off', // Allow apostrophes in JSX text
  }
};
