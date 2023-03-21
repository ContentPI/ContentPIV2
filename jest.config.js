/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: './',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: ['<rootDir>/packages/**/src/*.{ts,tsx}'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageReporters: ['json', 'lcov', 'html'],
  projects: [
    {
      displayName: 'API Package',
      testEnvironment: 'node',
      transform: {
        '^.+\\.tsx?$': 'ts-jest'
      },
      testMatch: ['<rootDir>/packages/api/**/?(*.)+(spec|test).[jt]s?(x)'],
      testPathIgnorePatterns: ['<rootDir>/packages/api/dist']
    },
    {
      displayName: 'Utils Package',
      testEnvironment: 'node',
      transform: {
        '^.+\\.tsx?$': 'ts-jest'
      },
      testMatch: ['<rootDir>/packages/utils/**/?(*.)+(spec|test).[jt]s?(x)'],
      testPathIgnorePatterns: ['<rootDir>/packages/utils/dist']
    }
  ]
}
