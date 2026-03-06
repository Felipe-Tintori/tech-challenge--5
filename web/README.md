# MindEase Web — Plataforma de Acessibilidade Cognitiva

> Projeto desenvolvido para o Hackathon FIAP Inclusive — Tema: Acessibilidade Cognitiva

## 🧠 Sobre o Projeto

MindEase é uma plataforma web desenvolvida para facilitar a vida acadêmica e profissional de pessoas neurodivergentes e/ou com desafios de processamento cognitivo, incluindo:

- TDAH
- TEA (Autismo)
- Dislexia
- Burnout e sobrecarga mental
- Dificuldades de foco e retenção
- Ansiedade em ambientes digitais
- Sobrecarga sensorial

---

## 🏗️ Arquitetura

O projeto utiliza **Module Federation** (Webpack 5) para implementar uma arquitetura de microfrontends, com **Clean Architecture** em cada módulo.

### Estrutura de Microfrontends

```
web/
├── packages/
│   ├── host/                    # Shell app: roteamento, auth, contextos globais  (porta 3000)
│   ├── painel-cognitivo/        # Dashboard de preferências cognitivas            (porta 3001)
│   ├── organizador-tarefas/     # Kanban + Pomodoro                               (porta 3002)
│   ├── perfil-usuario/          # Perfil e configurações persistentes             (porta 3003)
│   └── shared/                  # Tipos, serviços Firebase e utilitários comuns
```

### Clean Architecture (aplicada nos 3 microfrontends)

```
src/
├── domain/           # Entidades e interfaces de repositório
├── application/      # Casos de uso independentes de UI
├── infrastructure/   # Repositórios (Firestore + LocalStorage como fallback)
└── presentation/     # Componentes React, páginas e estilos
```

---

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0

### Instalação

```bash
# Na pasta web/, instala todas as dependências de todos os pacotes
npm install
```

### Configuração do Firebase

A aplicação utiliza **Firebase Authentication** e **Firebase Firestore** para autenticação e persistência de dados.

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Habilite **Authentication** (provider: Email/Senha) e **Firestore Database**
3. Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp packages/host/.env.example packages/host/.env
```

Conteúdo do `.env`:

```env
FIREBASE_API_KEY=sua_api_key
FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
FIREBASE_PROJECT_ID=seu_projeto
FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
FIREBASE_APP_ID=seu_app_id
```

> **Segurança:** o arquivo `.env` está no `.gitignore`. Nunca commite credenciais reais.

### Desenvolvimento

```bash
# Executar todos os microfrontends simultaneamente
npm run dev

# Ou executar individualmente
npm run dev:host          # http://localhost:3000
npm run dev:painel        # http://localhost:3001
npm run dev:tarefas       # http://localhost:3002
npm run dev:perfil        # http://localhost:3003
```

### Build para Produção

```bash
npm run build
```

### Testes

```bash
# Rodar todos os testes com cobertura
npm test -- --coverage

# Rodar testes em modo watch
npm run test:watch

# Rodar testes para CI (sem interatividade)
npm run test:ci
```

---

## ✅ Status do Projeto

### Implementado

| Funcionalidade | Status |
|---|---|
| Firebase Authentication (login / cadastro / logout) | ✅ Completo |
| Firebase Firestore (persistência de todas as preferências) | ✅ Completo |
| Rotas protegidas com `onAuthStateChanged` | ✅ Completo |
| Painel Cognitivo com 5 controles de acessibilidade | ✅ Completo |
| Organizador de Tarefas — Kanban com drag-and-drop | ✅ Completo |
| Timer Pomodoro adaptado (25/5/15 min + alertas cognitivos) | ✅ Completo |
| Perfil do Usuário com formulário completo e persistência | ✅ Completo |
| Clean Architecture nos 3 microfrontends | ✅ Completo |
| Module Federation com 4 aplicações | ✅ Completo |
| Temas: Claro, Escuro e Alto Contraste | ✅ Completo |
| Tamanho de fonte ajustável (4 níveis) | ✅ Completo |
| Espaçamento ajustável (4 níveis) | ✅ Completo |
| Modo de Foco (oculta Sidebar e distrações) | ✅ Completo |
| Nível de Complexidade da interface (4 níveis) | ✅ Completo |
| ARIA roles completos (role=main, switch, alert, tab, navigation…) | ✅ Completo |
| Testes unitários — 11 suites, Jest + React Testing Library | ✅ Completo |
| CI/CD — GitHub Actions (test → build → deploy) | ✅ Completo |
| Credenciais via variáveis de ambiente (dotenv-webpack) | ✅ Completo |
| GitHub Secrets configurados para CI/CD | ✅ Completo |

### Não implementado / fora de escopo

| Item | Observação |
|---|---|
| E2E Tests (Cypress/Playwright) | Fora de escopo do hackathon |
| Upload de avatar no perfil | Campo no domínio, sem UI de upload |
| `CognitiveMetricsCard` com dados reais | Exibe dados mockados (Pomodoro não persiste métricas ainda) |

---

## 🎨 Funcionalidades

### 1 — Painel Cognitivo Personalizável

- ✅ **Tema visual** — Claro / Escuro / Alto Contraste (persiste no Firestore, aplica `data-theme` no DOM)
- ✅ **Tamanho de fonte** — slider de 4 níveis: Pequeno, Médio, Grande, Extra Grande
- ✅ **Espaçamento** — 4 opções: Compacto, Normal, Confortável, Espaçoso
- ✅ **Modo de Foco** — toggle `role="switch"`, remove Sidebar e elementos distratores
- ✅ **Nível de Complexidade** — Minimal / Simples / Padrão / Detalhado (aplica `data-complexity` no DOM)
- ✅ **Métricas cognitivas** — card de insights (tempo de foco, tarefas, produtividade)

### 2 — Organizador de Tarefas com Suporte Cognitivo

- ✅ **Kanban Board** — 3 colunas (A Fazer / Em Progresso / Concluído), drag-and-drop nativo
- ✅ **CRUD de tarefas** — modal com título, descrição, prioridade (baixa/média/alta), tempo estimado e tags
- ✅ **Timer Pomodoro adaptado** — 25 min trabalho → 5 min pausa → 15 min pausa longa (a cada 4 ciclos)
- ✅ **Estatísticas de foco** — sessões completadas, tempo total, ciclos
- ✅ **Alerta cognitivo** — aviso automático após 90 min contínuos de foco
- ✅ **Notificações do navegador** — alerta ao fim de cada ciclo (solicita permissão)
- ✅ **Persistência** — Firestore (com fallback em LocalStorage)

### 3 — Perfil do Usuário + Configurações Persistentes

- ✅ **Informações pessoais** — nome, e-mail, bio
- ✅ **Neurodivergências** — checkboxes: TDAH, TEA (Autismo), Dislexia, Ansiedade, Outro
- ✅ **Necessidades específicas** — tags de texto livre (adicionar / remover)
- ✅ **Rotina de estudos** — seleção de dias da semana + horário de início e fim
- ✅ **Persistência no Firestore** — carrega ao montar, salva ao submeter

---

## ♿ Acessibilidade Cognitiva

| Recurso | Implementação |
|---|---|
| Níveis ajustáveis de complexidade | `data-complexity` attribute no `<html>`, 4 opções |
| Modo de foco | `data-focus-mode` attribute, `role="switch"`, Sidebar ocultada |
| Contraste ajustável | `data-theme="high-contrast"` com variáveis CSS dedicadas |
| Tamanho de fonte | `data-font-size` attribute + CSS custom properties |
| Espaçamento ajustável | `data-spacing` attribute + CSS custom properties |
| Animações controláveis | `animationsEnabled` no `ThemeContext`, respeita `prefers-reduced-motion` |
| Ritmos guiados | Timer Pomodoro com progressão visual e alertas sonoros/visuais |
| Alertas cognitivos | Aviso após 90 min de foco contínuo |
| Navegação por teclado | `aria-current="page"` no Sidebar, hint de atalhos de teclado |
| Leitores de tela | `role=main`, `role=navigation`, `role=banner`, `role=alert`, `aria-label`, `aria-pressed` |
| `announceToScreenReader` | Método no `AccessibilityContext` para anúncios dinâmicos via live region |

---

## 🔐 Autenticação e Segurança

- **Firebase Authentication** com e-mail e senha
- Credenciais carregadas via **variáveis de ambiente** (`dotenv-webpack`) — nunca expostas no código
- **Rotas protegidas** — `ProtectedRoute` redireciona para `/login` se não autenticado
- **`onAuthStateChanged`** listener — carrega dados do Firestore ao restaurar sessão
- Dados do usuário persistidos em `users/{uid}`, preferências em `user_preferences/{uid}` e `accessibility_preferences/{uid}`

---

## 🧪 Testes

O pacote `host` possui cobertura abrangente com **11 suites de teste**:

| Arquivo de Teste | O que testa |
|---|---|
| `AuthContext.test.tsx` | login, logout, register, loading state |
| `components.test.tsx` | LoadingFallback, ErrorBoundary, Header, Sidebar, Layout |
| `pages.test.tsx` | LoginPage (formulário, validação, erros Firebase) e HomePage |
| `routes.test.tsx` | ProtectedRoute, redirecionamento, lazy-loading de microfrontends |
| `contexts.test.tsx` | ThemeContext, AccessibilityContext |
| `storage.test.ts` | Firestore-backed storage (get, set, remove) |
| `utils.test.ts` | Funções utilitárias gerais |
| `formatters.test.ts` | `formatDate`, `formatTime`, `truncate`, `capitalize` |
| `validation.test.ts` | `isEmail`, `isStrongPassword`, `isEmpty`, `isValidName` |
| `constants.test.ts` | Constantes da aplicação |
| `infrastructure.test.ts` | Camada de infraestrutura |

```bash
# Rodar com cobertura
cd packages/host
npm test -- --coverage
```

Os microfrontends (`painel-cognitivo`, `organizador-tarefas`, `perfil-usuario`) possuem testes de domínio e casos de uso em `src/domain/**/__tests__` e `src/application/**/__tests__`.

---

## 🔄 CI/CD

Pipeline configurado no GitHub Actions (`.github/workflows/`):

### `ci.yml`
- **Trigger**: push e pull request na branch `main`
- **Jobs**:
  - `test` — matriz Node 18 + 20, instala dependências, roda `npm test -- --coverage`
  - `build` — gera build de produção após testes passarem
  - `deploy` — deploy automático no **GitHub Pages** (somente branch `main`)
- Credenciais Firebase injetadas via **GitHub Secrets** (`FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID`)

### `quality-check.yml`
- Análise de qualidade de código e lint

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| React 18 + TypeScript 5 | Framework web |
| Webpack 5 + Module Federation | Arquitetura de microfrontends |
| Firebase Authentication | Login / cadastro / sessão |
| Firebase Firestore | Persistência de dados em nuvem |
| dotenv-webpack | Variáveis de ambiente seguras |
| React Router 6 | Roteamento SPA |
| Context API | Estado global (Auth, Theme, Accessibility) |
| Jest + React Testing Library | Testes unitários e de integração |
| GitHub Actions | CI/CD automatizado |
| CSS3 + Custom Properties | Temas e acessibilidade visual |
| HTML5 Drag & Drop API | Kanban |
| Notification API | Alertas do Pomodoro |

---

## 📦 Estrutura Detalhada

### `host` — Shell App
Orquestrador principal: carrega microfrontends via `React.lazy`, gerencia autenticação, aplica contextos globais de tema e acessibilidade, e define as rotas protegidas.

### `painel-cognitivo` — Dashboard
Controles de personalização visual e cognitiva. Cada controle é um componente isolado que lê/escreve no Firestore via `FirestorePreferencesRepository` e reflete mudanças imediatamente no DOM via `data-*` attributes.

### `organizador-tarefas` — Kanban + Pomodoro
Gerenciamento de tarefas com suporte cognitivo. `FirestoreTaskRepository` para persistência por usuário. `PomodoroTimer` com controle completo de sessões e integração com alertas cognitivos.

### `perfil-usuario` — Perfil
Formulário completo de perfil com suporte a neurodivergências, necessidades específicas e rotinas. Persiste em `user_profiles/{uid}` no Firestore.

### `shared` — Biblioteca Compartilhada
`FirestoreService` genérico, tipos de domínio compartilhados (`domain.ts`, `infrastructure.ts`, `ui.ts`) e configuração comum do Firebase.

---

## 🤝 Equipe

Projeto desenvolvido como parte do Hackathon da Pós-Graduação FIAP — Tema: Acessibilidade Cognitiva.

## 📄 Licença

Este projeto é parte do Hackathon FIAP Inclusive.
