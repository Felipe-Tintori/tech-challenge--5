# MindEase Mobile — Acessibilidade Cognitiva

> Versão mobile do [MindEase Web](../web/README.md), desenvolvida com React Native + Expo para o Hackathon FIAP Inclusive.

## 🧠 Sobre

MindEase Mobile é o aplicativo móvel da plataforma de acessibilidade cognitiva MindEase. Compartilha o mesmo Firebase (Auth + Firestore) que a versão web, mantendo todas as preferências do usuário sincronizadas entre dispositivos.

**Público-alvo:** usuários com TDAH, TEA (Autismo), Dislexia, Ansiedade, Burnout e outras características neurodivergentes.

---

## 🏗️ Arquitetura

Mesma **Clean Architecture** da versão web, porém como aplicação única (sem microfrontends):

```
mobile/
├── App.tsx                        # Entrada: providers globais
├── app.config.js                  # Configuração Expo + variáveis de ambiente
└── src/
    ├── config/firebase.ts         # Inicialização do Firebase via expo-constants
    ├── contexts/
    │   ├── AuthContext.tsx        # Firebase Auth
    │   ├── ThemeContext.tsx       # Tema, fonte, espaçamento + Firestore
    │   └── AccessibilityContext.tsx # Foco, complexidade, alertas + Firestore
    ├── navigation/
    │   ├── AppNavigator.tsx       # Stack raiz (Login | Main)
    │   └── MainNavigator.tsx      # Bottom Tabs (Painel / Tarefas / Perfil)
    ├── screens/
    │   ├── auth/LoginScreen.tsx   # Login e cadastro
    │   ├── painel/PainelCognitivoScreen.tsx
    │   ├── tarefas/TarefasScreen.tsx
    │   └── perfil/PerfilScreen.tsx
    ├── domain/
    │   ├── entities/              # Task, UserProfile, UserPreferences
    │   └── repositories/         # ITaskRepository, IPreferencesRepository, IUserProfileRepository
    ├── application/
    │   └── useCases/              # TaskUseCases, PreferencesUseCases, ProfileUseCases
    ├── infrastructure/
    │   └── repositories/          # FirestoreTaskRepository, FirestorePreferencesRepository, FirestoreUserProfileRepository
    └── components/
        └── LoadingScreen.tsx
```

---

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js >= 18
- Expo CLI: `npm install -g expo-cli`
- Expo Go no celular ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Instalação

```bash
cd mobile
npm install
```

### Configuração do Firebase

Crie o arquivo `.env` na pasta `mobile/` com as mesmas credenciais da versão web:

```bash
cp .env.example .env
```

```env
FIREBASE_API_KEY=sua_api_key
FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
FIREBASE_PROJECT_ID=seu_projeto
FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
FIREBASE_APP_ID=seu_app_id
```

> As credenciais são lidas via `app.config.js` → `expo-constants` — nunca expostas no bundle.

### Executar

```bash
# Inicia o servidor Expo (QR code para Expo Go)
npm start

# Diretamente no Android ou iOS
npm run android
npm run ios
```

---

## 📱 Telas

### 🔐 Login / Cadastro
- Formulário dual: login e cadastro na mesma tela
- Firebase Authentication com tratamento de erros em PT-BR
- Validação client-side (campos obrigatórios, nome no cadastro)
- `KeyboardAvoidingView` para não cobrir inputs no mobile

### 🧠 Painel Cognitivo
- **Tema**: Claro / Escuro / Alto Contraste — persiste no Firestore
- **Tamanho de fonte**: 4 níveis — propaga para toda a app via `ThemeContext`
- **Espaçamento**: 4 níveis — altera paddings/gaps
- **Modo de Foco**: `Switch` nativo com `role="switch"` — persiste no Firestore
- **Alertas Cognitivos**: toggle para ativar/desativar aviso de 90 min
- **Animações**: toggle para reduzir estímulos visuais
- **Nível de Complexidade**: 4 opções (Minimal / Simples / Padrão / Detalhado)
- Botão de logout com confirmação via `Alert`

### ✅ Organizador de Tarefas
**Kanban adaptado para mobile:**
- Abas horizontais para alternar entre colunas (A Fazer / Em Progresso / Concluído)
- Botões "Iniciar →" e "Concluir ✓" para mover tarefas entre colunas
- Toque longo em card abre modal de edição
- Botão de excluir com confirmação

**Pomodoro Timer:**
- Modos: Foco (25 min), Pausa Curta (5 min), Pausa Longa (15 min)
- Auto-chaveamento a cada 4 sessões de trabalho
- Vibração nativa ao fim de cada ciclo (`Vibration API`)
- Alerta cognitivo após 90 min contínuos de foco
- Estatísticas: sessões, tempo total de foco, ciclo atual

**Modal de tarefa:**
- Título, descrição, prioridade (3 opções), tempo estimado, tags

### 👤 Perfil do Usuário
- Avatar automático com inicial do nome
- Informações pessoais (nome, bio)
- Checkboxes de neurodivergência (TDAH, TEA, Dislexia, Ansiedade, Outro)
- Tags de necessidades específicas (add/remove)
- Rotina de estudos: seletor de dias (Seg–Dom) + horários
- Persistência completa no Firestore (`user_profiles/{uid}`)

---

## ♿ Acessibilidade Mobile

| Recurso | Implementação |
|---|---|
| `accessibilityRole` | Button, checkbox, switch, radio, progressbar em todos os controles |
| `accessibilityLabel` | Descrições em todos os inputs e botões interativos |
| `accessibilityState` | `{ checked, selected, disabled }` conforme o estado |
| `accessibilityHint` | Instruções de uso onde necessário |
| Modo de Foco | Remove elementos secundários e reduz densidade visual |
| Tamanho de fonte dinâmico | Propaga via `fontSizeValue` do `ThemeContext` para todos os textos |
| Espaçamento dinâmico | `spacingValue` propaga para paddings e gaps |
| Alto contraste | Paleta de cores dedicada com amarelo sobre preto |
| Vibração | Feedback háptico ao fim de ciclos Pomodoro |
| Alertas cognitivos | `Alert.alert` nativo após 90 min contínuos de foco |

---

## 🔄 Sincronização com a Web

Como ambas usam o mesmo projeto Firebase:

| Dado | Coleção Firestore |
|---|---|
| Dados do usuário | `users/{uid}` |
| Preferências de tema | `theme_preferences/{uid}` |
| Preferências de acessibilidade | `accessibility_preferences/{uid}` |
| Tarefas | `tasks` (filtradas por `userId`) |
| Perfil | `user_profiles/{uid}` |

Preferências alteradas na versão web aparecem no mobile ao entrar no app, e vice-versa.

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| React Native 0.74 + Expo 51 | Framework mobile |
| TypeScript 5 | Tipagem estática |
| React Navigation 6 | Stack + Bottom Tabs |
| Firebase JS SDK 10 | Auth + Firestore (sem native modules) |
| expo-constants | Leitura segura de variáveis de ambiente |
| react-native-safe-area-context | Suporte a notch e barras |
| react-native-gesture-handler | Gestos nativos |
| @expo/vector-icons (Ionicons) | Ícones da tab bar |
| Vibration API | Feedback háptico |
| Clean Architecture | Domain / Application / Infrastructure / Presentation |

---

## 📄 Licença

Projeto desenvolvido para o Hackathon FIAP Inclusive — Tema: Acessibilidade Cognitiva.
