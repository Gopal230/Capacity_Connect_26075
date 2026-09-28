# CAPACITY CONNECT — Operational Capacity Building Portal

> **Digital Capacity Building, Operational Readiness & Knowledge Continuity Platform**  
> *Developed for the India Meteorological Department (IMD) / Ministry of Earth Sciences (MoES)*

---

## Overview

**CAPACITY CONNECT** is a specialized enterprise learning and operational capacity platform designed to transition organizations from mere *course completion* to **verifiable frontline capability**. 

Unlike conventional Learning Management Systems (LMS) that only track attendance and quiz completions, CAPACITY CONNECT integrates:
- **Role-Based Competency Gap Identification**
- **Explainable Trainer & Course Recommendation**
- **Operational Scenario Simulations**
- **Trainer-Verified Practical Work Evidence**
- **Real-Time Operational Readiness Index (ORI)**
- **Institutional Knowledge Continuity & Succession Risk Safeguards**

---

## System Architecture & Tech Stack

```text
┌────────────────────────────────────────────────────────┐
│                   CAPACITY CONNECT UI                  │
│       React 18  ·  TypeScript  ·  Tailwind CSS         │
│          Vite 6  ·  React Router v7  ·  Recharts       │
└───────────────────────────┬────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
   ┌──────────────────────┐    ┌──────────────────────┐
   │ Offline / Field Mode │    │ Enterprise Backend   │
   │ Local Storage Engine │    │ PostgreSQL + REST API│
   │  & Seed Data Store   │    │ (schema.sql contract)│
   └──────────────────────┘    └──────────────────────┘
```

- **Frontend Core**: React 18 with TypeScript for robust end-to-end type safety.
- **Styling & Design System**: Tailwind CSS with custom meteorological operational theme (deep forecast blue, atmospheric cyan, and high-readiness emerald).
- **Visualization**: Recharts for dynamic competency radar charts, department heatmaps, and readiness gauges.
- **Data Engine**: Client-side storage layer enabling full zero-backend evaluation, paired with a production-ready PostgreSQL relational schema (`database/schema.sql`).
- **PWA Ready**: Offline-capable web manifest for mobile and field tablet deployment.

---

## Core Capabilities

### 1. Operational Readiness Index (ORI)
Evaluates frontline personnel using a multi-signal algorithmic readiness score:
- **Role Competency Baseline** (30%)
- **Course & Module Completion** (15%)
- **Summative Assessment Performance** (25%)
- **Trainer-Verified Operational Evidence** (15%)
- **Scenario Lab Decision Results** (15%)

### 2. Multi-Gated Competency Verification
A credential or certificate is only granted once all three criteria are met:
1. Complete all course syllabus modules.
2. Pass objective knowledge examinations.
3. Submit operational evidence (case analysis, model diagnostics, or dataset validation) verified and scored by an accredited trainer.

### 3. Operational Scenario Lab
Interactive simulations placing personnel in realistic operational environments (e.g., severe convective storm nowcasting, cyclone warning dissemination, climate data QC).

### 4. Explainable Matching Engine
Multi-criteria matching algorithm providing transparent scoring breakdowns based on competency deficit, trainer qualification level, administrative verification, and availability.

### 5. Knowledge Continuity Vault
Institutional memory repository protecting tacit expert knowledge from departure risk, categorized by mission criticality and successor exposure.

### 6. Low-Bandwidth / Field Station Mode
A streamlined UI toggle designed specifically for low-connectivity coastal observatories and remote radar stations.

---

## Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation & Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to access the portal.

### Production Build & Preview

```bash
# Type check and generate production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Role Access Profiles

The system comes pre-configured with operational stakeholder profiles:

| Role | Default Email | Password | Primary Functions |
|---|---|---|---|
| **Administrator** | `admin@capacityconnect.in` | `Demo@123` | User approvals, trainer accreditation, course publishing, Readiness Command Center |
| **Trainer** | `trainer@capacityconnect.in` | `Demo@123` | Course authoring, media library ingestion, trainee evaluations, evidence sign-off |
| **Trainee** | `trainee@capacityconnect.in` | `Demo@123` | Competency assessment, learning pathways, scenario lab, Capability Passport |

*Self-registration is available on the `/register` route; new accounts are routed to the Admin Approval queue.*

---

## Documentation Links

- [System Architecture & Route Structure](file:///docs/APP_STRUCTURE.md)
- [Capability Framework & Principles](file:///docs/CAPABILITY_FRAMEWORK.md)
- [System Feature Matrix](file:///docs/FEATURE_MATRIX.md)
- [REST API Contract](file:///docs/API_CONTRACT.md)
- [PostgreSQL Database Schema](file:///database/schema.sql)

---

## License & Attribution

Developed for official deployment under the India Meteorological Department (IMD) / Ministry of Earth Sciences (MoES).
