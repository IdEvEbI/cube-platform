export default {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  transform: {
    '^.+\.js$': 'babel-jest',
  },
}
