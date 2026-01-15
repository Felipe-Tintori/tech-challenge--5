# MindEase - Documentação de Arquitetura

## 📋 Sumário
1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Estrutura de Pastas](#estrutura-de-pastas)
4. [Tecnologias Utilizadas](#tecnologias-utilizadas)
5. [Firebase & Firestore](#firebase--firestore)
6. [Autenticação](#autenticação)
7. [Gestão de Estado](#gestão-de-estado)
8. [Padrões de Código](#padrões-de-código)
9. [Fluxo de Dados](#fluxo-de-dados)
10. [Como Rodar o Projeto](#como-rodar-o-projeto)

---

## 🎯 Visão Geral

**MindEase** é uma plataforma de acessibilidade cognitiva desenvolvida com **Micro Frontend Architecture** usando **Module Federation**. O sistema é dividido em 4 aplicações independentes que se comunicam através de um host principal.

### Objetivos do Projeto
- Fornecer ferramentas de acessibilidade cognitiva
- Personalização completa da interface
- Gestão de tarefas com suporte cognitivo
- Perfil personalizado do usuário

---

## 🏗️ Arquitetura do Sistema

### **Module Federation Architecture**

```
┌─────────────────────────────────────────────────┐
│              HOST (localhost:3000)               │
│  - Roteamento principal                          │
│  - Autenticação (Firebase Auth)                  │
│  - Tema e Acessibilidade                         │
│  - Header & Layout                               │
└──────────────┬──────────────────────────────────┘
               │
       ┌───────┴───────┬───────────┬──────────┐
       │               │           │          │
       ▼               ▼           ▼          ▼
┌──────────────┐ ┌──────────┐ ┌─────────┐ ┌────────────┐
│   PAINEL     │ │ TAREFAS  │ │ PERFIL  │ │   SHARED   │
│ COGNITIVO    │ │          │ │         │ │            │
│ :3001        │ │ :3002    │ │ :3003   │ │ (library)  │
└──────────────┘ └──────────┘ └─────────┘ └────────────┘
```

### **Clean Architecture por Microfrontend**

Cada microfrontend segue **Clean Architecture**:

```
src/
├── domain/              # Entidades e contratos
│   ├── entities/        # Modelos de dados
│   └── repositories/    # Interfaces de repositórios
├── application/         # Casos de uso (Use Cases)
│   └── useCases/
├── infrastructure/      # Implementações técnicas
│   ├── config/          # Configuração Firebase
│   └── repositories/    # Repositórios Firebase
└── presentation/        # UI (React Components)
    └── components/
```

---

## 📁 Estrutura de Pastas

```
tech-challenge--5/
└── web/
    ├── packages/
    │   ├── host/                        # Host principal (3000)
    │   │   └── src/
    │   │       ├── components/          # Header, ErrorBoundary
    │   │       ├── contexts/            # Auth, Theme, Accessibility
    │   │       ├── pages/               # HomePage, LoginPage
    │   │       ├── routes/              # AppRouter
    │   │       ├── config/              # firebase.ts
    │   │       └── utils/               # storage.ts, constants.ts
    │   │
    │   ├── organizador-tarefas/         # Tarefas (3002)
    │   │   └── src/
    │   │       ├── domain/
    │   │       │   ├── entities/        # Task.ts
    │   │       │   └── repositories/    # ITaskRepository.ts
    │   │       ├── application/
    │   │       │   └── useCases/        # CreateTask, UpdateTask, etc
    │   │       ├── infrastructure/
    │   │       │   ├── config/          # firebase.ts
    │   │       │   └── repositories/    # FirestoreTaskRepository.ts
    │   │       └── presentation/
    │   │           └── components/      # KanbanBoard, TaskCard, TaskModal
    │   │
    │   ├── painel-cognitivo/            # Painel (3001)
    │   │   └── src/
    │   │       ├── domain/
    │   │       │   └── entities/        # Preferences.ts
    │   │       ├── application/
    │   │       │   └── useCases/        # GetUserPreferences, SavePreferences
    │   │       ├── infrastructure/
    │   │       │   ├── config/          # firebase.ts
    │   │       │   └── repositories/    # FirestorePreferencesRepository.ts
    │   │       └── presentation/
    │   │           └── components/      # Controls (Theme, Font, etc)
    │   │
    │   ├── perfil-usuario/              # Perfil (3003)
    │   │   └── src/
    │   │       ├── domain/
    │   │       │   ├── entities/        # UserProfile.ts
    │   │       │   └── repositories/    # IUserProfileRepository.ts
    │   │       ├── application/
    │   │       │   └── useCases/        # GetProfile, UpdateProfile
    │   │       ├── infrastructure/
    │   │       │   ├── config/          # firebase.ts
    │   │       │   └── repositories/    # FirestoreUserProfileRepository.ts
    │   │       └── presentation/
    │   │           └── components/      # ProfileForm
    │   │
    │   └── shared/                      # Biblioteca compartilhada
    │       └── src/
    │           ├── types/               # Tipos comuns
    │           └── config/              # Configurações compartilhadas
    │
    ├── ARCHITECTURE.md                  # Documentação de arquitetura
    ├── FIREBASE_INTEGRATION.md         # Guia de integração Firebase
    ├── FIREBASE_SETUP.md                # Setup do Firebase
    └── package.json                     # Scripts root
```

---

## 🔧 Tecnologias Utilizadas

### **Frontend**
- **React 18.2.0** - Biblioteca UI
- **TypeScript 5.3.3** - Tipagem estática
- **Webpack 5.104.1** - Module Bundler
- **Module Federation** - Micro Frontend Architecture

### **Backend/Database**
- **Firebase Authentication** - Autenticação de usuários
- **Firebase Firestore** - Banco de dados NoSQL em tempo real

### **Build & Dev**
- **ts-loader** - TypeScript loader para Webpack
- **webpack-dev-server** - Servidor de desenvolvimento
- **concurrently** - Executar múltiplos servidores simultaneamente

### **Testing**
- **Jest** - Test runner
- **@testing-library/react** - Testes de componentes

---

## 🔥 Firebase & Firestore

### **Configuração Firebase**

Cada microfrontend tem seu próprio arquivo `firebase.ts`:

```typescript
// packages/*/src/infrastructure/config/firebase.ts
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCVCz0ozmSkFIlesqxXV6C726ESPMiq7e8",
  authDomain: "techchallenger5.firebaseapp.com",
  projectId: "techchallenger5",
  storageBucket: "techchallenger5.firebasestorage.app",
  messagingSenderId: "625638043387",
  appId: "1:625638043387:web:00cfafc2c46c2e5efe4fb1"
};

let app: FirebaseApp | null = null;

export function initializeFirebase(): FirebaseApp {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  const firebaseApp = initializeFirebase();
  return getAuth(firebaseApp);
}

export function getFirestoreDb(): Firestore {
  const firebaseApp = initializeFirebase();
  return getFirestore(firebaseApp);
}
```

### **Estrutura do Firestore**

```
Firestore Database
├── users/                           # Dados dos usuários
│   └── {userId}
│       ├── name: string
│       ├── email: string
│       └── createdAt: timestamp
│
├── tasks/                           # Tarefas dos usuários
│   └── {taskId}
│       ├── userId: string           # ⚠️ IMPORTANTE: vincula ao usuário
│       ├── title: string
│       ├── description: string
│       ├── status: "todo"|"in-progress"|"done"
│       ├── priority: "low"|"medium"|"high"
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── user_preferences/                # Preferências do painel cognitivo
│   └── {userId}                     # ID do documento = userId
│       ├── theme: "light"|"dark"|"high-contrast"
│       ├── fontSize: "medium"|"large"|"extra-large"
│       ├── spacing: "normal"|"comfortable"|"spacious"
│       ├── animationsEnabled: boolean
│       ├── focusMode: boolean
│       ├── complexityLevel: "minimal"|"simple"|"standard"|"detailed"
│       └── updatedAt: timestamp
│
├── theme_preferences/               # Preferências de tema (host)
│   └── {userId}
│       ├── theme: string
│       ├── fontSize: string
│       ├── spacing: string
│       ├── animationsEnabled: boolean
│       └── updatedAt: timestamp
│
├── accessibility_preferences/       # Preferências de acessibilidade
│   └── {userId}
│       ├── focusMode: boolean
│       ├── complexityLevel: string
│       ├── displayMode: string
│       ├── cognitiveAlerts: boolean
│       ├── focusIndicators: string
│       └── updatedAt: timestamp
│
└── user_profiles/                   # Perfis dos usuários
    └── {userId}
        ├── id: string
        ├── name: string
        ├── email: string
        ├── avatar?: string
        ├── bio?: string
        ├── neurodivergence: string[]
        ├── specificNeeds: string[]
        ├── studyRoutine?: string
        ├── workRoutine?: string
        ├── createdAt: timestamp
        └── updatedAt: timestamp
```

### **Padrão de Isolamento de Dados**

#### **Para coleções com documento por usuário:**
```typescript
// O ID do documento É o userId
const docRef = doc(db, 'user_preferences', userId);
```

#### **Para coleções com múltiplos documentos:**
```typescript
// Filtrar por userId
const q = query(
  collection(db, 'tasks'),
  where('userId', '==', userId)
);
```

### **Importante: Remover valores `undefined`**

Firestore não aceita valores `undefined`. Sempre limpar antes de salvar:

```typescript
private removeUndefined(obj: any): any {
  const cleaned: any = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  });
  return cleaned;
}
```

---

## 🔐 Autenticação

### **Firebase Authentication**

Localização: `packages/host/src/contexts/AuthContext.tsx`

```typescript
// Registro
const userCredential = await createUserWithEmailAndPassword(auth, email, password);
await updateProfile(userCredential.user, { displayName: name });
await setDoc(doc(db, 'users', userCredential.user.uid), {
  name,
  email,
  createdAt: new Date().toISOString(),
});

// Login
const userCredential = await signInWithEmailAndPassword(auth, email, password);
const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

// Logout
await signOut(auth);
```

### **Verificação de Autenticação**

```typescript
// Hook useAuth
const { user, isAuthenticated, isLoading, login, logout, register } = useAuth();

// Listener de mudanças
onAuthStateChanged(auth, async (firebaseUser) => {
  if (firebaseUser) {
    // Usuário logado
  } else {
    // Usuário deslogado
  }
});
```

### **Rotas Protegidas**

```typescript
// AppRouter.tsx
function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div>Carregando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return children;
}
```

---

## 🎨 Gestão de Estado

### **Contexts Principais**

#### **1. AuthContext** (`host`)
- Gerencia autenticação
- Mantém dados do usuário logado
- Persiste sessão com Firebase Auth

#### **2. ThemeContext** (`host`)
- Gerencia tema (light, dark, high-contrast)
- Tamanho da fonte
- Espaçamento
- Animações
- **Salva no Firestore**: `theme_preferences/{userId}`

#### **3. AccessibilityContext** (`host`)
- Modo foco
- Nível de complexidade
- Modo de exibição
- Alertas cognitivos
- Indicadores de foco
- **Salva no Firestore**: `accessibility_preferences/{userId}`

### **Fluxo de Sincronização com Firestore**

```typescript
// 1. Carregar ao montar/logar
useEffect(() => {
  const loadPreferences = async () => {
    const user = auth.currentUser;
    if (!user) return;
    
    const docRef = doc(db, 'theme_preferences', user.uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      setTheme(data.theme);
      // ...
    }
  };
  
  auth.onAuthStateChanged(loadPreferences);
}, []);

// 2. Salvar ao alterar
useEffect(() => {
  if (!isLoaded) return;
  
  const user = auth.currentUser;
  if (!user) return;
  
  const docRef = doc(db, 'theme_preferences', user.uid);
  await setDoc(docRef, {
    theme,
    fontSize,
    spacing,
    animationsEnabled,
    updatedAt: new Date().toISOString()
  });
}, [theme, fontSize, spacing, animationsEnabled, isLoaded]);
```

---

## 📝 Padrões de Código

### **Repository Pattern**

Todos os repositórios implementam interfaces:

```typescript
// Domain
export interface ITaskRepository {
  getTasks(): Promise<Task[]>;
  getTaskById(id: string): Promise<Task | null>;
  createTask(data: CreateTaskDTO): Promise<Task>;
  updateTask(id: string, data: UpdateTaskDTO): Promise<Task>;
  deleteTask(id: string): Promise<void>;
}

// Infrastructure
export class FirestoreTaskRepository implements ITaskRepository {
  private db = getFirestoreDb();
  
  private getUserId(): string {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');
    return userId;
  }
  
  async getTasks(): Promise<Task[]> {
    const userId = this.getUserId();
    const q = query(
      collection(this.db, 'tasks'),
      where('userId', '==', userId)
    );
    // ...
  }
}
```

### **Use Case Pattern**

```typescript
// Application
export class CreateTaskUseCase {
  constructor(private repository: ITaskRepository) {}
  
  async execute(data: CreateTaskDTO): Promise<Task> {
    return await this.repository.createTask(data);
  }
}

// Presentation
const repository = new FirestoreTaskRepository();
const createTaskUseCase = new CreateTaskUseCase(repository);

const handleSubmit = async () => {
  const task = await createTaskUseCase.execute(formData);
};
```

### **Conversão de Dados Firestore**

```typescript
private convertToTask(data: any): Task {
  return {
    id: data.id,
    title: data.title,
    // Converter Timestamps do Firestore
    createdAt: data.createdAt?.toDate 
      ? data.createdAt.toDate() 
      : new Date(data.createdAt),
    // ...
  };
}
```

---

## 🔄 Fluxo de Dados

### **Criação de Tarefa**

```
User Input (TaskModal)
    ↓
CreateTaskUseCase.execute()
    ↓
FirestoreTaskRepository.createTask()
    ↓
Firestore: setDoc(tasks/{taskId})
    ↓
KanbanBoard: loadTasks()
    ↓
GetTasksUseCase.execute()
    ↓
FirestoreTaskRepository.getTasks()
    ↓
Firestore: getDocs(query where userId)
    ↓
UI Update
```

### **Drag and Drop de Tarefa**

```
User: onDragStart
    ↓
Store draggedTask in state
    ↓
User: onDrop in new column
    ↓
UpdateTaskUseCase.execute(id, { status: newStatus })
    ↓
FirestoreTaskRepository.updateTask()
    ↓
Firestore: setDoc(tasks/{taskId}) with userId
    ↓
loadTasks() to refresh UI
```

### **Mudança de Tema**

```
User: Click theme button
    ↓
ThemeContext: setTheme(newTheme)
    ↓
useEffect detects change
    ↓
Firestore: setDoc(theme_preferences/{userId})
    ↓
document.documentElement.setAttribute('data-theme', newTheme)
    ↓
CSS applies new theme
```

---

## 🚀 Como Rodar o Projeto

### **Pré-requisitos**
- Node.js 18+
- npm ou yarn
- Conta Firebase (já configurada)

### **Instalação**

```bash
# 1. Clonar repositório
git clone https://github.com/Felipe-Tintori/tech-challenge--5.git
cd tech-challenge--5/web

# 2. Instalar dependências
npm install

# 3. Instalar dependências de cada pacote
cd packages/host && npm install && cd ../..
cd packages/organizador-tarefas && npm install && cd ../..
cd packages/painel-cognitivo && npm install && cd ../..
cd packages/perfil-usuario && npm install && cd ../..
cd packages/shared && npm install && cd ../..
```

### **Desenvolvimento**

```bash
# Rodar todos os servidores simultaneamente
npm run dev

# Servidores individuais (se necessário)
npm run dev:host      # localhost:3000
npm run dev:painel    # localhost:3001
npm run dev:tarefas   # localhost:3002
npm run dev:perfil    # localhost:3003
```

### **URLs**
- **Host**: http://localhost:3000
- **Painel Cognitivo**: http://localhost:3001
- **Organizador de Tarefas**: http://localhost:3002
- **Perfil do Usuário**: http://localhost:3003

### **Build para Produção**

```bash
# Build de todos os pacotes
npm run build

# Builds individuais
npm run build:host
npm run build:painel
npm run build:tarefas
npm run build:perfil
```

### **Testes**

```bash
# Rodar todos os testes
npm test

# Testes com coverage
npm run test:coverage

# Testes individuais
cd packages/host && npm test
```

---

## 🐛 Troubleshooting

### **Problema: Erro de compilação TypeScript**
```bash
# Limpar cache do TypeScript
rm -rf packages/*/node_modules/.cache
npm run dev
```

### **Problema: Firestore retorna dados vazios**
- Verifique se o usuário está autenticado: `auth.currentUser?.uid`
- Confirme que o `userId` está sendo salvo nos documentos
- Verifique as regras de segurança do Firestore

### **Problema: Module Federation não carrega remoto**
- Verifique se todos os servidores estão rodando
- Confirme as portas nos arquivos `webpack.config.js`
- Limpe cache: `rm -rf packages/*/dist`

### **Problema: Valores `undefined` no Firestore**
- Use a função `removeUndefined()` antes de `setDoc()`
- Firestore não aceita valores `undefined`

---

## 📚 Recursos Adicionais

### **Documentos Relacionados**
- `FIREBASE_INTEGRATION.md` - Guia completo de integração Firebase
- `FIREBASE_SETUP.md` - Setup inicial do Firebase
- `TESTING.md` - Guia de testes
- `ARCHITECTURE.md` - Visão geral da arquitetura

### **Links Úteis**
- [Firebase Console](https://console.firebase.google.com/project/techchallenger5)
- [Firestore Database](https://console.firebase.google.com/project/techchallenger5/firestore)
- [Firebase Authentication](https://console.firebase.google.com/project/techchallenger5/authentication)
- [Module Federation Docs](https://webpack.js.org/concepts/module-federation/)

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Consultar esta documentação
2. Verificar logs do console do navegador (F12)
3. Verificar erros no terminal
4. Consultar Firebase Console para status do banco

---

**Última atualização**: Janeiro 2026  
**Versão**: 1.0.0  
**Projeto**: Tech Challenge #5 - FIAP
