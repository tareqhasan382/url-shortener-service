<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest
<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## 🖼️ Project Screenshots

<div align="center">

### Dashboard Preview
![URL Shortener Dashboard](https://github.com/tareqhasan382/url-shortener-service/blob/0a68b82f83695a678f893249b744290ea2e8b94e/preview.png)
[🖼️ View More Screenshots PDF](https://drive.google.com/file/d/1LlOzcFfA58MKH3ROdXRzIfazIBz1P_Nl/view?usp=sharing)

</div>

# 🔗 URL Shortener Service

A modern, full-featured URL shortening web application built with **React**, **TypeScript**, **Tailwind CSS**, **Redux Toolkit Query**, and **NestJS** — with Redis-powered caching and write-behind click tracking.

---

## 🖼️ Project Screenshots

> 📄 **[View More Screenshots PDF](#)**

---

## 📂 Project Structure

```
url-shortener-service/
├── backend/        # NestJS backend
└── frontend/       # React frontend
```

---

## 🛠 Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/)
- [Docker & Docker Compose](https://www.docker.com/)
- PostgreSQL *(optional — Docker handles this)*
- Redis *(optional — Docker handles this)*

---

## ⚡ Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/tareqhasan382/url-shortener-service.git
cd url-shortener-service
```

### 2. Start Database & Redis

```bash
cd backend
docker compose up -d
```

This starts both a **PostgreSQL** and **Redis** container.

Verify containers are running:

```bash
docker ps
```

You should see:
```
url-shortener-postgres   Up (healthy)
url-shortener-redis      Up (healthy)
```

### 3. Setup & Run Backend

```bash
cd backend
cp .env.example .env    # Fill in your environment variables
npm install
npx prisma migrate dev  # Run database migrations
npm run start:dev
```

Backend runs at: `http://localhost:8000`

### 4. Setup & Run Frontend

```bash
cd frontend
cp .env.example .env    # Fill in your environment variables
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## ⚙️ Environment Variables

### Backend `.env`

```dotenv
# PostgreSQL
POSTGRES_DB=url_shortener_service_db
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_PORT=5432

# Prisma
DATABASE_URL=postgresql://your_db_user:your_db_password@localhost:5434/url_shortener_service_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# App
SHORT_URL_BASE=http://localhost:8000

# Authentication
SALT_ROUND=13
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=604800
JWT_REFRESH_EXPIRES_IN=604800
```

### Frontend `.env`

```dotenv
VITE_API_URL=http://localhost:8000
```

---

## 🐳 Docker Compose

Both PostgreSQL and Redis are managed via Docker Compose:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: url-shortener-postgres
    ports:
      - "5434:5432"

  redis:
    image: redis:7-alpine
    container_name: url-shortener-redis
    command: redis-server --appendonly yes
    ports:
      - "6379:6379"
```

---

## 📦 Scripts

### Backend

```bash
npm run start           # Start in production
npm run start:dev       # Start in development (watch mode)
npm run build           # Build the project
npx prisma migrate dev  # Run migrations
npx prisma studio       # Open Prisma Studio (DB GUI)
```

### Frontend

```bash
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
```

---

## 🧰 Features

### Frontend
- **User Authentication** — Secure login/register with JWT tokens
- **Dashboard** — Responsive dashboard with real-time statistics
- **URL Management** — Create, view, copy, and delete shortened URLs
- **Analytics** — Track clicks and performance metrics
- **Responsive Design** — Fully responsive across all devices
- **Modern UI** — Clean, professional interface with Tailwind CSS

### Backend
- **RESTful API** — Fully documented API endpoints
- **JWT Authentication** — Access & refresh token support
- **Redis Caching** — Sub-millisecond redirect response
- **Write-Behind Click Tracking** — Atomic Redis buffering, batch Postgres update every 60s
- **Rate Limiting** — URL creation limits per user tier
- **PostgreSQL + Prisma ORM** — Type-safe database access
- **Full TypeScript** — End-to-end type safety

---

## 🏗️ Architecture & System Design

```
User clicks short URL
        │
        ▼
Redis cache hit? → YES → return originalUrl instantly (<1ms)
                → NO  → Postgres query → cache → return

Click count → Redis INCR (atomic, fire-and-forget)
           → Batch flush to Postgres every 60s

Analytics  → Postgres count + Redis pending buffer = real-time 
```

### Caching Strategy

| Key | TTL | Purpose |
|---|---|---|
| `redirect:{shortCode}` | 10 min | URL redirect hot path |
| `my-urls:{userId}:p{n}:l{n}` | 1 min | Paginated URL list |
| `click:pending:{shortCode}` | 1 hour | Unflushed click buffer |

### Performance

| Operation | Before | After |
|---|---|---|
| Redirect | ~5ms (DB query) | ~0.5ms (Redis hit) |
| Click write | 1 DB write/click | 0 DB writes/click |
| DB update | Every click | Batch every 60s |
| Analytics | 7 separate queries | 1 transaction + Redis merge |

---

## 📊 Analytics Metrics

- **Total URLs Created** — Per user tracking
- **Total Clicks** — Overall click count (real-time)
- **Today's Activity** — Clicks today
- **Weekly Growth** — This week vs last week comparison
- **Top Performer** — Most clicked URL this week
- **Usage Statistics** — Tier-based URL limits

---

## 🚀 Notes

- Make sure **Docker Desktop is running** before `docker compose up -d`
- Backend and frontend each require their own `.env` file
- Frontend communicates with backend via `VITE_API_URL`
- Redis uses **append-only persistence** — click data survives container restarts
- On first run, always do `npx prisma migrate dev` before starting the server

---

## 👨‍💻 Author

**Tareq Hasan**
- GitHub: [@tareqhasan382](https://github.com/tareqhasan382)