# DARA Studio — Estrutura do Projeto React/Vite

## Como integrar os arquivos gerados

### Instalação

```bash
npm create vite@latest dara-studio -- --template react
cd dara-studio
npm install react-router-dom
```

### Estrutura de pastas recomendada

```
dara-studio/
├── public/
│   └── admin-portal/
│       └── index.html          ← cole o portal-dara-v4.html aqui (renomeado)
│
├── src/
│   ├── App.jsx                 ← arquivo gerado (roteamento principal)
│   ├── LandingPage.jsx         ← arquivo gerado (landing page pública)
│   ├── EstimateWizard.jsx      ← arquivo gerado (formulário de orçamento)
│   ├── main.jsx                ← entry point padrão do Vite (não alterar)
│   │
│   ├── admin/                  ← futura área do admin React
│   │   └── (migração futura do portal HTML para React)
│   │
│   └── portal/                 ← futura área do cliente React
│       └── (componentes do client portal)
│
└── vite.config.js
```

### main.jsx (não mude — padrão Vite)

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

---

## Mapa de Rotas

| URL               | Componente              | Acesso    | Descrição                              |
|-------------------|-------------------------|-----------|----------------------------------------|
| `/`               | `LandingPage`           | Público   | Hero page com CTAs                     |
| `/estimate`       | `EstimateWizard`        | Público   | Formulário de orçamento 9 etapas       |
| `/admin`          | `AdminRedirect`         | Bridge    | Redireciona para `portal-dara-v4.html` |
| `/portal`         | `ClientPortalPlaceholder` | Privado | Área do cliente (placeholder)          |

---

## Integração do Admin Portal (portal-dara-v4.html)

**Opção A — Sem migração (recomendada agora):**

1. Copie `portal-dara-v4.html` para `public/admin-portal/index.html`
2. O componente `AdminRedirect` (em `App.jsx`) já faz `window.location.replace("/admin-portal/index.html")`
3. O admin continua funcionando exatamente como antes — zero risco

**Opção B — Migração futura para React:**

```jsx
// Em App.jsx, substitua AdminRedirect por:
import AdminApp from './admin/AdminApp'
<Route path="/admin/*" element={<AdminApp />} />
```

---

## Fluxo do EstimateWizard (Step 9)

```
Usuário preenche 9 etapas
         ↓
Etapa 9: "Accept & Continue"
         ↓
  navigate("/portal")  ← useNavigate do react-router-dom
         ↓
ClientPortalPlaceholder (ou futuramente o portal real logado)

Etapa 9: "Save for Later"
         ↓
  alert() de confirmação (simula POST /api/save-estimate)
  → em produção: envia email com link + dispara lead para Admin
```

---

## Dependências necessárias

```bash
npm install react-router-dom
# Opcional (para animações):
npm install framer-motion
```

---

## Variáveis de ambiente sugeridas (`.env`)

```
VITE_API_URL=https://api.darastudio.com
VITE_ADMIN_PORTAL_URL=/admin-portal/index.html
VITE_GOOGLE_MAPS_KEY=sua_chave_aqui
```
