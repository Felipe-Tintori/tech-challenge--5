# Firebase Integration Guide

## Configuração do Firebase

A aplicação MindEase agora utiliza Firebase Firestore para armazenamento de dados, substituindo o localStorage.

### 1. Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto" ou "Add project"
3. Siga o assistente de criação do projeto
4. Após criar o projeto, clique em "Web" (ícone `</>`) para adicionar um app web
5. Registre seu app e copie as credenciais de configuração

### 2. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env` na raiz do projeto web:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e substitua os valores pelas suas credenciais do Firebase:
   ```
   REACT_APP_FIREBASE_API_KEY=sua_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=seu_projeto_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=seu_app_id
   ```

### 3. Configurar Firestore Database

1. No Firebase Console, vá em "Build" > "Firestore Database"
2. Clique em "Create database"
3. Selecione "Start in test mode" (para desenvolvimento) ou configure as regras de segurança
4. Escolha a localização do banco de dados (recomendado: southamerica-east1 para Brasil)

### 4. Regras de Segurança do Firestore (Produção)

Para produção, configure regras de segurança apropriadas no Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Tarefas - acessível apenas para usuários autenticados
    match /tasks/{taskId} {
      allow read, write: if request.auth != null;
    }
    
    // Preferências do usuário
    match /user_preferences/{docId} {
      allow read, write: if request.auth != null;
    }
    
    // Perfil do usuário
    match /user_profiles/{docId} {
      allow read, write: if request.auth != null;
    }
    
    // Storage geral da aplicação
    match /app_storage/{docId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Estrutura de Dados no Firestore

#### Collections:

- **tasks**: Tarefas do organizador (kanban)
  - Documentos: Um documento por tarefa com ID único
  - Campos: id, title, description, status, priority, createdAt, updatedAt, completedAt, estimatedTime, tags

- **user_preferences**: Preferências do painel cognitivo
  - Documento único: `current_user_preferences`
  - Campos: theme, fontSize, spacing, animationsEnabled, focusMode, complexityLevel, highContrast

- **user_profiles**: Perfil do usuário
  - Documento único: `current_user_profile`
  - Campos: id, name, email, avatar, bio, neurodivergence, specificNeeds, studyRoutine, workRoutine, createdAt, updatedAt

- **app_storage**: Storage genérico key-value
  - Documento único: `user_data`
  - Campos: [chave]: [valor]

### 6. Migração de Dados Existentes

Se você já possui dados no localStorage e deseja migrá-los para o Firebase:

1. Abra o Console do navegador (F12)
2. Execute o seguinte script para visualizar seus dados:
   ```javascript
   console.log('Tasks:', localStorage.getItem('mindease_tasks'));
   console.log('Preferences:', localStorage.getItem('mindease_preferences'));
   console.log('Profile:', localStorage.getItem('mindease_user_profile'));
   ```
3. Copie os dados JSON
4. No Firebase Console, crie os documentos manualmente ou use o script de migração

### 7. Desenvolvimento Local

Para desenvolvimento local sem Firebase:
- O código funciona com cache em memória
- Para persistência, configure as credenciais do Firebase
- Alternativamente, use o Firebase Emulator Suite para desenvolvimento offline

### 8. Instalação e Execução

```bash
# Instalar dependências
cd web
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

### 9. Troubleshooting

**Erro: "Firebase not initialized"**
- Verifique se as variáveis de ambiente estão configuradas
- Confirme que o arquivo `.env` está na raiz do projeto web
- Reinicie o servidor de desenvolvimento

**Erro de permissão no Firestore**
- Verifique as regras de segurança no Firebase Console
- Para desenvolvimento, use "test mode"
- Para produção, implemente autenticação adequada

**Dados não aparecem**
- Verifique a aba "Network" do navegador para erros de API
- Confirme que as collections existem no Firestore
- Verifique os logs do console do navegador

### 10. Performance e Boas Práticas

- O FirestoreService implementa cache em memória para melhor performance
- Operações de leitura/escrita são assíncronas
- Use o offline persistence do Firestore para melhor UX:
  ```typescript
  import { enableIndexedDbPersistence } from 'firebase/firestore';
  enableIndexedDbPersistence(db);
  ```

## Suporte

Para mais informações sobre Firebase:
- [Documentação oficial do Firebase](https://firebase.google.com/docs)
- [Firestore Getting Started](https://firebase.google.com/docs/firestore/quickstart)
