# 🧪 Testes e CI/CD - MindEase Web

## 📋 Visão Geral

O projeto MindEase implementa uma estratégia completa de testes e integração contínua para garantir qualidade e confiabilidade do código.

## 🧪 Estratégia de Testes

### Estrutura de Testes

Cada microfrontend segue a mesma estrutura de testes alinhada com Clean Architecture:

```
src/
├── domain/
│   └── entities/
│       └── __tests__/
│           └── Entity.test.ts         # Testes de entidades
├── application/
│   └── useCases/
│       └── __tests__/
│           └── UseCase.test.ts        # Testes de casos de uso
├── infrastructure/
│   └── repositories/
│       └── __tests__/
│           └── Repository.test.ts     # Testes de repositórios
└── presentation/
    ├── contexts/
    │   └── __tests__/
    │       └── Context.test.tsx       # Testes de contexts
    └── components/
        └── __tests__/
            └── Component.test.tsx     # Testes de componentes

```

### Tipos de Testes Implementados

#### 1. Testes de Entidades (Domain Layer)
- **Objetivo**: Validar regras de negócio e estrutura de dados
- **Exemplos**:
  - `Task.test.ts`: Valida criação, status e prioridades de tarefas
  - `UserProfile.test.ts`: Valida perfil de usuário e rotinas
  - `UserPreferences.test.ts`: Valida preferências de acessibilidade

#### 2. Testes de Casos de Uso (Application Layer)
- **Objetivo**: Validar lógica de aplicação e orquestração
- **Exemplos**:
  - `CreateTaskUseCase.test.ts`: Testa criação de tarefas
  - `UpdateUserProfileUseCase.test.ts`: Testa atualização de perfil
  - `SavePreferencesUseCase.test.ts`: Testa salvamento de preferências

#### 3. Testes de Contexts (Presentation Layer)
- **Objetivo**: Validar gerenciamento de estado global
- **Exemplos**:
  - `ThemeContext.test.tsx`: Testa mudança de temas
  - `AccessibilityContext.test.tsx`: Testa configurações de acessibilidade

## 🛠️ Ferramentas

### Jest
Framework de testes JavaScript/TypeScript com suporte a:
- Mocking de módulos e funções
- Cobertura de código
- Testes assíncronos
- Snapshots

### React Testing Library
Biblioteca para testes de componentes React focada em:
- Testes baseados em comportamento do usuário
- Queries acessíveis (getByRole, getByLabelText)
- User interactions (click, type, etc)

### ts-jest
Preprocessador TypeScript para Jest que permite:
- Executar testes TypeScript diretamente
- Type checking durante os testes

## 📊 Cobertura de Código

### Threshold Configurado
```javascript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70,
  },
}
```

### Métricas Monitoradas
- **Branches**: 70% de cobertura em ramificações (if/else, switch)
- **Functions**: 70% de funções testadas
- **Lines**: 70% de linhas executadas
- **Statements**: 70% de declarações testadas

## 🚀 Comandos de Teste

### Desenvolvimento
```bash
# Rodar todos os testes
npm test

# Rodar testes em modo watch (re-executa ao salvar)
npm run test:watch

# Rodar testes de um pacote específico
cd packages/host && npm test
cd packages/painel-cognitivo && npm test
cd packages/organizador-tarefas && npm test
cd packages/perfil-usuario && npm test
```

### CI/CD
```bash
# Rodar testes para CI (sem watch, com coverage)
npm run test:ci
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

#### 1. CI Pipeline (`.github/workflows/ci.yml`)

**Triggers**:
- Push em `main` e `develop`
- Pull Requests em `main` e `develop`

**Jobs**:

##### Test Job
- Executa em Node.js 18.x e 20.x (matrix)
- Instala dependências
- Roda linter (continua mesmo com erros)
- Executa testes com cobertura
- Faz upload de cobertura para Codecov

##### Build Job
- Depende do Test Job
- Instala dependências
- Faz build de todos os pacotes
- Faz upload dos artefatos de build (7 dias de retenção)

##### Deploy Job
- Depende do Build Job
- Só executa em push para `main`
- Baixa artefatos de build
- Deploy para GitHub Pages
- Notifica sucesso do deployment

#### 2. Quality Check Pipeline (`.github/workflows/quality-check.yml`)

**Triggers**:
- Pull Requests em `main` e `develop`

**Jobs**:

##### Code Quality Analysis
- Executa ESLint
- Verifica TypeScript (tsc --noEmit)
- Valida formatação com Prettier
- Executa testes com cobertura
- Verifica threshold de cobertura
- Comenta PR com relatório de cobertura
- (Opcional) SonarCloud scan

### Badges de Status

Você pode adicionar badges no README:

```markdown
[![CI](https://github.com/Felipe-Tintori/tech-challenge--5/actions/workflows/ci.yml/badge.svg)](https://github.com/Felipe-Tintori/tech-challenge--5/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/Felipe-Tintori/tech-challenge--5/branch/main/graph/badge.svg)](https://codecov.io/gh/Felipe-Tintori/tech-challenge--5)
```

## 📝 Exemplos de Testes

### Teste de Entidade
```typescript
// Task.test.ts
describe('Task Entity', () => {
  it('should create a task with all properties', () => {
    const task = new Task(
      '1',
      'Test Task',
      'Description',
      'todo',
      'high'
    );

    expect(task.id).toBe('1');
    expect(task.title).toBe('Test Task');
    expect(task.status).toBe('todo');
    expect(task.priority).toBe('high');
  });
});
```

### Teste de Caso de Uso
```typescript
// CreateTaskUseCase.test.ts
describe('CreateTaskUseCase', () => {
  let mockRepository: jest.Mocked<ITaskRepository>;
  let useCase: CreateTaskUseCase;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      // ... outros métodos
    };
    useCase = new CreateTaskUseCase(mockRepository);
  });

  it('should create a task successfully', async () => {
    const taskData = { title: 'New Task', ... };
    mockRepository.create.mockResolvedValue(expectedTask);

    const result = await useCase.execute(taskData);

    expect(mockRepository.create).toHaveBeenCalled();
    expect(result.title).toBe(taskData.title);
  });
});
```

### Teste de Context
```typescript
// ThemeContext.test.tsx
describe('ThemeContext', () => {
  it('should change theme', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
  });
});
```

## 🎯 Boas Práticas

### 1. AAA Pattern (Arrange, Act, Assert)
```typescript
it('should update task status', async () => {
  // Arrange
  const task = new Task('1', 'Task', '', 'todo', 'medium');
  
  // Act
  task.status = 'done';
  
  // Assert
  expect(task.status).toBe('done');
});
```

### 2. Mock Dependencies
```typescript
const mockRepository = {
  save: jest.fn(),
  load: jest.fn(),
} as jest.Mocked<IRepository>;
```

### 3. Test Isolation
```typescript
beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});
```

### 4. Descriptive Test Names
```typescript
it('should throw error when task title is empty', () => {
  // ...
});
```

### 5. Test Edge Cases
```typescript
it('should handle empty arrays', () => {
  const profile = new UserProfile('1', 'Name', 'email', undefined, []);
  expect(profile.neurodivergence).toEqual([]);
});
```

## 🔍 Debugging Testes

### Ver Output Detalhado
```bash
npm test -- --verbose
```

### Rodar Teste Específico
```bash
npm test -- Task.test.ts
```

### Debug com VS Code
Adicione no `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal"
}
```

## 📈 Melhorias Futuras

### Testes Não Implementados
- ❌ **Component Tests**: Testes de componentes React
- ❌ **Integration Tests**: Testes de integração entre módulos
- ❌ **E2E Tests**: Testes end-to-end com Cypress/Playwright
- ❌ **Visual Regression**: Testes de regressão visual
- ❌ **Performance Tests**: Testes de performance e lighthouse

### Recomendações
1. Adicionar testes de componentes com React Testing Library
2. Implementar E2E tests para fluxos críticos
3. Configurar Storybook para documentação de componentes
4. Adicionar testes de acessibilidade com jest-axe
5. Implementar testes de performance com Lighthouse CI

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Codecov](https://codecov.io/)
- [Testing Best Practices](https://testingjavascript.com/)

---

**Desenvolvido para o Hackathon FIAP 2026** 🧠✨
