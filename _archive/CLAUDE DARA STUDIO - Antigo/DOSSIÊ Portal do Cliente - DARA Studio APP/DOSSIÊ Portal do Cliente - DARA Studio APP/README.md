# DARA Studio — Portal do Cliente

Projeto React completo do Portal do Cliente da DARA Studio.

---

## Stack

- React 18
- Tailwind CSS (via CDN no Artifact — inline styles no componente)
- Lucide React (ícones)
- Fontes: Libre Baskerville + Montserrat (Google Fonts)

---

## Como rodar em um projeto Vite/React existente

### 1. Instalar dependência de ícones

```bash
npm install lucide-react
```

### 2. Copiar o arquivo

Coloque `PortalCliente.jsx` em `src/pages/` ou `src/components/`.

### 3. Usar o componente

```jsx
// src/App.jsx ou src/main.jsx
import PortalCliente from './pages/PortalCliente'

export default function App() {
  return <PortalCliente />
}
```

---

## Credenciais de teste (mock)

| Campo | Valor |
|-------|-------|
| Email | `joao@darastudio.com` |
| Senha | `teste123` |

---

## Estrutura do componente

```
PortalCliente.jsx
│
├── LoginScreen           — Tela de login com mock de credenciais
├── DashboardLayout       — Layout com sidebar colapsável
│   ├── PageDashboard     — Dashboard com métricas, projetos, atividade
│   ├── PageProjects      — Lista de projetos com ícones temáticos
│   ├── PageProjectDetail — Detalhe do projeto (7 abas)
│   │   ├── Overview          — Client info (editável) + detalhes técnicos
│   │   ├── Progress/Timeline — REV 00–03 + Finalização
│   │   ├── Drawings/Files    — Arquivos por etapa com datas
│   │   ├── Site Updates      — Feed de atualizações (cliente posta)
│   │   ├── Finance           — Faturas + Milestones + Payment Records
│   │   ├── Chat              — Mensageria em tempo real
│   │   └── Tickets           — Abertura de tickets de revisão
│   ├── PageInvoices      — Lista de faturas
│   ├── PageFiles         — Arquivos do cliente
│   ├── PageMessages      — Mensagens
│   ├── PageProfile       — Perfil editável
│   └── PageCompany       — Dados da empresa
```

---

## Regra de negócio: Client vs Admin

### Áreas interativas (cliente pode editar/postar):
- Client Information (Overview)
- Site Updates
- Chat
- Tickets
- Finance — upload de comprovantes

### Áreas somente leitura (alimentadas pelo Admin):
- Detalhes Técnicos
- Progress / Timeline
- Drawings / Files

---

## Próximos passos — integração Supabase

No topo do arquivo `PortalCliente.jsx` estão comentados todos os
comandos Supabase para substituir os dados mockados:

```js
// Auth
supabase.auth.signInWithPassword({ email, password })
supabase.auth.signInWithOAuth({ provider: 'google' })

// Queries
supabase.from('projects').select('*').eq('client_id', user.id)
supabase.from('invoices').select('*').eq('client_id', user.id)
supabase.from('project_files').select('*').eq('client_id', user.id)
supabase.from('messages').select('*').eq('client_id', user.id)
```

Substitua os arrays `MOCK_PROJECTS`, `MOCK_INVOICES`, `MOCK_FILES`
pelos resultados dessas queries e o portal estará conectado ao backend.
