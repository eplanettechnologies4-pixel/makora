# MAKAURA BEAUTY BRAND MULTI-VENDOR MARKETPLACE

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/Backend-NestJS%2010-red?logo=nestjs)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2016%20%7C%2017-blue?logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Cache%20%26%20Queues-Redis%207%20%7C%208-darkred?logo=redis)](https://redis.io/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-teal?logo=prisma)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Containers-Docker%20Compose-blue?logo=docker)](https://www.docker.com/)

A luxury multi-vendor beauty brand marketplace platform inspired by **LAAM**, **Nykaa**, and **Sephora**, built specifically for independent skincare, cosmetic, fragrance, and haircare brands.

---

## 🏛️ System Architecture & Technology Stack

| Layer | Technology | Key Highlights |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14, React 18, TypeScript | Custom pure CSS luxury design system (**Zero Tailwind**, zero Vercel dependencies), responsive, mobile-first |
| **Backend API** | NestJS 10, Node.js, TypeScript | Modular REST API, JWT authentication, RBAC guards, Swagger documentation |
| **Database** | PostgreSQL 16 / 17, Prisma ORM | Strictly normalized relational schema, `Decimal(12, 2)` monetary accuracy, UUID primary keys (Windows host: 17.7; Docker/VPS: `postgres:17-alpine`) |
| **Queue & Cache** | Redis 7 / 8, BullMQ | Asynchronous settlement eligibility processing, caching, background jobs (Windows host: 8.10; Docker/VPS: `redis:7-alpine`) |
| **Edge & Proxy** | Nginx Reverse Proxy | Production SSL termination, Gzip compression, rate limiting for Contabo VPS |
| **Storage Driver**| Storage Service Abstraction | Local filesystem driver for development; S3 / MinIO driver ready for VPS |

---

## 📁 Monorepo Folder Structure

```
makaura/
├── apps/
│   ├── web/                    # Next.js 14 Luxury Frontend (Storefront & Portals)
│   └── api/                    # NestJS REST API with Prisma ORM & Swagger
├── packages/
│   └── shared/                 # Shared TypeScript enums, DTOs, and contracts
├── infrastructure/             # Docker Compose & Nginx configuration
│   ├── docker-compose.yml      # Local dev PostgreSQL 16 & Redis 7 services
│   ├── docker-compose.prod.yml # Production VPS orchestration with Nginx
│   └── nginx/                  # Reverse proxy configurations
├── docs/                       # Technical architectural specifications
│   ├── ARCHITECTURE.md         # Multi-brand order splitting & COD state machine
│   ├── DATABASE_DESIGN.md      # Normalized schema & financial calculation rules
│   └── DEVELOPMENT_ROADMAP.md  # 8-Phase implementation milestones
├── .env.example                # Root environment variables template
├── .gitignore                  # Monorepo gitignore rules
└── package.json                # Root npm workspaces configuration
```

---

## 🚀 Quickstart Guide (Local Development on Windows)

### 1. Prerequisites
- **Node.js**: v20+ or v24+
- **npm**: v10+ or v11+
- **Docker Desktop** (Installed for containerized PostgreSQL and Redis)

---

### 2. Environment Configuration
Copy `.env.example` into root and the respective apps:

```powershell
# Copy environment template
Copy-Item .env.example .env
Copy-Item apps/api/.env.example apps/api/.env
Copy-Item apps/web/.env.example apps/web/.env.local
```

---

### 3. Start Database & Redis (Docker Compose)
Launch PostgreSQL 16 and Redis 7 in the background:

```powershell
npm run docker:up
```

*To check container logs or stop services:*
```powershell
npm run docker:logs
npm run docker:down
```

---

### 4. Install Dependencies & Build Shared Package
From the root directory:

```powershell
# Install all dependencies across all workspaces
npm install

# Build shared types & models
npm run build:shared

# Generate Prisma Client
npm run prisma:generate
```

---

### 5. Run the Applications

#### Option A: Run Both Frontend and Backend Concurrently
```powershell
npm run dev
```

#### Option B: Run Services Individually
```powershell
# Terminal 1: NestJS Backend API (Port 4000)
npm run dev:api

# Terminal 2: Next.js Frontend (Port 3000)
npm run dev:web
```

---

## 🌐 Local Access URLs

- **Customer Luxury Storefront**: [http://localhost:3000](http://localhost:3000)
- **Backend REST API**: [http://localhost:4000/api/v1](http://localhost:4000/api/v1)
- **Interactive Swagger OpenAPI Docs**: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)
- **Comprehensive Infrastructure Health Probe**: [http://localhost:4000/api/v1/health](http://localhost:4000/api/v1/health)
- **Liveness Probe**: [http://localhost:4000/api/v1/health/live](http://localhost:4000/api/v1/health/live)
- **Readiness Probe**: [http://localhost:4000/api/v1/health/ready](http://localhost:4000/api/v1/health/ready)

---

## 📚 Technical Documentation Directory

- **[System Architecture](docs/ARCHITECTURE.md)**: Multi-brand split order mechanics, COD remittance state machine, file storage abstraction, and RBAC isolation rules.
- **[Database Design](docs/DATABASE_DESIGN.md)**: Entity-Relationship diagram, PostgreSQL table specifications, Decimal precision standards, and indexing strategy.
- **[Development Roadmap](docs/DEVELOPMENT_ROADMAP.md)**: Phase 1 through Phase 8 implementation breakdown.

---

## 🛡️ Financial Integrity & Cash on Delivery Rules

1. **Pure Cash on Delivery (COD)**: No third-party payment gateways. All customer transactions are processed via COD.
2. **Delayed Settlement Countdown**: Brand payout countdowns (2–3 days) only begin **after** the courier company remits the collected cash to the marketplace account and the order passes the return window.
3. **Audit Trail**: Every financial transition, commission split, and manual bank transfer reference is logged immutably.
