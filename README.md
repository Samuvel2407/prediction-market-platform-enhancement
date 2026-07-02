# Prediction Market Platform Enhancement

<div align="center">

**A community-driven forecasting and prediction intelligence platform**

Engineered and enhanced by **[Samuvel Joseph J](https://github.com/Samuvel2407)**

[![GitHub](https://img.shields.io/badge/GitHub-Samuvel2407-181717?style=flat&logo=github)](https://github.com/Samuvel2407)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Based on SocialPredict](https://img.shields.io/badge/Based%20on-SocialPredict-0ea5e9?style=flat)](https://github.com/openpredictionmarkets/socialpredict)
[![Go](https://img.shields.io/badge/Go-1.22+-00ADD8?style=flat&logo=go)](https://go.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)](https://react.dev/)

</div>

---

> [!IMPORTANT]
> **This project is based on the open-source [SocialPredict](https://github.com/openpredictionmarkets/socialpredict) platform** by [Open Prediction Markets](https://github.com/openpredictionmarkets), licensed under the [MIT License](LICENSE). This repository represents the engineering, debugging, product analysis, and enhancement work completed by **Samuvel Joseph J** as a portfolio case study. The original copyright and license notices are preserved in full.

---

## 🏛 Project Origin

| Field | Detail |
|-------|--------|
| **Original Project** | [SocialPredict](https://github.com/openpredictionmarkets/socialpredict) |
| **Original Authors** | [Open Prediction Markets](https://github.com/openpredictionmarkets) |
| **Original License** | MIT License — Copyright (c) 2024 Open Prediction Markets |
| **Original Repo** | https://github.com/openpredictionmarkets/socialpredict |
| **Fork / Enhancement By** | [Samuvel Joseph J](https://github.com/Samuvel2407) |
| **Enhancement Type** | Engineering case study, bug fixes, UI modernization, product analysis |

SocialPredict is an open-source prediction market engine that implements the **Logarithmic Market Scoring Rule (LMSR)** for automated market making. This repository takes the upstream codebase as a foundation and extends it with the engineering and product work documented below.

---

## 📌 Project Overview

This platform aggregates collective intelligence to forecast future events. An automated market maker (AMM) powered by **LMSR** lets users trade YES/NO prediction contract shares, generating real-time probability estimates across politics, finance, technology, and more.

```
Users propose markets → Moderators audit → Admins publish → Community trades → Resolution distributes payouts
```

Every step is audited and backed by deterministic mathematical pricing.

---

## ✨ Platform Features

| Feature | Description |
|---------|-------------|
| 📈 **Prediction Markets** | Real-time contract trading with instant AMM probability adjustments |
| 🧠 **Community Forecasting** | Propose → review → publish → resolve lifecycle with governance controls |
| 🔐 **Authentication** | Stateless JWT sessions, bcrypt password hashing, enforced password-change flow |
| 🏆 **Leaderboards** | Rankings by portfolio balance and prediction accuracy |
| 📊 **Market Analytics** | Probability history charts, volume tracking, per-user position views |
| 🛡️ **Admin Dashboard** | User management, market governance, CMS editor, social share metadata |
| 🧩 **Market Groups** | Multiple-choice question markets via the `MarketGroup` model |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 5, TailwindCSS 3, React Router v5 |
| **Charts** | Recharts, Chart.js, D3 |
| **Backend** | Go 1.22+, gorilla/mux, GORM ORM |
| **Database** | SQLite (development), PostgreSQL (production) |
| **Auth** | JWT (`golang-jwt/jwt/v4`), bcrypt |
| **Security** | CORS, CSP headers, rate limiting (`golang.org/x/time`), XSS protection |
| **API Docs** | Swagger UI at `/swagger-ui/` |

---

## 🔧 My Contributions

This section documents the specific engineering, debugging, and product work completed by Samuvel Joseph J on top of the upstream SocialPredict codebase.

### 1. Critical Bug Fixes

#### `MarketsByStatusTable.jsx` — URL Constructor Crash
**Problem**: The upstream codebase set `API_URL = 'http://localhost'` in `config.js`. When this was corrected to an empty string `''` to enable Vite proxy routing, the `new URL(path)` call in `MarketsByStatusTable.jsx` threw `TypeError: Failed to construct 'URL': Invalid URL` because the `URL` constructor rejects relative paths without a base.

**Fix applied** in [`frontend/src/components/tables/MarketsByStatusTable.jsx`](frontend/src/components/tables/MarketsByStatusTable.jsx):
```js
// Before: crashed with relative API_URL
const url = new URL(`${API_URL}${path}`);

// After: falls back to window.location.origin when API_URL is relative/empty
const base = API_URL && API_URL.startsWith('http') ? API_URL : window.location.origin;
const url = new URL(path, base);
```

#### `LoginModal.jsx` — React Portal DOM Error
**Problem**: The login modal used `ReactDOM.createPortal()` targeting `#modal-root`. This element was absent from `index.html`, causing `Uncaught Error: Target container is not a DOM element`.

**Fix applied** in [`frontend/src/components/modals/login/LoginModal.jsx`](frontend/src/components/modals/login/LoginModal.jsx):
```js
// Before: hard-failed if #modal-root was missing
return ReactDOM.createPortal(<Modal />, document.getElementById('modal-root'));

// After: creates the mount point dynamically if absent
let portalTarget = document.getElementById('modal-root');
if (!portalTarget) {
  portalTarget = document.createElement('div');
  portalTarget.id = 'modal-root';
  document.body.appendChild(portalTarget);
}
return ReactDOM.createPortal(<Modal />, portalTarget);
```

---

### 2. Frontend-Backend Integration Fixes

**Problem**: Frontend API calls were being routed to `http://localhost` (port 80) instead of the backend at port 8080 because `API_URL` defaulted to `'http://localhost'` in [`frontend/src/config.js`](frontend/src/config.js).

**Fixes applied**:
- Changed `API_URL` default from `'http://localhost'` → `''` (empty string) to make all API calls relative, letting the Vite dev server proxy handle routing
- Configured the `/v0` path in [`frontend/vite.config.mjs`](frontend/vite.config.mjs) to proxy to the backend via `VITE_API_PROXY_TARGET` environment variable
- This eliminates hardcoded absolute port references and makes the setup portable across environments

---

### 3. Backend: SQLite Support (No Docker Required)

**Problem**: The upstream project requires PostgreSQL running inside Docker. Docker was unavailable in the target development environment (Windows, no admin access for Docker Desktop).

**Fix applied** — added SQLite dialect support to [`backend/internal/app/runtime/db.go`](backend/internal/app/runtime/db.go) and [`backend/main.go`](backend/main.go):

```go
// Added SQLiteFactory implementing the DBFactory interface
type SQLiteFactory struct{ DSN string }

func (f SQLiteFactory) Open() (*gorm.DB, error) {
    return gorm.Open(sqlite.Open(f.DSN), &gorm.Config{})
}

// main.go: select factory based on DB_DIALECT env var
switch os.Getenv("DB_DIALECT") {
case "sqlite":
    factory = db.SQLiteFactory{DSN: os.Getenv("DB_NAME")}
default:
    factory = db.PostgresFactory{...}
}
```

**Impact**: The entire Go backend now runs natively on Windows without Docker or PostgreSQL. The SQLite dependency (`github.com/glebarez/sqlite`) was already present in the upstream project for testing — this change promotes it to a first-class development dialect.

---

### 4. Database Seeding Fix

**Problem**: The `SeedHomepage` function in [`backend/seed/seed.go`](backend/seed/seed.go) failed on restart with `UNIQUE constraint failed: homepage_contents.slug` because it tried to insert a record that already existed.

**Fix applied**:
```go
// Before: INSERT failed if slug already existed
db.Create(&HomepageContent{...})

// After: delete the existing record first (Unscoped avoids soft-delete)
db.Unscoped().Where("slug = ?", slug).Delete(&HomepageContent{})
db.Create(&HomepageContent{...})
```

---

### 5. UI Modernization & Rebranding

**Changes applied**:
- **Color palette overhaul** in [`frontend/tailwind.config.js`](frontend/tailwind.config.js) — replaced the original purple/pink theme with a fintech-grade palette:
  - Background: `#020617` (slate-950 — premium dark)
  - Primary actions: `#2563EB` (blue-600 — Stripe/TradingView style)
  - Accent: `#06B6D4` (cyan-500)
  - Success: `#10B981` (emerald-500), Danger: `#EF4444` (red-500)
- **Navbar & Sidebar** ([`Sidebar.jsx`](frontend/src/components/sidebar/Sidebar.jsx)) — updated logo text, developer credit, and GitHub link
- **About page** ([`About.jsx`](frontend/src/pages/about/About.jsx)) — rewritten with technical architecture overview, prediction market primer, and full open-source attribution
- **Browser metadata** ([`index.html`](frontend/index.html), [`useDocumentMeta.js`](frontend/src/hooks/useDocumentMeta.js)) — updated `<title>`, `<meta description>`, and OpenGraph tags
- **Homepage CMS content** ([`backend/seed/home.md`](backend/seed/home.md)) — rewritten landing page template with portfolio-appropriate messaging

---

### 6. Product Analysis & Enhancement Proposals

A UX and product evaluation was conducted covering:

| Area | Finding & Proposal |
|------|--------------------|
| **Onboarding** | No guided tour for new users; proposed a "first prediction" wizard |
| **Discoverability** | Market discovery relies on tags only; proposed a **Personalized Prediction Feed** with ML relevance scoring |
| **Engagement** | No streak or consistency tracking; proposed **Prediction Journey Dashboard** with daily challenges |
| **Reputation** | Balance-only leaderboard misses accuracy; proposed **MarketMind Score** combining accuracy, volume, and Brier score |
| **Mobile UX** | Sidebar layout collapses poorly on small screens; documented specific component fixes |

---

## 🚀 Getting Started — Local Dev (No Docker Required)

### Prerequisites
- Node.js ≥ 18 (tested on v20.18.0)
- Go 1.22+ (or download the portable binary from [go.dev/dl](https://go.dev/dl/))

### 1. Clone the Repository
```bash
git clone https://github.com/Samuvel2407/prediction-market-platform-enhancement.git
cd prediction-market-platform-enhancement/socialpredict
```

### 2. Configure the Backend
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
# Server: http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui/
```

### 4. Run the Frontend
```bash
cd frontend
npm install
VITE_API_PROXY_TARGET=http://localhost:8080 npm run start
# App: http://localhost:5173
```

### 5. Login
| Username | Password | Notes |
|----------|----------|-------|
| `admin` | `password` | Change immediately after first login |

---

## 📡 API Reference

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/health` | — | Liveness probe |
| `GET` | `/readyz` | — | Readiness probe |
| `POST` | `/v0/login` | — | Authenticate, returns JWT |
| `GET` | `/v0/markets` | — | List markets (paginated) |
| `GET` | `/v0/markets/{id}` | — | Market details + probability |
| `GET` | `/v0/markets/{id}/bets` | — | Bet history for a market |
| `GET` | `/v0/content/home` | — | Homepage CMS content |
| `POST` | `/v0/bet` | JWT | Place a bet |
| `POST` | `/v0/sell` | JWT | Sell a position |
| `POST` | `/v0/sell/quote` | JWT | Get sell price quote |
| `POST` | `/v0/markets` | JWT (mod) | Propose a new market |
| `PATCH` | `/v0/admin/markets/{id}/approve` | JWT (admin) | Approve proposed market |
| `PUT` | `/v0/admin/content/home` | JWT (admin) | Update homepage CMS |

Full interactive reference: [Swagger UI](http://localhost:8080/swagger-ui/) (requires running backend)

---

## 🗂 Project Structure

```
socialpredict/
├── backend/
│   ├── handlers/        # HTTP handlers (markets, bets, users, CMS, admin)
│   ├── internal/
│   │   ├── app/         # Runtime config, DB factory, readiness probes
│   │   ├── domain/      # LMSR math, market/user business logic
│   │   └── repository/  # Data access layer (GORM)
│   ├── migration/       # Versioned DB migrations (25+ migrations)
│   ├── models/          # GORM model definitions
│   ├── seed/            # DB seeding (admin user, homepage CMS)
│   └── server/          # HTTP router setup (gorilla/mux)
└── frontend/
    └── src/
        ├── api/          # API client functions
        ├── components/   # Reusable UI components
        ├── pages/        # Route-level page components
        └── hooks/        # Custom React hooks
```

---

## 📄 License & Attribution

This repository is a derivative work of [SocialPredict](https://github.com/openpredictionmarkets/socialpredict).

```
MIT License

Copyright (c) 2024 Open Prediction Markets

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

The full license text is in the [LICENSE](LICENSE) file. The original copyright holder is **Open Prediction Markets**. This portfolio fork preserves the MIT license and all upstream attribution in compliance with the license terms.

---

<div align="center">

**Engineered by [Samuvel Joseph J](https://github.com/Samuvel2407)**  
*Prediction Market Platform Enhancement — A portfolio engineering case study*  
*Based on [SocialPredict](https://github.com/openpredictionmarkets/socialpredict) by Open Prediction Markets (MIT License)*

</div>
