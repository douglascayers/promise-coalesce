module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['src'],
  setupFilesAfterEnv: ['./jest-setup.ts'],
};
