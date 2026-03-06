# MindEase — Plataforma de Acessibilidade Cognitiva

> Projeto desenvolvido para o Tech Challenge 5 — FIAP Inclusive  
> Tema: **Acessibilidade Cognitiva para pessoas neurodivergentes**

---

## 🧠 Sobre o Projeto

MindEase é uma plataforma completa (web + mobile) que facilita a vida acadêmica e profissional de pessoas neurodivergentes, incluindo usuários com:

- TDAH
- TEA (Autismo)
- Dislexia
- Ansiedade e burnout mental
- Dificuldades de foco e retenção
- Sobrecarga sensorial

A plataforma oferece personalização profunda da interface (tema, tamanho de fonte, espaçamento, modo foco), gerenciamento de tarefas com Pomodoro e perfil de necessidades específicas — tudo sincronizado via Firebase entre web e mobile.

---

## 📁 Estrutura do Repositório

```
tech-challenge--5/
├── web/          # Microfrontends React (Module Federation + Webpack 5)
└── mobile/       # App React Native + Expo SDK 54
```

---

## 🌐 Web

Aplicação web construída com **Microfrontends (Module Federation)** e **Clean Architecture**.

### Tecnologias

| Tecnologia | Versão |
|---|---|
| React | 18 |
| TypeScript | 5 |
| Webpack | 5 (Module Federation) |
| Firebase Auth + Firestore | 10 |
| Jest + React Testing Library | — |

### Microfrontends

| Pacote | Porta | Responsabilidade |
|---|---|---|
| `host` | 3000 | Shell, roteamento, autenticação, contextos globais |
| `painel-cognitivo` | 3001 | Dashboard de preferências cognitivas |
| `organizador-tarefas` | 3002 | Kanban + Pomodoro |
| `perfil-usuario` | 3003 | Perfil e configurações persistentes |
| `shared` | — | Tipos, serviços Firebase e utilitários comuns |

### Como executar

```bash
cd web
npm install
npm run dev        # sobe todos os microfrontends simultaneamente
```

Veja o [README completo da web](web/README.md) para configuração do Firebase e CI/CD.

---

## 📱 Mobile

App mobile construído com **React Native + Expo SDK 54**, compartilhando o mesmo Firebase da versão web.

### Tecnologias

| Tecnologia | Versão |
|---|---|
| React Native | 0.77.1 |
| Expo SDK | 54 |
| TypeScript | 5.7 |
| Firebase Auth + Firestore | 10 |
| React Navigation | 6 |

### Telas

| Tela | Recursos |
|---|---|
| Login / Cadastro | Validação inline, toast de erros, Firebase Auth |
| Painel Cognitivo | Tema (claro/escuro/alto contraste), tamanho de fonte, espaçamento, modo foco |
| Tarefas | Kanban (A fazer / Em progresso / Concluído) + Pomodoro Timer |
| Perfil | Neurodivergências, necessidades específicas, rotina de estudos |

### Como executar

```bash
cd mobile
npm install

# Dispositivo físico via túnel (recomendado)
npm run tunnel

# Ou rede local (mesmo WiFi)
node node_modules/expo/bin/cli start --lan
```

Escaneie o QR Code com o app **Expo Go** ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779)).

Veja o [README completo do mobile](mobile/README.md) para configuração do Firebase.

---

## 🔥 Firebase

Ambos os projetos utilizam o **mesmo projeto Firebase** (`techchallenger5`):

- **Authentication**: Email/Senha
- **Firestore**: coleções `users` (perfil + preferências) e `tasks`

### Regras do Firestore

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

---

## ♿ Acessibilidade

| Recurso | Web | Mobile |
|---|:---:|:---:|
| Temas: claro / escuro / alto contraste | ✅ | ✅ |
| Tamanho de fonte ajustável | ✅ | ✅ |
| Modo foco (reduz distrações) | ✅ | ✅ |
| Nível de complexidade da interface | ✅ | ✅ |
| Alertas cognitivos (90 min de foco) | ✅ | ✅ |
| Pomodoro Timer | ✅ | ✅ |
| Perfil de neurodivergências | ✅ | ✅ |

---

## 🧪 Testes (Web)

```bash
cd web
npm test              # todos os testes
npm run test:coverage # com cobertura
```

11 suítes de testes cobrindo: AuthContext, componentes, páginas, rotas, contextos, storage, utils, formatters, validação, constantes e infraestrutura.

---

## 🚀 CI/CD (Web)

Pipeline GitHub Actions configurado em `.github/workflows/`:

- **`ci.yml`** — lint + testes em todo push/PR
- **`deploy.yml`** — build e deploy automático na branch `main`

Credenciais Firebase armazenadas como **GitHub Secrets** (nunca expostas no código).

---

## 👥 Time

Desenvolvido por **Felipe Gouvêa Tintori** — FIAP Tech Challenge 5
