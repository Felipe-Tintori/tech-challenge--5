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
npm test
```

## 🎨 Funcionalidades

### 1. Painel Cognitivo Personalizável
- Ajuste de nível de complexidade da interface
- Modo de foco (esconde distrações)
- Modo resumo / modo detalhado
- Contraste, espaçamento e tamanho de fonte ajustáveis
- Alertas cognitivos personalizados

### 2. Organizador de Tarefas com Suporte Cognitivo
- Etapas visuais (Kanban simplificado)
- Timers com controle de foco (Pomodoro adaptado)
- Checklist inteligente
- Avisos de transição suave entre atividades

### 3. Perfil do Usuário + Configurações Persistentes
- Modo de foco personalizado
- Intensidade de contraste e espaçamento
- Perfil de navegação
- Necessidades específicas
- Rotinas de estudo ou trabalho

## ♿ Acessibilidade Cognitiva

O projeto implementa recursos específicos para acessibilidade cognitiva:

- ✅ Níveis ajustáveis de complexidade
- ✅ Componentes de foco
- ✅ Ritmos guiados na interface
- ✅ Redução de estímulos visuais
- ✅ Animações controláveis
- ✅ Navegação previsível e consistente
- ✅ Textos adaptados e simplificados

## 🛠️ Tecnologias

- **React 18** com TypeScript
- **Webpack 5** com Module Federation
- **Clean Architecture**
- **CSS Modules / Styled Components**
- **React Router** para navegação
- **Zustand / Context API** para gerenciamento de estado
- **Jest + React Testing Library** para testes
- **ESLint + Prettier** para qualidade de código

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
