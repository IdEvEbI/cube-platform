import vuePlugin from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default [
  {
    files: ['**/*.js', '**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: { sourceType: 'module' },
    },
    plugins: { vue: vuePlugin },
    rules: {
      'no-console': 'warn',
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'warn',
    },
  },
]
