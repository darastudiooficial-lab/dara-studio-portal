# DARA Studio — Reestruturação do Projeto

## Contexto

O projeto DARA Studio foi construído de forma incremental no Claude e está atualmente **fragmentado**: múltiplas versões de arquivos HTML monolíticos (~850KB cada), componentes JSX soltos, um server Node.js, e pastas duplicadas. O objetivo é criar um projeto **Vite + React limpo e unificado** a partir do qual podemos continuar desenvolvendo.

## Diagnóstico — O que existe hoje

### Arquivos Úteis (serão aproveitados)
| Arquivo | O que é | Status |
|---------|---------|--------|
| `App.jsx` | Roteamento principal React Router | ✅ Funcional, bem estruturado |
| `LandingPage.jsx` | Landing page pública (dark premium) | ✅ Funcional, design completo |
| `EstimateWizard.jsx` | Formulário 9 etapas com pricing engine | ✅ ~1050 linhas, Steps 1-3, 6-8 implementados, Steps 4,5 são placeholders |
| `server.js` | Express + Nodemailer email relay | ✅ Funcional (API /api/leads, /api/accept) |
| `project-structure.md` | Documentação da estrutura | ✅ Guia de referência |

### Arquivos HTML Monolíticos (referência de design, NÃO serão usados diretamente)
| Arquivo | Tamanho | Conteúdo |
|---------|---------|----------|
| `estrutura_do_site.txt` | 857KB | HTML monolítico completo com CSS+JS inline (inclui PORTAL admin em Base64!) |
| `dara-studio-unified.html` / `v1` / `v2` | ~854KB | Versões do site unificado HTML puro |
| `portal-dara-v4.html` | 504KB | Admin Portal HTML standalone (o mais completo) |
| `portal-dara-v3.html` | 103KB | Versão anterior do portal |
| `portal-dara-final.html` | 65KB | Outra versão do portal |
| `dara-studio-public.html` | 48KB | Landing + Estimate em HTML puro |

### Duplicatas e Lixo
- `files/` e `files (1)/` — **cópias exatas** dos mesmos arquivos da raiz
- `files.zip` e `files (1).zip` — ZIPs dessas cópias
- `server - v2.js` — cópia do `server.js`
- `Novo(a) Documento de Texto.txt` / `1.txt` — notas rápidas
- `CLAUDE DARA STUDIO - Antigo/` — pasta com versões antigas + dossiês + imagens do Gemini

### Package.json Atual
Apenas para o email server Node.js (`dara-email-server`). **Não tem React/Vite configurado.**

---

## Problemas Identificados

1. **Sem projeto Vite/React**: Os arquivos JSX existem soltos, sem `vite.config.js`, sem `index.html`, sem `main.jsx`
2. **CSS inline nos componentes**: LandingPage e EstimateWizard têm CSS como strings JS (`<style>{css}</style>`), funcional mas não ideal
3. **Steps 4 e 5 do EstimateWizard são placeholders**: Scope e Services mostram "🔧 Placeholder"
4. **Nenhum sistema de design centralizado**: Cada componente reimplementa tokens CSS
5. **Portal Admin é HTML puro**: ~500KB de HTML/CSS/JS inline, não é React
6. **Sem autenticação**: Client Portal é um placeholder
7. **Sem `.env` / `.gitignore`**
8. **Backend e Frontend misturados na mesma pasta**

---

## Proposta — Nova Estrutura

> [!IMPORTANT]
> O projeto será dividido em **duas pastas separadas**: `client/` (Vite + React) e `server/` (Node.js Express). Isso permite desenvolvimento e deploy independentes.

```
DARA Studio - Portal/
├── client/                          ← Vite + React (frontend)
│   ├── index.html                   ← Entry point HTML
│   ├── vite.config.js
│   ├── package.json
│   ├── public/
│   │   └── admin-portal/
│   │       └── index.html           ← portal-dara-v4.html (referência futura)
│   └── src/
│       ├── main.jsx                 ← React entry
│       ├── App.jsx                  ← Router principal
│       ├── index.css                ← Design system global
│       ├── pages/
│       │   ├── LandingPage.jsx      ← Página pública
│       │   ├── EstimateWizard.jsx   ← Formulário completo
│       │   ├── NotFound.jsx         ← 404
│       │   └── PortalPlaceholder.jsx← Placeholder client portal
│       └── components/
│           ├── Stepper.jsx
│           ├── Sidebar.jsx
│           ├── Counter.jsx
│           └── ... (extraídos do EstimateWizard)
│
├── server/                          ← Node.js Express (backend)
│   ├── package.json
│   ├── server.js
│   ├── .env.example
│   └── test-email.js
│
├── _archive/                        ← Todos os arquivos antigos (referência)
│   ├── *.html
│   ├── files/
│   └── CLAUDE DARA STUDIO - Antigo/
│
└── README.md                        ← Documentação do projeto
```

---

## Proposed Changes

### 1. Frontend — Vite + React (`client/`)

#### [NEW] `client/package.json`
- Configuração Vite + React com dependências: `react`, `react-dom`, `react-router-dom`
- Scripts: `dev`, `build`, `preview`

#### [NEW] `client/vite.config.js`
- Configuração com proxy para o backend (`/api` → `localhost:5000`)

#### [NEW] `client/index.html`
- HTML entry point para Vite com fontes Google (Instrument Serif, DM Sans, DM Mono)

#### [NEW] `client/src/main.jsx`
- React 18 createRoot + StrictMode

#### [NEW] `client/src/index.css`
- **Design system unificado** extraído dos componentes existentes
- Tokens CSS (cores, fontes, raios, espaçamentos)
- Classes utilitárias comuns (inputs, buttons, cards, stepper, etc.)
- Animações e keyframes
- Scrollbar styling, responsividade

#### [MODIFY] `client/src/App.jsx`
- Baseado no `App.jsx` existente
- Imports ajustados para a nova estrutura de pastas
- Rotas mantidas: `/`, `/estimate`, `/admin`, `/portal`

#### [MODIFY] `client/src/pages/LandingPage.jsx`
- Baseado no `LandingPage.jsx` existente
- CSS inline removido → usa `index.css`
- Funcionalidade mantida intacta

#### [MODIFY] `client/src/pages/EstimateWizard.jsx`
- Baseado no `EstimateWizard.jsx` existente
- CSS inline removido → usa `index.css`
- Steps 4 (Scope) e 5 (Services) implementados com conteúdo real
- Sub-componentes extraídos para `components/`

#### [NEW] `client/src/pages/NotFound.jsx`
- Extraído do `App.jsx` atual

#### [NEW] `client/src/pages/PortalPlaceholder.jsx`
- Extraído do `App.jsx` atual

---

### 2. Backend — Node.js (`server/`)

#### [MOVE] `server/server.js`
- Mover `server.js` atual para `server/server.js`
- Remover servir HTML estático (o frontend agora é Vite)
- Manter APIs: `POST /api/leads`, `POST /api/accept`, `GET /health`
- Adicionar CORS para `localhost:5173` (porta padrão do Vite)

#### [MOVE] `server/package.json`
- Mover `package.json` atual (que é do email server)

#### [NEW] `server/.env.example`
- Template das variáveis de ambiente

---

### 3. Organização

#### [NEW] `_archive/`
- Mover TODOS os HTMLs, ZIPs, pastas duplicadas, e arquivos antigos para cá
- Servem como referência de design do portal admin

#### [NEW] `README.md`
- Instruções de setup, rotas, arquitetura

---

## Open Questions

> [!IMPORTANT]
> **Steps 4 e 5 do EstimateWizard**: Esses são "Scope" e "Services". No código atual são placeholders. Devo:
> - **(A)** Implementar com conteúdo baseado no que vejo nos HTMLs monolíticos (seleção de serviços como Drafting, 3D Rendering, Permit Drawings, etc.)
> - **(B)** Deixar como placeholders melhorados com a nova UI
> 
> **Recomendo opção A** — implementar usando o contexto disponível nos outros arquivos.

> [!NOTE]
> **Portal Admin (portal-dara-v4.html)**: Esse arquivo de 500KB é um sistema completo de admin portal em HTML/CSS/JS vanilla. A migração para React é um **projeto separado e grande**. Por enquanto, manteremos a estratégia de redirect (Opção A do `project-structure.md`). Posso copiá-lo para `public/admin-portal/` mas ele não será modificado agora.

> [!NOTE]
> **Arquivos antigos**: Posso mover tudo para `_archive/` ou vocẽ prefere que eu delete alguma coisa? Recomendo manter tudo como referência por enquanto.

---

## Verification Plan

### Automated Tests
1. `cd client && npm install` — Deve instalar sem erros
2. `cd client && npm run dev` — Dev server inicia em `localhost:5173`
3. Navegar para `/` — Landing Page renderiza
4. Navegar para `/estimate` — EstimateWizard carrega com stepper
5. Navegar para `/portal` — Placeholder aparece
6. Navegar para `/xyz` — 404 aparece
7. `cd server && npm install && node server.js` — (requer `.env` configurado)

### Manual Verification
- Validar que o design da Landing Page está idêntico ao original
- Validar que o EstimateWizard mantém toda a funcionalidade existente
- Confirmar que o pricing engine continua calculando corretamente
