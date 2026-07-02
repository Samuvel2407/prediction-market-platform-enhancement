# Prediction Market Platform Enhancement

<div align="center">

**A community-driven forecasting and prediction intelligence platform**

Developed and enhanced by **[Samuvel Joseph J](https://github.com/Samuvel2407)**

[![GitHub](https://img.shields.io/badge/GitHub-Samuvel2407-181717?style=flat&logo=github)](https://github.com/Samuvel2407)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Go](https://img.shields.io/badge/Go-1.22+-00ADD8?style=flat&logo=go)](https://go.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)](https://react.dev/)

</div>

---

> **Based on the open-source [SocialPredict](https://github.com/openpredictionmarkets/socialpredict) platform**, this project has been enhanced as a portfolio-grade engineering case study covering full-stack integration debugging, backend systems work, and UI/UX modernization.

---

## 📌 Project Overview

This platform aggregates collective intelligence to forecast future events. By utilizing an automated market maker (AMM) powered by the **Logarithmic Market Scoring Rule (LMSR)**, the platform allows users to trade YES/NO prediction contract shares — creating real-time probability estimates across politics, finance, technology, and more.

Users propose markets → Moderators audit → Admins publish → Community trades → Resolution distributes payouts. Every step is audited and backed by fair mathematical pricing.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📈 **Prediction Markets** | Real-time contract trading with instant AMM probability adjustments |
| 🧠 **Community Forecasting** | Propose → review → publish → resolve lifecycle with governance controls |
| 🔐 **Authentication** | Stateless JWT sessions, bcrypt passwords, enforced password-change flow |
| 🏆 **Leaderboards** | Rankings by portfolio balance and prediction accuracy |
| 📊 **Market Analytics** | Probability history charts, volume tracking, position view |
| 🛡️ **Admin Dashboard** | User management, market governance, CMS editor, social share settings |
| 🧩 **Market Groups** | Multiple-choice question markets via `MarketGroup` model |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 5, TailwindCSS 3, React Router v5 |
| **Charts** | Recharts, Chart.js, D3 |
| **Backend** | Go 1.22+, gorilla/mux, GORM ORM |
| **Database** | SQLite (development), PostgreSQL (production) |
| **Auth** | JWT (golang-jwt/jwt/v4), bcrypt |
| **Security** | CORS, CSP headers, rate limiting, XSS protection |
| **API Docs** | Swagger UI (`/swagger-ui/`) |

---

## 🔧 My Contributions

### 1. Frontend-Backend Integration Fixes
- Resolved cross-origin and connection reset issues in local development on Windows
- Configured Vite dev server proxy for `/v0` and `/api` paths to eliminate hardcoded absolute port references in API calls
- Implemented dynamic `VITE_API_PROXY_TARGET` env var support so the proxy target can be configured without code changes

### 2. Critical Bug Fixes

**`MarketsByStatusTable.jsx` — URL Constructor Crash**
```js
// Bug: new URL(path) throws when API_URL is empty/relative
// Fix: resolve against window.location.origin
const base = API_URL.startsWith('http') ? API_URL : window.location.origin;
const url = new URL(path, base);
```

**`LoginModal.jsx` — React Portal Error**
```js
// Bug: createPortal fails if #modal-root is absent from DOM
// Fix: dynamically create + append the container if missing
let portalTarget = document.getElementById('modal-root');
if (!portalTarget) {
  portalTarget = document.createElement('div');
  portalTarget.id = 'modal-root';
  document.body.appendChild(portalTarget);
}
```

### 3. Database & Backend Adaptations
- Added **SQLite support** to the Go backend (`SQLiteFactory` implementing `DBFactory`) — enabling local dev without Docker or PostgreSQL
- Fixed seeding logic with `Unscoped().Delete()` to cleanly re-seed `HomepageContent` without UNIQUE constraint failures
- Configured portable Go 1.22.5 toolchain and `.env.dev` for Windows-native operation

### 4. UI Modernization & Rebranding
- Custom fintech color palette: `#020617` (background) · `#2563EB` (primary blue) · `#06B6D4` (cyan accent)
- Modernized navbar, footer, about page, homepage content and browser metadata
- Consistent component spacing, hover transitions, and responsive layout improvements

### 5. Product Analysis
- Thorough UX evaluation covering user onboarding, discoverability, and layout improvements
- Proposed product enhancements: **MarketMind Score** reputation engine, **Prediction Journey Dashboard**, **Personalized Prediction Feeds**

---

## 🚀 Getting Started (Local Dev — No Docker Required)

### Prerequisites
- Node.js ≥ 18 (tested on 20.18.0)
- Go 1.22+ (or use the portable download below)

### 1. Clone the Repository
```bash
git clone https://github.com/Samuvel2407/prediction-market-platform-enhancement.git
cd prediction-market-platform-enhancement/socialpredict
```

### 2. Configure Backend Environment
Create `backend/.env.dev`:
```env
APP_ENV=development
DB_DIALECT=sqlite
DB_NAME=./socialpredict.db
ADMIN_PASSWORD=password
JWT_SIGNING_KEY=your_dev_signing_key_here
CORS_ALLOW_ORIGINS=http://localhost:5173
BACKEND_PORT=8080
STARTUP_WRITER=true
```

### 3. Run the Backend
```bash
cd backend
go run .
```
Server starts at **http://localhost:8080** · Swagger UI at **http://localhost:8080/swagger-ui/**

### 4. Run the Frontend
```bash
cd frontend
npm install
VITE_API_PROXY_TARGET=http://localhost:8080 npm run start
```
App available at **http://localhost:5173**

### 5. Default Login
| Username | Password |
|----------|----------|
| `admin` | `password` |

> ⚠️ Change the admin password immediately after first login.

---

## 📡 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Liveness probe |
| `GET` | `/readyz` | Readiness probe |
| `POST` | `/v0/login` | Authenticate user |
| `GET` | `/v0/markets` | List markets (paginated) |
| `GET` | `/v0/markets/{id}` | Market details |
| `POST` | `/v0/bet` | Place a bet (authenticated) |
| `POST` | `/v0/sell` | Sell a position (authenticated) |
| `GET` | `/v0/content/home` | Homepage CMS content |

Full API reference: [Swagger UI](http://localhost:8080/swagger-ui/) (when running locally)

---

## 🗂 Project Structure

```
socialpredict/
├── backend/
│   ├── handlers/        # HTTP handlers (markets, bets, users, CMS, admin)
│   ├── internal/
│   │   ├── app/         # Runtime config, DB factory, readiness
│   │   ├── domain/      # LMSR math, market/user domain logic
│   │   └── repository/  # Data access layer (GORM)
│   ├── migration/       # Versioned DB migrations (25+)
│   ├── models/          # GORM model definitions
│   ├── seed/            # DB seeding (admin user, homepage CMS)
│   └── server/          # HTTP router setup
└── frontend/
    └── src/
        ├── api/          # API client functions
        ├── components/   # Reusable UI components
        ├── pages/        # Route-level page components
        └── hooks/        # Custom React hooks
```

---

## 📄 License

This project is based on [SocialPredict](https://github.com/openpredictionmarkets/socialpredict) which is licensed under the [MIT License](LICENSE).

---

<div align="center">

**Developed by [Samuvel Joseph J](https://github.com/Samuvel2407)**  
*Prediction Market Platform Enhancement — A portfolio engineering project*

</div>
