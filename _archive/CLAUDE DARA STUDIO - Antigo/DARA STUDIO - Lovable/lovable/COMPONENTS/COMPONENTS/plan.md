

# Plano de Implementacao - Portal de Arquitetura

## Visao Geral

Vamos construir um portal completo para um estudio de arquitetura com area publica e area privada do cliente.

---

## Estrutura de Paginas

### Paginas Publicas
1. **Home** (`/`) - Pagina inicial com hero, servicos e chamadas para acao
2. **Servicos** (`/servicos`) - Detalhes dos servicos oferecidos
3. **Portfolio** (`/portfolio`) - Galeria de projetos
4. **Solicitar Orcamento** (`/orcamento`) - Formulario de solicitacao
5. **Contato** (`/contato`) - Formulario de contato/suporte

### Paginas Privadas (Area do Cliente)
6. **Login** (`/auth`) - Autenticacao do cliente
7. **Dashboard** (`/dashboard`) - Painel principal do cliente
8. **Projeto** (`/dashboard/projeto/:id`) - Detalhes do projeto com:
   - Upload de arquivos
   - Questionario do projeto
   - Chat com equipe
   - Documentos (contrato, invoices)
   - Link de pagamento Stripe

---

## Componentes a Criar

### Layout e Navegacao
- `Header` - Navegacao principal com menu responsivo
- `Footer` - Rodape do site
- `PublicLayout` - Layout para paginas publicas
- `DashboardLayout` - Layout para area do cliente (com sidebar)
- `ProtectedRoute` - Componente para proteger rotas autenticadas

### Pagina Inicial
- `HeroSection` - Banner principal com CTAs
- `ServicesGrid` - Grid de servicos com 4 cards
- `PortfolioPreview` - Preview do portfolio

### Area do Cliente
- `ProjectCard` - Card de projeto na lista
- `ProjectStatus` - Badge de status do projeto
- `FileUpload` - Componente de upload de arquivos
- `ProjectQuestionnaire` - Formulario de informacoes do projeto
- `ProjectChat` - Sistema de mensagens em thread
- `QuotesList` - Lista de orcamentos/invoices
- `PaymentSection` - Secao de pagamento com link Stripe

---

## Atualizacao do Banco de Dados

O banco ja possui as tabelas principais. Precisamos adicionar:

1. **Novos campos na tabela `projects`**:
   - `questionnaire_data` (JSONB) - Dados do questionario
   - `payment_status` (ENUM) - Status de pagamento
   - `stripe_payment_link` (TEXT) - Link de pagamento

2. **Atualizar ENUM `project_status`**:
   - Adicionar valores em portugues: `pending_payment`, `in_progress`, `paused`, `completed`

3. **Tabela `user_roles`** (para administradores):
   - Seguindo as melhores praticas de seguranca

---

## Fluxo de Autenticacao

1. Cliente acessa `/auth` e faz login com email/senha
2. Sistema verifica credenciais via Supabase Auth
3. Apos login, redireciona para `/dashboard`
4. Cliente ve apenas seus projetos (RLS ja configurado)
5. Logout retorna para pagina inicial

---

## Funcionalidades Detalhadas

### Upload de Arquivos
- Usar bucket `project-files` (ja criado)
- Suportar PDF, imagens, documentos
- Mostrar lista de arquivos do projeto
- Permitir download

### Chat do Projeto
- Mensagens em thread por projeto
- Diferenciacao entre mensagens do cliente e admin
- Usar tabela `messages` existente

### Status do Projeto
```text
+-------------------+--------------------+
|    Status         |    Cor             |
+-------------------+--------------------+
| Falta Pagamento   | Vermelho           |
| Em Andamento      | Azul               |
| Pausado           | Amarelo            |
| Finalizado        | Verde              |
+-------------------+--------------------+
```

### Pagamento
- Exibir link do Stripe (campo `payment_link` na tabela `quotes`)
- Mostrar status do pagamento
- Botao "Pagar Agora" abre link externo

---

## Ordem de Implementacao

### Fase 1: Estrutura Base
1. Criar componentes de layout (Header, Footer, PublicLayout)
2. Configurar rotas no App.tsx
3. Criar pagina inicial com Hero e Servicos

### Fase 2: Paginas Publicas
4. Pagina de Servicos
5. Pagina de Portfolio (conectada ao banco)
6. Pagina de Solicitar Orcamento (formulario)
7. Pagina de Contato

### Fase 3: Autenticacao
8. Pagina de Login/Registro
9. Contexto de autenticacao
10. Protecao de rotas

### Fase 4: Area do Cliente
11. Dashboard com lista de projetos
12. Pagina de detalhes do projeto
13. Upload de arquivos
14. Sistema de chat
15. Lista de orcamentos e pagamentos

### Fase 5: Atualizacoes do Banco
16. Migracao para novos campos
17. Configuracao de roles de usuario

---

## Secao Tecnica

### Tecnologias Utilizadas
- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- React Router DOM para navegacao
- React Query para gerenciamento de estado
- Supabase para autenticacao, banco de dados e storage
- Zod para validacao de formularios

### Estrutura de Pastas
```text
src/
  components/
    layout/
      Header.tsx
      Footer.tsx
      PublicLayout.tsx
      DashboardLayout.tsx
    home/
      HeroSection.tsx
      ServicesGrid.tsx
    dashboard/
      ProjectCard.tsx
      FileUpload.tsx
      ProjectChat.tsx
      QuotesList.tsx
    ui/ (existente)
  pages/
    Index.tsx
    Services.tsx
    Portfolio.tsx
    RequestQuote.tsx
    Contact.tsx
    Auth.tsx
    Dashboard.tsx
    ProjectDetail.tsx
  hooks/
    useAuth.tsx
    useProjects.tsx
    useMessages.tsx
  contexts/
    AuthContext.tsx
```

### Seguranca
- RLS policies ja configuradas no banco
- Validacao de inputs com Zod
- Protecao de rotas autenticadas
- Roles de usuario em tabela separada

