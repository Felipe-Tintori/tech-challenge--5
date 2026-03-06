module.exports = {
  projects: [
    '<rootDir>/packages/host',
    '<rootDir>/packages/painel-cognitivo',
    '<rootDir>/packages/organizador-tarefas',
    '<rootDir>/packages/perfil-usuario',
  ],
  testEnvironment: 'jsdom',
  collectCoverage: true,
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
