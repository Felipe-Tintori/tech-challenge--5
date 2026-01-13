module.exports = {
  projects: [
    '<rootDir>/packages/host',
    '<rootDir>/packages/painel-cognitivo',
    '<rootDir>/packages/organizador-tarefas',
    '<rootDir>/packages/perfil-usuario',
  ],
  testEnvironment: 'jsdom',
  collectCoverage: false,
  collectCoverageFrom: [
    'packages/**/src/**/*.{ts,tsx}',
    '!packages/**/src/**/*.d.ts',
    '!packages/**/src/**/*.test.{ts,tsx}',
    '!packages/**/src/setupTests.ts',
    '!packages/**/src/index.tsx',
    '!packages/**/src/bootstrap.tsx',
    '!packages/**/src/**/__tests__/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
