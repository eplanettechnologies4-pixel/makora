# MAKAURA BEAUTY BRAND MULTI-VENDOR MARKETPLACE
## Multi-Phase Engineering Roadmap & Implementation Milestones

> This document outlines the systematic engineering lifecycle of the Makaura multi-vendor beauty marketplace platform. Each phase represents an isolated, testable, and production-ready milestone.

---

## Roadmap Overview

```mermaid
gantt
    title Makaura Platform Development Lifecycle
    dateFormat  YYYY-MM-DD
    section Core Foundation
    Phase 1: Architecture & Monorepo Foundation :active, p1, 2026-11-01, 2026-11-03
    section Identity & Governance
    Phase 2: Authentication, RBAC & Brand Onboarding : p2, after p1, 7d
    section Catalog & Inventory
    Phase 3: Brand Dashboard & Product Lifecycle : p3, after p2, 8d
    section Consumer Experience
    Phase 4: Customer Marketplace & Unified Cart : p4, after p3, 8d
    section Financial Engine
    Phase 5: Multi-Brand Orders & Pure COD Tracking : p5, after p4, 8d
    Phase 6: Commission Splits & Bank Settlement Engine : p6, after p5, 7d
    section Scale & Hardening
    Phase 7: Reviews, Return Requests & Reports : p7, after p6, 6d
    Phase 8: Production VPS Deployment & Nginx Hardening : p8, after p7, 5d
```

---

## Phase 1 — Architecture & Monorepo Foundation (CURRENT)

**Objective**: Establish a bulletproof development foundation, containerized database, cache queues, robust types, and health telemetry.

- [x] Monorepo structure (`apps/web`, `apps/api`, `packages/shared`, `infrastructure`, `docs`).
- [x] Next.js 14 frontend setup with TypeScript and luxury pure CSS design system (Zero Tailwind).
- [x] NestJS 10 backend setup with TypeScript, Swagger OpenAPI, and configuration modules.
- [x] PostgreSQL 16 & Redis 7 orchestrated via Docker Compose.
- [x] Prisma ORM configuration with resilient connection handling.
- [x] Backend health-check endpoint (`/api/v1/health`, `/live`, `/ready`) probing DB and Redis status.
- [x] Frontend connected to backend via environment variables with a live infrastructure monitor.
- [x] Foundational database schema for `users`, `roles`, `permissions`, `brands`, `applications`, `banking`, `documents`, and `audit_logs`.
- [x] Complete environment templates (`.env.example`) and comprehensive `.gitignore`.
- [x] Architectural, Database, and Roadmap documentation.

---

## Phase 2 — Authentication, Authorization & Brand Onboarding

**Objective**: Implement secure authentication, granular RBAC, and a complete multi-step brand onboarding application flow.

- [ ] Customer registration and login with email verification.
- [ ] Brand Owner registration portal capturing:
  - Business details, brand name, story, and slug reservation.
  - Bank account details (Account name, Number, IBAN, Bank name).
  - Business verification documents (CNIC front/back, NTN certificate, Cheque leaf).
- [ ] Brand application state machine (`PENDING_APPROVAL`, `APPROVED`, `REJECTED`, `REQUIRES_INFO`).
- [ ] Marketplace Administrator review dashboard:
  - Document preview & verification.
  - Approve, reject, or request revisions.
- [ ] JWT authentication with access/refresh token rotation stored in HttpOnly secure cookies.
- [ ] NestJS RBAC Guards (`@Roles()`, `@Permissions()`, `@BrandOwnerGuard()`) protecting all endpoints.
- [ ] Complete ownership isolation preventing brand owners from viewing other brands' data.

---

## Phase 3 — Brand Portals & Product Catalog Lifecycle

**Objective**: Empower approved brand owners with catalog management, variant control, and approval workflows.

- [ ] Brand Owner Dashboard overview (analytics counters, order trends).
- [ ] Hierarchical Category & Collection management.
- [ ] Product CRUD interface for Brand Owners:
  - Multi-image upload via Storage Service abstraction.
  - Variant & SKU management (shade, fragrance volume, pack size).
  - Regular Price and Sale Price definition (Decimal precision).
  - Ingredients, instructions, specifications, and skin-type tags.
- [ ] Configurable product approval workflow (`DRAFT` -> `PENDING_APPROVAL` -> `APPROVED`).
- [ ] Real-time inventory tracking with safety stock alerts.
- [ ] Public Brand Storefront page (`/brands/[slug]`) rendering verified catalog and story.

---

## Phase 4 — Luxury Customer Marketplace Experience

**Objective**: Deliver a high-converting, luxury beauty shopping experience inspired by LAAM and Sephora.

- [ ] Dynamic homepage featuring curated departments, trending serums, and brand spotlights.
- [ ] Shop page with multi-facet filters:
  - Category, Brand, Price slider, Rating, and Stock availability.
- [ ] Instant search with debounced backend queries.
- [ ] Product detail page:
  - Image gallery with zoom, variant selector, ingredient spotlight, and delivery estimator.
- [ ] Persistent shopping cart supporting multi-brand items.
- [ ] Customer account portal:
  - Profile management, saved shipping addresses, order history, and wishlist.

---

## Phase 5 — Multi-Brand Orders & Pure Cash on Delivery (COD)

**Objective**: Execute single-checkout multi-brand order splitting and physical COD delivery management.

- [ ] Unified checkout process (Customer pays zero upfront; selects Cash on Delivery).
- [ ] Automatic decomposition of Parent Order into isolated `SellerOrder` entities per brand.
- [ ] Order fulfillment lifecycle (`PENDING` -> `ACCEPTED` -> `DISPATCHED` -> `DELIVERED`).
- [ ] Courier integration architecture (TCS, Leopards, Trax):
  - Consignment creation, tracking number assignment, and tracking webhook ingestion.
- [ ] COD Delivery collection tracking (`PENDING_DELIVERY` -> `COLLECTED_BY_COURIER`).
- [ ] Courier remittance module:
  - Admin records bulk courier remittance reference and received cash amount.
  - System automatically reconciles collected orders against courier remittance.

---

## Phase 6 — Commission Ledger & Brand Settlement Engine

**Objective**: Calculate marketplace commission splits and provide transparent brand settlement workflows.

- [ ] Configurable commission rules (default 10% or custom negotiated brand rates).
- [ ] Server-side financial ledger calculating Gross Subtotal, Commission Deduction, and Brand Net Payable.
- [ ] Settlement eligibility countdown:
  - Orders become eligible for settlement only after COD remittance has cleared AND settlement hold window (2–3 days) has elapsed.
- [ ] Brand Owner Earnings & Settlements dashboard displaying:
  - Total sales, deducted commissions, pending balance, and paid history.
- [ ] Admin Settlement Management module:
  - Aggregate eligible orders for a brand into a Settlement batch.
  - Admin transfers funds manually to the brand's verified bank account.
  - Admin records bank transaction reference, amount, and timestamp.
  - Settlement transitions to `PAID` with automated notification to brand owner.
- [ ] Immutable audit log recording every financial transition.

---

## Phase 7 — Post-Purchase, Returns, Reviews & Analytics

**Objective**: Build trust and retention through verified reviews, dispute resolution, and reports.

- [ ] Purchase-verified product reviews and star ratings.
- [ ] Return and exchange request workflow with eligibility validation.
- [ ] Comprehensive financial reports (CSV / Excel export of settlements and remittances).
- [ ] Notification system (in-app alerts and email notifications for order updates and payouts).
- [ ] BullMQ background jobs for automated settlement eligibility transitions and report generation.

---

## Phase 8 — VPS Production Deployment & Hardening

**Objective**: Deploy the complete platform to a Contabo Ubuntu VPS with SSL, caching, and backups.

- [ ] Contabo VPS provisioning and Docker Compose environment configuration.
- [ ] Nginx reverse proxy with SSL certificate automation via Let's Encrypt (Certbot).
- [ ] Automated PostgreSQL database daily backup scripts to local/remote storage.
- [ ] Rate limiting, CORS tightening, and security header enforcement.
- [ ] System logging and monitoring setup.
- [ ] Final end-to-end integration and smoke testing.
