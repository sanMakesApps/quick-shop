module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.cjs'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.cjs',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { 
      presets: ['@babel/preset-env', '@babel/preset-react'],
      targets: {
        node: 'current',
      },
    }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@mui|@babel|@emotion|msw|@mswjs)/)',
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/',
    '/coverage/'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.jsx',
  ],
  moduleDirectories: ['node_modules', 'src'],
  verbose: true,
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  extensionsToTreatAsEsm: ['.jsx'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  testTimeout: 10000,
  globals: {
    'process.env': {
      NODE_ENV: 'test',
    },
  },
}; 