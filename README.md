# 📘 Manual Interativo - Módulo de Necessidades Educacionais Específicas

> **Status do Projeto:** 🚀 Funcional / Em Aprimoramento

Este projeto é uma aplicação web desenvolvida para servir como **Manual do Usuário** para o Módulo de Necessidades Educacionais Específicas (NEE). O objetivo é facilitar o acesso à informação para Gestores, Coordenadores, Docentes e Discentes, oferecendo uma navegação intuitiva, busca inteligente e recursos de acessibilidade.

---

## 🎯 O que é e para que serve?

O sistema funciona como uma *Landing Page* interativa que documenta o passo a passo de utilização do sistema acadêmico (focado no módulo de acessibilidade).

**Principais finalidades:**
* **Centralizar Informações:** Reúne tutoriais e fluxos de trabalho do Módulo NEE.
* **Segmentação por Perfil:** Permite que o usuário filtre o conteúdo específico para sua função (ex: um professor vê apenas o que é relevante para docentes).
* **Canal de Suporte:** Oferece um formulário de contato direto para dúvidas, integrado via SMTP.

---

## 🛠️ Funcionalidades Implementadas

Até o momento, a aplicação conta com as seguintes *features*:

### 1. ♿ Recursos de Acessibilidade (Aplicados)
Focando na inclusão digital, o projeto já conta com ferramentas essenciais implementadas:
* **Alto Contraste:** Modo de visualização com cores otimizadas (Fundo preto/Texto amarelo ou branco) para facilitar a leitura.
* **Ajuste de Fonte:** Botões de controle (`A+`, `A-`) que permitem aumentar ou diminuir o tamanho do texto dinamicamente.

### 2. 📧 Sistema de Contato
* **Envio Real:** Formulário "Entre em Contato" testado e operante.
* **Backend Robusto:** Integração completa com **PHPMailer** via SMTP (Gmail), garantindo que as mensagens cheguem corretamente à caixa de entrada da equipe.
* **Segurança:** Validação de campos e sanitização de dados no backend.

### 3. 🔍 Busca Inteligente
* Barra de pesquisa que filtra tópicos em tempo real conforme o usuário digita.
* Expande automaticamente os "accordions" (tópicos) onde o termo pesquisado foi encontrado.

### 4. 👥 Filtros por Perfil de Usuário
Navegação segmentada que exibe apenas os manuais pertinentes a cada grupo:
* **Gestores:** Visão administrativa global.
* **Coordenadores:** Gestão de cursos e turmas.
* **Docentes:** Diários de classe e registros de aula.
* **Discentes:** Visão do aluno.

### 5. 🖼️ Visualização de Imagens (Lightbox)
* Sistema de galeria modal para ampliar os "prints" das telas do sistema.

### 6. 🎨 Interface & UX
* Design responsivo (Mobile-first) utilizando **Bootstrap 5**.
* Identidade visual baseada nas cores institucionais (Verde UFOPA).

---

## 🚀 Tecnologias Utilizadas

* **Frontend:**
    * HTML5 (Semântico)
    * CSS3 (Variáveis CSS, Flexbox, Grid)
    * JavaScript (Vanilla ES6+)
    * Bootstrap 5 (Framework CSS)
* **Backend:**
    * PHP 7.4+
    * PHPMailer (Biblioteca de envio de e-mails)

---

## ⚙️ Como Rodar o Projeto (Guia Rápido)

Como o projeto utiliza PHP para o envio de e-mails, ele precisa de um servidor local.

1.  **Baixe o Projeto:** Clone o repositório ou faça o download do ZIP.
2.  **Mova para o Servidor:** Coloque a pasta do projeto dentro do diretório raiz do seu servidor local:
    * No **XAMPP**: pasta `htdocs`.
    * No **WampServer**: pasta `www`.
3.  **Execute:**
    * Inicie o Apache no seu servidor (XAMPP/WAMP).
    * Acesse no navegador: `http://localhost/PIAPE-Acessibilidade`.

---

## 📂 Estrutura do Projeto

```text
PIAPE-Acessibilidade/
├── index.html          # Página principal (Single Page Application feel)
├── style.css           # Estilização personalizada e variáveis de cor
├── script.js           # Lógica de busca, filtros e modal
├── enviar.php          # Script de processamento do formulário (Backend)
├── PHPMailer/          # Biblioteca para envio SMTP
├── logo/               # Identidade visual
└── print/              # Imagens e capturas de tela dos tutoriais
