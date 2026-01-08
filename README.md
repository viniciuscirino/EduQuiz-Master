
# 🎓 EduQuiz Master 2.5 - ViniTec Edition

O EduQuiz Master é uma plataforma educacional de quizzes moderna, robusta e totalmente **offline-first**. Esta versão foi otimizada para funcionar em rede local, permitindo que um computador host sirva os quizzes para diversos participantes simultaneamente.

## 🌐 Como Jogar em Rede Local

Para permitir que outros dispositivos (celulares ou outros computadores) acessem o quiz na sua rede:

1.  **Hospede o Sistema**: Use um servidor estático no seu computador.
    *   No terminal da pasta do projeto: `npx serve -s build` (caso tenha feito build) ou use o Vite com o flag de host: `npm run dev -- --host`.
2.  **Identifique seu IP**: Descubra o IP local do seu computador (ex: `192.168.1.5`).
3.  **Compartilhe**: Os participantes devem acessar `http://SEU_IP:5173` pelo navegador do celular.
4.  **QR Code**: Na aba **Administração > Rede Local**, você encontra auxílio para gerar o acesso rápido.

## ❓ Novos Tipos de Perguntas

Agora o sistema suporta 4 formatos de desafios:
- **Múltipla Escolha**: Escolha uma entre 4 opções.
- **Verdadeiro ou Falso**: Decisão binária rápida.
- **Resposta Curta (Texto)**: Digite a resposta exata (o sistema ignora maiúsculas/minúsculas).
- **Ordenação**: Desafie o aluno a colocar fatos históricos ou processos em ordem lógica.

## ✨ Funcionalidades Profissionais

- **👤 Perfil Admin**: Edite seu nome e senha na área administrativa.
- **⚙️ Controle Total**: Gerencie usuários, temas, quizzes e questões.
- **🔥 Streaks & Rankings**: Gamificação integrada para maior engajamento.
- **📊 Analytics**: Dashboard administrativo com média de acertos e quizzes populares.

## 🛠️ Tecnologias

- **React 19** + **TypeScript**
- **Tailwind CSS**
- **LocalStorage API** (Dados persistentes sem necessidade de internet)

---
© 2026 - Sistema Educacional Profissional Offline
**Direitos Reservados a ViniTec**
