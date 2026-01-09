
# 🎓 EduQuiz Master 2.5 - ViniTec Edition

> **A solução definitiva para aprendizado interativo em ambientes offline e redes locais.**

O **EduQuiz Master** é uma plataforma de gamificação educacional robusta, desenvolvida para transformar a dinâmica de sala de aula e treinamentos corporativos. Projetada sob a filosofia *Offline-First*, a plataforma não depende de conexão com a internet para funcionar, armazenando todos os dados, quizzes e resultados diretamente no navegador (LocalStorage).

---

## 🚀 Funcionalidades Principais

### 🧠 Versatilidade Pedagógica
- **Múltiplos Tipos de Questões**: 
  - *Múltipla Escolha*: Clássico com até 4 alternativas.
  - *Verdadeiro ou Falso*: Para avaliações rápidas e conceituais.
  - *Resposta Curta*: Estimula a memorização ativa e escrita correta.
  - *Ordenação Lógica*: Desafie o raciocínio sequencial (processos, datas, lógica).
- **Temas Customizáveis**: Organize o conhecimento por categorias com ícones e cores únicas.
- **Explicações Detalhadas**: Feedback imediato após cada resposta para reforçar o aprendizado.

### 🎮 Gamificação e Engajamento
- **Sistema de Streaks (Foguinho)**: Recompensa alunos que acertam várias questões seguidas.
- **Cronômetro Progressivo**: Controle de tempo por pergunta para dinâmicas competitivas.
- **Rankings Dinâmicos**: Quadros de honra Globais, por Tema ou por Quiz específico.

### 🛠️ Gestão Administrativa (ViniTec Engine)
- **Dashboard de Analytics**: Visualize a média de acertos, quizzes mais populares e volume de usuários.
- **Gestão de Perfil**: Altere credenciais de administrador com facilidade.
- **Backup e Portabilidade**: Exporte e importe todo o banco de dados em arquivos `.json` para mover o quiz entre computadores.

---

## 🌐 Como Rodar em Rede Local (Multiplayer)

Uma das maiores vantagens do EduQuiz Master é a capacidade de um único computador atuar como **Servidor Host** para toda uma sala.

### 1. Preparação do Servidor (Computador do Professor/Instrutor)
Existem duas formas principais de servir o projeto:

**A. Usando Node.js (Recomendado para Devs):**
No terminal do projeto, execute:
```bash
npx serve -s build
# OU para ambiente de desenvolvimento:
npm run dev -- --host
```

**B. Usando Servidores Portáteis (Para usuários leigos):**
Você pode colocar os arquivos em um servidor local como **XAMPP**, **WAMP** ou até usar extensões do VS Code como a **Live Server**, configurando-a para aceitar conexões externas.

### 2. Identificação do IP
No computador Host:
1. Abra o terminal (cmd ou powershell).
2. Digite `ipconfig`.
3. Procure por **Endereço IPv4** (exemplo: `192.168.1.15`).

### 3. Acesso dos Alunos
Os alunos devem conectar seus dispositivos (celulares/tablets) no **mesmo Wi-Fi** do computador host e digitar no navegador:
`http://192.168.1.15:5173` (substituindo pelo seu IP e porta).

---

## 📂 Execução Totalmente Offline

O projeto foi construído para ser **autossuficiente**. 

1.  **Sem Internet? Sem Problemas**: Uma vez que os arquivos foram carregados no navegador pela primeira vez (ou via rede local), o sistema utiliza o `LocalStorage` para persistir dados.
2.  **Persistência**: Mesmo que o computador seja desligado ou a aba fechada, os quizzes cadastrados e os rankings permanecem salvos no banco de dados local do navegador.
3.  **Portabilidade**: Para mover os dados para outro PC sem internet, use a função **Exportar Backup** na aba de Dados do Administrador e importe no novo dispositivo.

---

## 🛠️ Especificações Técnicas

- **Frontend**: React 19 + TypeScript (Tipagem forte para evitar erros).
- **Estilização**: Tailwind CSS (Interface moderna e responsiva).
- **Gráficos**: Recharts (Visualização de dados de desempenho).
- **Ícones**: Emoji-based (Garante compatibilidade sem dependências de fontes externas).

---

## 🔒 Segurança e Privacidade

- **Dados Locais**: Nenhuma informação sai do dispositivo. Privacidade total para alunos e instituições.
- **Acesso Admin**: Protegido por senha configurável no painel de perfil.

---

## ✒️ Créditos e Suporte

Desenvolvido com excelência técnica para fins educacionais.

**© 2026 - Sistema Educacional Profissional Offline**  
**Direitos Reservados a ViniTec**

---
*EduQuiz Master: Transformando conhecimento em conquista.*
