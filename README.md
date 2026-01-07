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

## Description

A modern, full-featured URL shortening web application built with React, TypeScript, Tailwind CSS, Redux Toolkit Query, and NestJS.


## Compile and run the project

Here's a polished **README.md** file for your project “Shortening Service” with clear instructions for setting up and running the full stack (backend, frontend):




## 📂 Project Structure

```

url-shortener-service/
├── backend/    # NestJS backend
├── frontend/       # Frontend React app

````

---

## 🛠 Prerequisites

- Node.js
- npm
- Docker & Docker Compose
- PostgresSql (optional if using Docker)

---

## ⚡ Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/tareqhasan382/url-shortener-service.git
cd url-shortener-service
````

### 2. Start Database

```bash
cd backend
docker-compose up -d
```

This will start a PostgresSql container with the required database.

---

### 3. Setup & Run Server

```bash
cd ../backend
cp .env.example .env   # Add your environment variables
npm install
npm run start:dev
```

The server will run at: `http://localhost:8000` (default)

---

### 4. Setup & Run Frontend

```bash
cd ../src
cp .env.example .env   # Add your frontend environment variables
npm install
npm run dev
```

The frontend will run at: `http://localhost:5173` (default Vite dev server)

---

## ⚙ Environment Variables

### Backend `.env`

```
# Postgres
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_PORT=5432
SHORT_URL_BASE=Server Base URL Here
# Prisma / NestJS
DATABASE_URL=postgresql:
# Authentication
SALT_ROUND=13
JWT_SECRET=
JWT_REFRESH_EXPIRES_IN=
JWT_EXPIRES_IN=
```

### Frontend `.env`

```
VITE_API_URL=http://localhost:8000
```

---

## 📦 Scripts

### Backend (server)

```bash
npm run start       # Start in production
npm run start:dev   # Start in development mode
npm run build       # Build the project
```

### Frontend (src)

```bash
npm run dev         # Start dev server
npm run build       # Build production files
npm run preview     # Preview production build
```

---

## 🧰 Features Implemented

### Frontend
* User Authentication: Secure login/register with JWT tokens
* Dashboard: Beautiful, responsive dashboard with real-time statistics
* URL Management: Create, view, copy, and delete shortened URLs
* Analytics: Track clicks and performance metrics
* Responsive Design: Fully responsive across all devices
* Modern UI: Clean, professional interface with Tailwind CSS

### Backend
* RESTful API: Fully documented API endpoints
* Authentication: JWT-based secure authentication
* Rate Limiting: URL creation limits per user tier
* Database: PostgreSQL with Prisma ORM
* Type Safety: Full TypeScript implementation

### Main Components
* Navbar - Responsive navigation with user menu
* Dashboard - Main dashboard with statistics
* URL Shortener - Form to create new short URLs
* URL Table - Manage existing URLs with search/filter
* Stats Cards - Display key metrics

### 📊 Performance Metrics
* Total URLs Created: Track per user
* Total Clicks: Overall click count
* Today's Activity: Real-time updates
* Top Performers: Most clicked URLs
* Usage Statistics: Tier-based limits
* Upgrade Alert - Notify users when reaching limits
---

## 🚀 Notes

* Make sure Docker is running before starting the database.
* Backend and frontend require their own `.env` files.
* Frontend communicates with backend via `VITE_API_URL`.

---

## 👨‍💻 Author

Tareq Hasan

---
