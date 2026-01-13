# 🚀 MindEase Web - Guia de Instalação e Desenvolvimento

## ✨ Estrutura Criada

O projeto foi estruturado com **Module Federation (Webpack 5)** e **Clean Architecture**:

```
mindease-web/
├── package.json                     # Workspace root
├── packages/
│   ├── host/                        # ✅ Aplicação principal (Porta 3000)
│   │   ├── src/
│   │   │   ├── components/          # Header, Sidebar, Layout
│   │   │   ├── contexts/            # Theme, Accessibility, Auth
│   │   │   ├── pages/               # Home, Login
│   │   │   ├── routes/              # AppRouter com Module Federation
│   │   │   └── styles/              # CSS global com variáveis de acessibilidade
│   │   ├── webpack.config.js        # Module Federation configurado
│   │   └── package.json
│   │
│   ├── painel-cognitivo/            # ✅ Dashboard (Porta 3001)
│   │   ├── src/
│   │   │   ├── domain/              # Entidades (Clean Architecture)
│   │   │   ├── application/         # Casos de uso
│   │   │   ├── infrastructure/      # Repositórios (LocalStorage)
│   │   │   └── presentation/        # Componentes React
│   │   ├── webpack.config.js        # Expõe './App'
│   │   └── package.json
│   │
│   ├── organizador-tarefas/         # ⏳ Tarefas + Kanban (Porta 3002)
│   ├── perfil-usuario/              # ⏳ Perfil e Config (Porta 3003)
│   └── shared/                      # ✅ Tipos TypeScript compartilhados
│       └── src/types/               # Domain, Infrastructure, UI types
```

## 📋 Pré-requisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git**

## 🔧 Instalação

### 1. Instalar dependências do workspace principal

```powershell
npm install
```

### 2. Instalar dependências de cada pacote

```powershell
# Shared (tipos)
cd packages\shared
npm install
npm run build
cd ..\..

# Host
cd packages\host
npm install
cd ..\..

# Painel Cognitivo
cd packages\painel-cognitivo
npm install
cd ..\..
```

### 3. Criar os microfrontends restantes (PRÓXIMOS PASSOS)

Os microfrontends **Organizador de Tarefas** e **Perfil do Usuário** devem ser criados seguindo a mesma estrutura do Painel Cognitivo.

## 🚀 Executando o Projeto

### Desenvolvimento (Todos os microfrontends simultaneamente)

```powershell
npm run dev
```

Isso iniciará:
- **Host**: http://localhost:3000
- **Painel Cognitivo**: http://localhost:3001
- **Organizador Tarefas**: http://localhost:3002 (quando criado)
- **Perfil Usuário**: http://localhost:3003 (quando criado)

### Desenvolvimento (Individual)

```powershell
# Host
npm run dev:host

# Painel Cognitivo
npm run dev:painel

# Organizador Tarefas
npm run dev:tarefas

# Perfil Usuário
npm run dev:perfil
```

### Build para Produção

```powershell
npm run build
```

## 🎨 Recursos de Acessibilidade Implementados

### No Host

1. **ThemeContext**: Gerencia tema (claro/escuro/alto contraste)
2. **AccessibilityContext**: Modo foco, nível de complexidade, alertas cognitivos
3. **CSS Variáveis**: Tokens de design system com suporte a customização
4. **Keyboard Navigation**: Navegação completa por teclado
5. **ARIA Labels**: Acessibilidade para leitores de tela
6. **Skip Links**: "Pular para conteúdo principal"

### No Painel Cognitivo

1. **Controle de Tema**: Claro / Escuro / Alto Contraste
2. **Controle de Fonte**: 4 níveis de tamanho
3. **Controle de Espaçamento**: Compacto até Espaçoso
4. **Modo Foco**: Remove distrações
5. **Nível de Complexidade**: Mínimo a Detalhado
6. **Métricas Cognitivas**: Visualização de produtividade

## 🏗️ Arquitetura Clean (Painel Cognitivo)

```
src/
├── domain/
│   └── entities/               # Entidades puras (UserPreferences)
├── application/
│   └── useCases/               # Casos de uso (Get/Update Preferences)
├── infrastructure/
│   └── repositories/           # Implementações (LocalStorage)
└── presentation/
    ├── components/             # Componentes React
    └── pages/                  # Páginas
```

**Fluxo de dados**:
1. **Presentation** → chama **Use Case**
2. **Use Case** → usa **Repository Interface**
3. **Infrastructure** → implementa **Repository**
4. **Domain** → define **Entidades puras**

## 📦 Module Federation

### Como funciona

1. **Host** carrega os remotes dinamicamente
2. Cada microfrontend expõe seu `App` component
3. Dependências compartilhadas (React, Router) são singleton
4. Cada micro pode rodar standalone ou integrado

### Adicionar novo microfrontend

**No webpack.config.js do HOST**:
```javascript
remotes: {
  novoModulo: 'novoModulo@http://localhost:3004/remoteEntry.js',
}
```

**No webpack.config.js do NOVO MÓDULO**:
```javascript
new ModuleFederationPlugin({
  name: 'novoModulo',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/App',
  },
  // ... shared
})
```

## 🎯 Próximos Passos para Completar o Projeto

### 1. Criar Organizador de Tarefas (packages/organizador-tarefas)

**Funcionalidades**:
- Kanban Board (Todo, In Progress, Done)
- Timer Pomodoro integrado
- CRUD de tarefas
- Subtarefas (checklist)
- Categorias e tags
- Filtros e busca

**Clean Architecture**:
```
domain/entities/Task.ts
application/useCases/CreateTaskUseCase.ts
infrastructure/repositories/TaskRepository.ts
presentation/components/KanbanBoard.tsx
presentation/components/PomodoroTimer.tsx
```

### 2. Criar Perfil do Usuário (packages/perfil-usuario)

**Funcionalidades**:
- Edição de perfil
- Preferências salvas (persistência)
- Rotinas de estudo/trabalho
- Histórico de atividades
- Exportar/importar configurações

**Clean Architecture**:
```
domain/entities/User.ts
application/useCases/UpdateUserUseCase.ts
infrastructure/repositories/UserRepository.ts
presentation/components/ProfileForm.tsx
```

### 3. Integração com Backend (Opcional)

Substituir `LocalStorageRepository` por `ApiRepository`:

```typescript
// infrastructure/repositories/ApiTaskRepository.ts
export class ApiTaskRepository implements ITaskRepository {
  async findAll(): Promise<Task[]> {
    const response = await fetch('/api/tasks');
    return response.json();
  }
  // ...
}
```

### 4. Testes

```powershell
npm run test
```

Criar testes para:
- **Use Cases**: Lógica de negócio
- **Components**: Renderização e interação
- **Integration**: Module Federation

### 5. CI/CD

Configurar pipeline para:
1. Build de todos os pacotes
2. Testes automatizados
3. Deploy independente de cada microfrontend

## 🔍 Estrutura de Dados

### UserPreferences (LocalStorage)
```json
{
  "theme": "light",
  "fontSize": "medium",
  "spacing": "normal",
  "animationsEnabled": true,
  "focusMode": false,
  "complexityLevel": "standard",
  "highContrast": false
}
```

### Task (Para Organizador)
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  estimatedTime?: number;
  actualTime?: number;
  subtasks?: Subtask[];
}
```

## 🎨 CSS Custom Properties (Design Tokens)

Todas as customizações de acessibilidade usam CSS Variables:

```css
:root {
  --color-primary-500: #6366f1;
  --font-size-base: 1rem;
  --spacing-4: 1rem;
  /* ... */
}

[data-theme="dark"] {
  --color-background: #0f172a;
  /* ... */
}

[data-font-size="large"] {
  --font-size-base: 1.125rem;
  /* ... */
}
```

## 📚 Documentação Adicional

- [Module Federation Docs](https://webpack.js.org/concepts/module-federation/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Accessibility](https://react.dev/learn/accessibility)

## 🤝 Contribuindo

1. Crie uma branch para sua feature
2. Siga a estrutura Clean Architecture
3. Adicione testes
4. Documente mudanças significativas

## 📞 Suporte

Para dúvidas sobre o projeto, consulte:
- README.md na raiz
- Comentários no código
- Documentação inline (JSDoc)

---

**Desenvolvido para o Hackathon FIAP Inclusive 2026** 🧠✨
