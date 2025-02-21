import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
    },
    plugins: { prettier },
    rules: {
      'no-console': 'off',
      'prettier/prettier': 'error',
    },
  },
  prettierConfig,
]
