module.exports = {
  watchman: false,
  preset: 'jest-expo',
  testMatch: ['<rootDir>/tests/native/**/*.test.tsx'],
  setupFilesAfterEnv: ['<rootDir>/tests/native/setup.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
  clearMocks: true,
};
