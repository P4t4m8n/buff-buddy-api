module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
   setupFilesAfterEnv: ['./src/lib/jest.setup.ts'], 

};