import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import vuePlugin from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default [
  {
    ignores: [
      'docs/**',
      '.vitepress/**',
      'coverage/**',
      'dist/**',
      'node_modules/**',
    ],
  },
  {
    files: ['frontend/**/*.{js,mjs,vue}', 'backend/**/*.{js,mjs}'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      parser: vueParser,
      parserOptions: { sourceType: 'module' },
    },
    plugins: { prettier, vue: vuePlugin },
    rules: {
      'no-console': 'off',
      'prettier/prettier': 'error',
      'vue/multi-word-component-names': 'off',
    },
  },
  prettierConfig,
]
