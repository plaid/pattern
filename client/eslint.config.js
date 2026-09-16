import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    plugins: { prettier: prettierPlugin },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];
