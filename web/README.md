# MindEase Web - Plataforma de Acessibilidade Cognitiva

## 🧠 Sobre o Projeto

MindEase é uma plataforma desenvolvida para facilitar a vida acadêmica e profissional de pessoas neurodivergentes e/ou com desafios de processamento cognitivo, incluindo:

- TDAH
- TEA (Autismo)
- Dislexia
- Burnout e sobrecarga mental
- Dificuldades de foco e retenção
- Ansiedade em ambientes digitais
- Sobrecarga sensorial

## 🏗️ Arquitetura

O projeto utiliza **Module Federation** (Webpack 5) para implementar uma arquitetura de microfrontends, com **Clean Architecture** em cada módulo.

### Estrutura de Microfrontends

```
mindease-web/
├── packages/
│   ├── host/                    # App principal (orquestrador)
│   ├── painel-cognitivo/        # Dashboard personalizável
│   ├── organizador-tarefas/     # Sistema de tarefas com Kanban/Pomodoro
│   ├── perfil-usuario/          # Perfil e configurações
│   └── shared/                  # Componentes e utilitários compartilhados
```

### Clean Architecture

Cada microfrontend segue a estrutura:

```
src/
├── domain/           # Entidades e regras de negócio
├── application/      # Casos de uso
├── infrastructure/   # Adaptadores (API, Storage, etc)
├── presentation/     # Componentes React e UI
└── shared/          # Tipos e utilitários
```

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0

### Instalação

```bash
# Instalar todas as dependências
npm install

# Ou instalar em cada pacote separadamente
npm run install:all
```

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
# Rodar todos os testes
npm test

# Rodar testes em modo watch
npm run test:watch

# Rodar testes para CI
npm run test:ci
```

## ✅ Status do Projeto

### Implementado
- ✅ **Painel Cognitivo**: 100% completo com 6 controles de acessibilidade
- ✅ **Organizador de Tarefas**: 100% completo com Kanban + Pomodoro
- ✅ **Perfil do Usuário**: 100% completo com formulário e persistência
- ✅ **Clean Architecture**: Implementada nos 3 microfrontends
- ✅ **Module Federation**: Funcionando com 4 aplicações
- ✅ **Temas**: Claro, Escuro e Alto Contraste totalmente funcionais
- ✅ **Persistência**: LocalStorage em todos os módulos
- ✅ **Testes Unitários**: Jest + React Testing Library (Entities, Use Cases, Contexts)
- ✅ **CI/CD**: GitHub Actions com testes automáticos e deploy
- ✅ **Cobertura de Código**: Threshold de 70% configurado
- ✅ **Testado manualmente**: Todas as funcionalidades validadas

### Não Implementado
- ❌ **Backend API**: Projeto usa apenas LocalStorage
- ❌ **Docker**: Containerização não configurada
- ❌ **E2E Tests**: Testes end-to-end (Cypress/Playwright)

## 🎨 Funcionalidades

### 1. Painel Cognitivo Personalizável ✅
- ✅ Ajuste de tema (Claro, Escuro, Alto Contraste)
- ✅ Tamanho de fonte ajustável (Pequeno, Médio, Grande, Extra Grande)
- ✅ Espaçamento ajustável (Compacto, Normal, Confortável, Espaçoso)
- ✅ Modo de foco (reduz distrações)
- ✅ Nível de complexidade da interface (4 níveis)
- ✅ Métricas cognitivas e insights personalizados
- ✅ Persistência de preferências no LocalStorage

### 2. Organizador de Tarefas com Suporte Cognitivo ✅
- ✅ Kanban Board com drag & drop (A Fazer, Em Progresso, Concluído)
- ✅ Timer Pomodoro adaptado (25min trabalho, 5min pausa, 15min pausa longa)
- ✅ CRUD completo de tarefas (criar, editar, deletar)
- ✅ Sistema de prioridades (baixa, média, alta)
- ✅ Tags personalizadas para organização
- ✅ Tempo estimado vs tempo real
- ✅ Alertas cognitivos (aviso após 90min de foco contínuo)
- ✅ Notificações do navegador para finalizações de ciclos

### 3. Perfil do Usuário + Configurações Persistentes ✅
- ✅ Informações pessoais (nome, email, bio)
- ✅ Seleção de neurodivergências (TDAH, TEA, Dislexia, Ansiedade)
- ✅ Tags de necessidades específicas
- ✅ Rotina de estudos (dias da semana + horários de início e fim)
- ✅ Rotina de trabalho (dias da semana + horários de início e fim)
- ✅ Persistência completa no LocalStorage
- ✅ Validação de formulários

## ♿ Acessibilidade Cognitiva

O projeto implementa recursos específicos para acessibilidade cognitiva:

- ✅ **6 Controles de Acessibilidade** implementados com Clean Architecture
- ✅ **Níveis ajustáveis de complexidade** (Mínimo, Baixo, Padrão, Detalhado)
- ✅ **3 Temas visuais** (Claro, Escuro, Alto Contraste) com suporte completo
- ✅ **4 Tamanhos de fonte** para melhor legibilidade
- ✅ **4 Níveis de espaçamento** para reduzir sobrecarga visual
- ✅ **Modo foco** que remove elementos distrativos
- ✅ **Ritmos guiados** com Timer Pomodoro e alertas cognitivos
- ✅ **Persistência de preferências** entre sessões
- ✅ **Navegação por teclado** e suporte a leitores de tela
- ✅ **Notificações acessíveis** do navegador
- ✅ **Drag & Drop intuitivo** para organização de tarefas

## 🛠️ Tecnologias

- **React 18.3.1** com TypeScript 5.x
- **Webpack 5** com Module Federation
- **Clean Architecture** (Domain, Application, Infrastructure, Presentation)
- **CSS3** com variáveis CSS para temas
- **React Router 6** para navegação
- **Context API** para gerenciamento de estado global
- **LocalStorage** para persistência de dados
- **HTML5 Drag & Drop API** para Kanban
- **Notification API** para alertas do navegador
- **ESLint + Prettier** para qualidade de código

## 🏗️ Arquitetura Técnica

### Module Federation
Cada microfrontend roda em sua própria porta e é carregado dinamicamente pelo host:
- **Host**: localhost:3000 (orquestrador)
- **Painel Cognitivo**: localhost:3001
- **Organizador de Tarefas**: localhost:3002  
- **Perfil do Usuário**: localhost:3003

### Clean Architecture
Todos os 3 microfrontends seguem Clean Architecture:
- **Domain**: Entidades de negócio (Task, UserProfile, UserPreferences)
- **Application**: Casos de uso (CreateTask, UpdateProfile, SavePreferences)
- **Infrastructure**: Repositórios (LocalStorage)
- **Presentation**: Componentes React e páginas

## 📦 Estrutura de Pacotes

### Host App
Orquestrador principal que carrega os microfrontends dinamicamente.

### Painel Cognitivo
Dashboard com controles de personalização e acessibilidade.

### Organizador de Tarefas
Sistema completo de gerenciamento de tarefas com suporte cognitivo.

### Perfil do Usuário
Gerenciamento de perfil e persistência de configurações.

### Shared
Biblioteca compartilhada com componentes, hooks e utilitários reutilizáveis.

## 🤝 Contribuindo

Este projeto foi desenvolvido como parte do Hackathon da Pós-Graduação FIAP.

## 📄 Licença

Este projeto é parte do Hackathon FIAP Inclusive.
