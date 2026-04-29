# DARA Studio

Full-stack application for architectural design estimation and client management.

## Architecture

```
DARA Studio - Portal/
├── client/          ← Vite + React (frontend)
│   ├── src/
│   │   ├── App.jsx           ← Router principal
│   │   ├── index.css         ← Design system global
│   │   └── pages/
│   │       ├── LandingPage.jsx
│   │       ├── EstimateWizard.jsx
│   │       ├── NotFound.jsx
│   │       ├── PortalPlaceholder.jsx
│   │       └── estimate/     ← Wizard internals
│   │           ├── constants.js
│   │           ├── components.jsx
│   │           ├── StepsA.jsx (Steps 1-5)
│   │           └── StepsB.jsx (Steps 6-9)
│   └── public/admin-portal/  ← Portal admin HTML standalone
│
├── server/          ← Node.js Express (backend)
│   ├── server.js    ← API email relay
│   ├── test-email.js
│   └── .env.example
│
└── _archive/        ← Old files for reference
```

## Quick Start

### Frontend (Vite + React)

```bash
cd client
npm install
npm run dev
# → http://localhost:5173
```

### Backend (Email Server)

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your Gmail credentials
node server.js
# → http://localhost:5000
```

## Routes

| URL | Component | Access |
|-----|-----------|--------|
| `/` | LandingPage | Public |
| `/estimate` | EstimateWizard | Public |
| `/admin` | Redirect → HTML portal | Admin |
| `/portal` | PortalPlaceholder | Client |

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/leads` | Save estimate for later |
| POST | `/api/accept` | Accept estimate |
| GET | `/health` | Health check |
