# 🚀 Comandos Rápidos - MindEase Web

## Instalação Inicial

### Windows PowerShell

```powershell
# 1. Instalar dependência do workspace root
npm install

# 2. Instalar dependências do Shared
cd packages\shared
npm install
npm run build
cd ..\..

# 3. Instalar dependências do Host
cd packages\host
npm install
cd ..\..

# 4. Instalar dependências do Painel Cognitivo
cd packages\painel-cognitivo
npm install
cd ..\..

# 5. Instalar dependências do Organizador de Tarefas
cd packages\organizador-tarefas
npm install
cd ..\..

# 6. Instalar dependências do Perfil do Usuário
cd packages\perfil-usuario
npm install
cd ..\..
```

## Executar o Projeto

### Opção 1: Todos os microfrontends (Recomendado)

```powershell
npm run dev
```

Isso iniciará:
- Host: http://localhost:3000
- Painel Cognitivo: http://localhost:3001
- Organizador Tarefas: http://localhost:3002
- Perfil Usuário: http://localhost:3003

### Opção 2: Individual

```powershell
# Terminal 1 - Host
npm run dev:host

# Terminal 2 - Painel Cognitivo
npm run dev:painel

# Terminal 3 - Organizador Tarefas
npm run dev:tarefas

# Terminal 4 - Perfil Usuário
npm run dev:perfil
```

## Login na Aplicação

Use qualquer e-mail e senha (versão demo):
- Email: `usuario@teste.com`
- Senha: `123456`

## Build para Produção

```powershell
npm run build
```

## Estrutura de Pastas Criada

```
web/
├── package.json                    ✅ Workspace configurado
├── README.md                       ✅ Documentação principal
├── SETUP.md                        ✅ Guia de instalação detalhado
├── .eslintrc.json                  ✅ Linting configurado
├── tsconfig.json                   ✅ TypeScript global
├── .gitignore                      ✅ Git ignore
│
└── packages/
    ├── shared/                     ✅ COMPLETO - Tipos compartilhados
    │   ├── src/types/
    │   │   ├── domain.ts
    │   │   ├── infrastructure.ts
    │   │   └── ui.ts
    │   └── package.json
    │
    ├── host/                       ✅ COMPLETO - App principal
    │   ├── src/
    │   │   ├── components/         (Header, Sidebar, Layout, ErrorBoundary)
    │   │   ├── contexts/           (Theme, Accessibility, Auth)
    │   │   ├── pages/              (Home, Login)
    │   │   ├── routes/             (AppRouter com Module Federation)
    │   │   ├── styles/             (CSS global + variáveis)
    │   │   └── types/              (Module Federation declarations)
    │   ├── webpack.config.js       (Module Federation configurado)
    │   └── package.json
    │
    ├── painel-cognitivo/           ✅ COMPLETO - Dashboard
    │   ├── src/
    │   │   ├── domain/             (Entities - UserPreferences)
    │   │   ├── application/        (Use Cases - Get/Update)
    │   │   ├── infrastructure/     (LocalStorageRepository)
    │   │   └── presentation/       (Components + Pages)
    │   │       ├── components/     (ThemeControl, FontSizeControl, etc)
    │   │       └── pages/          (DashboardPage)
    │   ├── webpack.config.js
    │   └── package.json
    │
    ├── organizador-tarefas/        ✅ ESTRUTURA BASE - Tarefas + Kanban
    │   ├── src/                    (Estrutura pronta para desenvolvimento)
    │   ├── webpack.config.js
    │   └── package.json
    │
    └── perfil-usuario/             ✅ ESTRUTURA BASE - Perfil
        ├── src/                    (Estrutura pronta para desenvolvimento)
        ├── webpack.config.js
        └── package.json
```

## Funcionalidades Implementadas

### ✅ Host App
- [x] Module Federation configurado
- [x] Roteamento com React Router
- [x] Context API (Theme, Accessibility, Auth)
- [x] Layout responsivo com Header e Sidebar
- [x] Modo Foco (esconde sidebar)
- [x] Sistema de autenticação (mock)
- [x] Error Boundary
- [x] Página de Login
- [x] Página Home

### ✅ Painel Cognitivo (Clean Architecture Completa)
- [x] Controle de Tema (Claro/Escuro/Alto Contraste)
- [x] Controle de Tamanho de Fonte (4 níveis)
- [x] Controle de Espaçamento (Compacto a Espaçoso)
- [x] Modo Foco (toggle)
- [x] Nível de Complexidade (Mínimo a Detalhado)
- [x] Métricas Cognitivas (Dashboard)
- [x] Domain Layer (Entities)
- [x] Application Layer (Use Cases)
- [x] Infrastructure Layer (LocalStorage Repository)
- [x] Presentation Layer (React Components)

### 🚧 Organizador de Tarefas (Base Criada)
- [x] Webpack + Module Federation
- [x] Estrutura de pastas
- [ ] Kanban Board (Para implementar)
- [ ] Timer Pomodoro (Para implementar)
- [ ] CRUD de Tarefas (Para implementar)
- [ ] Clean Architecture (Para implementar)

### 🚧 Perfil do Usuário (Base Criada)
- [x] Webpack + Module Federation
- [x] Estrutura de pastas
- [ ] Formulário de Perfil (Para implementar)
- [ ] Gerenciamento de Preferências (Para implementar)
- [ ] Rotinas (Para implementar)
- [ ] Clean Architecture (Para implementar)

## Recursos de Acessibilidade Cognitiva

- ✅ Modo Foco
- ✅ Tema Claro/Escuro/Alto Contraste
- ✅ Tamanho de Fonte Ajustável
- ✅ Espaçamento Customizável
- ✅ Redução de Movimento (prefers-reduced-motion)
- ✅ Navegação por Teclado
- ✅ ARIA Labels
- ✅ Skip Links
- ✅ Indicadores de Foco Aprimorados

## Tecnologias

- **React 18** + TypeScript
- **Webpack 5** + Module Federation
- **React Router 6**
- **CSS Variables** (Design Tokens)
- **Clean Architecture**
- **LocalStorage** para persistência

## Próximos Passos

1. **Implementar Organizador de Tarefas**:
   - Kanban Board com drag-and-drop
   - Timer Pomodoro
   - CRUD completo
   - Clean Architecture

2. **Implementar Perfil do Usuário**:
   - Formulário de edição
   - Persistência de preferências
   - Histórico de atividades
   - Clean Architecture

3. **Integração Backend (Opcional)**:
   - Substituir LocalStorage por API
   - Autenticação real
   - Sincronização entre dispositivos

4. **Testes**:
   - Unit tests (Jest)
   - Integration tests
   - E2E tests (Playwright/Cypress)

5. **CI/CD**:
   - GitHub Actions
   - Deploy automático

## Problemas Comuns

### Erro: "Cannot find module 'painelCognitivo/App'"
**Solução**: Certifique-se de que todos os microfrontends estão rodando.

### Erro: "Port already in use"
**Solução**: Mate o processo que está usando a porta:
```powershell
# Ver processos na porta 3000
netstat -ano | findstr :3000

# Matar processo (substitua PID)
taskkill /PID <PID> /F
```

### CSS não está sendo aplicado
**Solução**: Verifique se as variáveis CSS estão definidas no `host/src/styles/global.css`

## Suporte

Consulte:
- `README.md` - Visão geral
- `SETUP.md` - Guia detalhado
- Comentários no código
- [Module Federation Docs](https://webpack.js.org/concepts/module-federation/)

---

**Desenvolvido para o Hackathon FIAP 2026** 🧠✨
