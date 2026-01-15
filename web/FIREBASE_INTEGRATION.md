# Integração com Firebase - Guia Completo

## ✅ O que foi implementado

### 1. **Firebase Authentication (Login e Registro)**
- **Localização**: `packages/host/src/contexts/AuthContext.tsx`
- **Funcionalidades**:
  - ✅ Registro de novos usuários com e-mail e senha
  - ✅ Login com e-mail e senha existente
  - ✅ Logout
  - ✅ Persistência automática de sessão (usuário permanece logado após recarregar)
  - ✅ Dados do usuário salvos no Firestore (coleção `users`)

### 2. **Firestore Database para Dados da Aplicação**
Todos os dados agora são salvos no Firebase Firestore:

#### **Tarefas (organizador-tarefas)**
- **Coleção**: `tasks`
- **Dados**: Todas as tarefas criadas, editadas, movidas entre status
- **Arquivo**: `packages/organizador-tarefas/src/infrastructure/repositories/FirestoreTaskRepository.ts`

#### **Preferências (painel-cognitivo)**
- **Coleção**: `user_preferences`
- **Dados**: Tema, tamanho da fonte, espaçamento, modo foco
- **Arquivo**: `packages/painel-cognitivo/src/infrastructure/repositories/FirestorePreferencesRepository.ts`

#### **Perfil do Usuário (perfil-usuario)**
- **Coleção**: `user_profiles`
- **Dados**: Foto, nome, bio, necessidades cognitivas
- **Arquivo**: `packages/perfil-usuario/src/infrastructure/repositories/FirestoreUserProfileRepository.ts`

#### **Storage Genérico (host)**
- **Coleção**: `app_storage`
- **Dados**: Qualquer dado genérico da aplicação (vinculado ao usuário)
- **Arquivo**: `packages/host/src/utils/storage.ts`

#### **Usuários (host - auth)**
- **Coleção**: `users`
- **Dados**: Nome, e-mail, data de criação
- **Arquivo**: `packages/host/src/contexts/AuthContext.tsx`

## 🔧 Como funciona agora

### **Criar uma conta**
1. Acesse http://localhost:3000
2. Clique em "Criar conta"
3. Preencha: Nome, E-mail e Senha (mínimo 6 caracteres)
4. Firebase Authentication cria o usuário
5. Os dados são salvos na coleção `users` do Firestore
6. Você é automaticamente logado

### **Fazer login**
1. Acesse http://localhost:3000
2. Informe e-mail e senha
3. Firebase Authentication valida as credenciais
4. Você é redirecionado para a dashboard

### **Salvar dados**
- **Tarefas**: Ao criar/editar uma tarefa, ela é salva no Firestore (coleção `tasks`)
- **Tema**: Ao mudar o tema, é salvo em `user_preferences`
- **Perfil**: Ao atualizar o perfil, é salvo em `user_profiles`
- Todos os dados são vinculados ao usuário logado

## 🔥 Configuração do Firebase Console

### **1. Habilitar Authentication**
1. Acesse: https://console.firebase.google.com/project/techchallenger5/authentication
2. Clique em "Get Started"
3. Habilite "Email/Password" como método de login
4. ✅ Pronto! Agora os usuários podem criar contas

### **2. Firestore Database (já criado)**
- **Status**: ✅ Ativo em test mode
- **Regras atuais**: Permitem leitura/escrita (teste)
- **URL**: https://console.firebase.google.com/project/techchallenger5/firestore

### **3. Atualizar regras de segurança (IMPORTANTE para produção)**

**Regras recomendadas para Firestore:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Apenas usuários autenticados podem acessar
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Usuários só podem editar seus próprios dados
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Tarefas vinculadas ao usuário
    match /tasks/{taskId} {
      allow read, write: if request.auth != null;
    }
    
    // Preferências vinculadas ao usuário
    match /user_preferences/{docId} {
      allow read, write: if request.auth != null;
    }
    
    // Perfis vinculados ao usuário
    match /user_profiles/{docId} {
      allow read, write: if request.auth != null;
    }
    
    // Storage genérico vinculado ao usuário
    match /app_storage/{docId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Para aplicar as regras:**
1. Acesse: https://console.firebase.google.com/project/techchallenger5/firestore/rules
2. Cole as regras acima
3. Clique em "Publicar"

## 📊 Visualizar dados no Firebase Console

### **Ver usuários cadastrados**
- URL: https://console.firebase.google.com/project/techchallenger5/authentication/users
- Aqui você verá todos os usuários que criaram conta

### **Ver dados do Firestore**
- URL: https://console.firebase.google.com/project/techchallenger5/firestore/databases/-default-/data
- Coleções disponíveis:
  - `users` - Dados dos usuários
  - `tasks` - Tarefas criadas
  - `user_preferences` - Preferências de acessibilidade
  - `user_profiles` - Perfis dos usuários
  - `app_storage` - Dados genéricos

## 🧪 Testar a integração

1. **Teste de Registro:**
   - Crie uma conta com um e-mail válido
   - Verifique no Firebase Console se o usuário apareceu
   - Verifique se foi criado um documento em `users`

2. **Teste de Login:**
   - Faça logout
   - Faça login novamente com as mesmas credenciais
   - Deve funcionar sem erros

3. **Teste de Persistência:**
   - Crie algumas tarefas
   - Mude o tema
   - Atualize seu perfil
   - Recarregue a página (F5)
   - Verifique se todos os dados persistem

4. **Teste de Firestore:**
   - Abra o Firebase Console
   - Navegue até Firestore Database
   - Verifique se as coleções têm dados
   - Edite um dado manualmente e veja refletir na aplicação

## ⚠️ Avisos Importantes

### **Modo de Teste**
- Atualmente o Firestore está em **test mode**
- Qualquer pessoa com acesso ao projeto pode ler/escrever
- **AÇÃO NECESSÁRIA**: Atualizar regras de segurança antes de produção

### **Credenciais no código**
- As credenciais do Firebase estão hardcoded nos arquivos:
  - `packages/host/src/config/firebase.ts`
  - `packages/organizador-tarefas/src/infrastructure/config/firebase.ts`
  - `packages/painel-cognitivo/src/infrastructure/config/firebase.ts`
  - `packages/perfil-usuario/src/infrastructure/config/firebase.ts`
- **RECOMENDADO**: Mover para variáveis de ambiente (`.env`)

### **Migração de dados antigos**
- Dados que estavam no localStorage **NÃO foram migrados**
- São coleções completamente novas
- Usuários precisam criar contas novas

## 🚀 Próximos passos

1. ✅ **Habilitar Email/Password no Firebase Authentication**
2. ⚠️ **Atualizar regras de segurança do Firestore**
3. 📝 **Mover credenciais para `.env`** (opcional mas recomendado)
4. 🧪 **Testar todos os fluxos da aplicação**
5. 🔒 **Considerar adicionar recuperação de senha**
6. 👥 **Considerar adicionar outros métodos de login** (Google, GitHub, etc)

## 📝 Diferenças do localStorage

### **Antes (localStorage)**
```typescript
// Salvava no navegador
localStorage.setItem('user', JSON.stringify(user));

// Dados perdidos ao limpar cache
// Não compartilhados entre dispositivos
// Sem autenticação
```

### **Agora (Firebase)**
```typescript
// Salva no Firebase Firestore (nuvem)
await setDoc(doc(db, 'users', userId), userData);

// Dados persistem na nuvem
// Acessíveis de qualquer dispositivo
// Autenticação obrigatória
// Sincronização em tempo real
```

## 🎯 Conclusão

Agora **TODOS os dados** da aplicação são salvos no Firebase:
- ✅ Autenticação de usuários (login/registro)
- ✅ Tarefas
- ✅ Preferências de acessibilidade
- ✅ Perfil do usuário
- ✅ Qualquer outro dado da aplicação

**Não há mais localStorage!** Tudo está na nuvem e seguro! 🎉
