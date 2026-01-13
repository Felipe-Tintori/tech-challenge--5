# 🏗️ Arquitetura MindEase Web

## Visão Geral - Module Federation

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER                                  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              HOST APP (localhost:3000)                      │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │ React Router + Context Providers                      │  │ │
│  │  │ - ThemeContext                                        │  │ │
│  │  │ - AccessibilityContext                                │  │ │
│  │  │ - AuthContext                                         │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                                                             │ │
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  │ │
│  │  │   Route /     │  │ Route /painel │  │ Route /tarefas│  │ │
│  │  │   HomePage    │  │ Lazy Load     │  │ Lazy Load     │  │ │
│  │  └───────────────┘  └───────────────┘  └───────────────┘  │ │
│  │                           ↓                     ↓           │ │
│  └───────────────────────────┼─────────────────────┼──────────┘ │
│                              │                     │             │
│         ┌────────────────────┴──────┬──────────────┴───────┐    │
│         ↓                           ↓                      ↓    │
│  ┌─────────────┐            ┌─────────────┐        ┌──────────┐│
│  │  PAINEL     │            │ ORGANIZADOR │        │ PERFIL   ││
│  │  COGNITIVO  │            │  TAREFAS    │        │ USUARIO  ││
│  │ :3001       │            │ :3002       │        │ :3003    ││
│  │             │            │             │        │          ││
│  │ Exposes:    │            │ Exposes:    │        │ Exposes: ││
│  │ ./App       │            │ ./App       │        │ ./App    ││
│  └─────────────┘            └─────────────┘        └──────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## Clean Architecture - Painel Cognitivo

```
┌─────────────────────────────────────────────────────────────────┐
│                    PAINEL COGNITIVO                              │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   PRESENTATION LAYER                        │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │ │
│  │  │ DashboardPage│  │ ThemeControl │  │FontSizeControl│    │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │ │
│  │         │                  │                  │             │ │
│  └─────────┼──────────────────┼──────────────────┼────────────┘ │
│            ↓                  ↓                  ↓               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                APPLICATION LAYER                         │   │
│  │  ┌──────────────────────┐  ┌──────────────────────────┐ │   │
│  │  │GetUserPreferencesUC  │  │UpdateUserPreferencesUC   │ │   │
│  │  └──────────────────────┘  └──────────────────────────┘ │   │
│  │            │                          │                  │   │
│  └────────────┼──────────────────────────┼─────────────────┘   │
│               ↓                          ↓                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              DOMAIN LAYER (Business Logic)                │  │
│  │  ┌──────────────────────────────────────────────────────┐│  │
│  │  │           UserPreferences (Entity)                    ││  │
│  │  │  - theme: ThemeMode                                   ││  │
│  │  │  - fontSize: FontSize                                 ││  │
│  │  │  - spacing: SpacingMode                               ││  │
│  │  │  - focusMode: boolean                                 ││  │
│  │  │  - complexityLevel: ComplexityLevel                   ││  │
│  │  └──────────────────────────────────────────────────────┘│  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────────┐│  │
│  │  │      IPreferencesRepository (Interface)               ││  │
│  │  │  + getPreferences(): Promise<UserPreferences>         ││  │
│  │  │  + savePreferences(prefs): Promise<void>              ││  │
│  │  └──────────────────────────────────────────────────────┘│  │
│  └─────────────────────────────┬────────────────────────────┘  │
│                                ↓                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           INFRASTRUCTURE LAYER                            │  │
│  │  ┌──────────────────────────────────────────────────────┐│  │
│  │  │   LocalStoragePreferencesRepository                   ││  │
│  │  │   implements IPreferencesRepository                   ││  │
│  │  │                                                        ││  │
│  │  │   + getPreferences() → localStorage.getItem()         ││  │
│  │  │   + savePreferences() → localStorage.setItem()        ││  │
│  │  └──────────────────────────────────────────────────────┘│  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Fluxo de Dados - Use Case

```
┌────────────────────────────────────────────────────────────────────┐
│  USER ACTION: Clica em "Modo Escuro"                               │
└───────────────────────────┬────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────────────┐
│  PRESENTATION: ThemeControl.tsx                                     │
│  const handleThemeChange = async (newTheme) => {                   │
│    setTheme(newTheme);                                             │
│    await updatePreferencesUseCase.execute({ theme: newTheme });    │
│  }                                                                  │
└───────────────────────────┬────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────────────┐
│  APPLICATION: UpdateUserPreferencesUseCase                          │
│  async execute(preferences: Partial<UserPreferences>) {            │
│    const current = await repository.getPreferences();              │
│    const updated = { ...current, ...preferences };                 │
│    await repository.savePreferences(updated);                      │
│  }                                                                  │
└───────────────────────────┬────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────────────┐
│  DOMAIN: UserPreferences (Entity)                                   │
│  {                                                                  │
│    theme: 'dark',                                                   │
│    fontSize: 'medium',                                              │
│    spacing: 'normal',                                               │
│    ...                                                              │
│  }                                                                  │
└───────────────────────────┬────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────────────┐
│  INFRASTRUCTURE: LocalStoragePreferencesRepository                  │
│  async savePreferences(preferences: UserPreferences) {             │
│    localStorage.setItem('mindease_preferences',                    │
│      JSON.stringify(preferences));                                 │
│  }                                                                  │
└───────────────────────────┬────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────────────┐
│  BROWSER: LocalStorage                                              │
│  mindease_preferences: {                                            │
│    "theme": "dark",                                                 │
│    "fontSize": "medium",                                            │
│    ...                                                              │
│  }                                                                  │
└────────────────────────────────────────────────────────────────────┘
```

## Contextos Globais (Host)

```
┌─────────────────────────────────────────────────────────────────┐
│                      APP COMPONENT                               │
│  <ErrorBoundary>                                                 │
│    <BrowserRouter>                                               │
│      <AuthProvider>              ← Autenticação                  │
│        <ThemeProvider>           ← Tema, Fonte, Espaçamento      │
│          <AccessibilityProvider> ← Foco, Complexidade, Alertas   │
│            <AppRouter>           ← Rotas + Module Federation     │
│              {children}                                           │
│            </AppRouter>                                           │
│          </AccessibilityProvider>                                 │
│        </ThemeProvider>                                           │
│      </AuthProvider>                                              │
│    </BrowserRouter>                                               │
│  </ErrorBoundary>                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## CSS Variables & Acessibilidade

```css
/* Base Variables */
:root {
  --color-primary-500: #6366f1;
  --font-size-base: 1rem;
  --spacing-4: 1rem;
}

/* Theme Variations */
[data-theme="dark"] {
  --color-background: #0f172a;
  --color-text-primary: #f8fafc;
}

[data-theme="high-contrast"] {
  --color-background: #000000;
  --color-text-primary: #ffffff;
  --color-primary-500: #ffff00;
}

/* Font Size Variations */
[data-font-size="large"] {
  --font-size-base: 1.125rem;
}

[data-font-size="extra-large"] {
  --font-size-base: 1.25rem;
}

/* Spacing Variations */
[data-spacing="comfortable"] {
  --spacing-4: 1.5rem;
}

[data-spacing="spacious"] {
  --spacing-4: 2rem;
}
```

## Dependências Compartilhadas

```
HOST (localhost:3000)
  ├── React 18.2.0 (singleton, eager)
  ├── React-DOM 18.2.0 (singleton, eager)
  └── React-Router-DOM 6.21.0 (singleton)
       ↓ SHARED
       ↓
  ┌────┴────┬────────┬───────────┐
  ↓         ↓        ↓           ↓
PAINEL  TAREFAS  PERFIL     OUTROS
:3001    :3002    :3003      REMOTES

(Todas as dependências React são compartilhadas como singleton)
```

## Estratégia de Deploy

```
┌─────────────────────────────────────────────────────────────────┐
│                       PRODUCTION                                 │
│                                                                  │
│  CDN/Storage (ex: AWS S3, Netlify, Vercel)                      │
│  ├── /mindease/                                                 │
│  │   ├── index.html                    (Host Entry Point)       │
│  │   ├── host.bundle.js                                         │
│  │   ├── painel-cognitivo/                                      │
│  │   │   └── remoteEntry.js                                     │
│  │   ├── organizador-tarefas/                                   │
│  │   │   └── remoteEntry.js                                     │
│  │   └── perfil-usuario/                                        │
│  │       └── remoteEntry.js                                     │
│  │                                                               │
│  │   Cada microfrontend pode ser deployado INDEPENDENTEMENTE    │
│  │   sem rebuild dos outros!                                    │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Benefícios da Arquitetura

### Module Federation
- ✅ Deploy independente de cada microfrontend
- ✅ Desenvolvimento paralelo entre times
- ✅ Compartilhamento de dependências (React singleton)
- ✅ Lazy loading automático
- ✅ Versionamento independente

### Clean Architecture
- ✅ Lógica de negócio isolada (Domain)
- ✅ Casos de uso testáveis (Application)
- ✅ Troca fácil de infraestrutura (LocalStorage → API)
- ✅ Manutenibilidade e escalabilidade
- ✅ Dependências apontam para dentro

### Acessibilidade Cognitiva
- ✅ Customização completa da UI
- ✅ Modo foco para reduzir distrações
- ✅ Níveis de complexidade ajustáveis
- ✅ Suporte a leitores de tela
- ✅ Navegação por teclado
- ✅ Preferências persistentes

---

**Arquitetura projetada para o Hackathon FIAP 2026** 🧠✨
