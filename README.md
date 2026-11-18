<div align="center">

# 🎓 Earnest (`E.`)
### *Your Skills. Your Work. Your Earnings.*

**India's Premier University Student Micro-Freelancing & Academic Tracking Platform**

[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Compliance](https://img.shields.io/badge/AICTE%20%26%20UGC-Aligned-245747?style=for-the-badge&logo=google-classroom&logoColor=white)](#-academic-safeguards-engine)

<br />

[Live Demo](https://github.com/kanusheoran/earn-est) • [Features](#-three-connected-campus-portals) • [Academic Safeguards](#-academic-safeguards-engine) • [Quick Start](#-quick-start) • [Personas](#-default-test-personas)

</div>

---

## 📖 Overview

**Earnest** is a modern, tripartite campus ecosystem designed to empower university students in India to take on paid, verified micro-freelancing projects with top industry enterprises — while strictly protecting their academic standing.

Traditional freelancing often leads to student burnout, lecture absenteeism, and falling grades. Earnest solves this through **automated academic safeguards**, enforcing work hour ceilings, minimum CGPA thresholds, and mandatory exam blackouts with faculty audit certification.

---

## 🛡️ Academic Safeguards Engine

Earnest prioritizes education over work with four automated guardrails:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      EARNEST SAFEGUARD ARCHITECTURE                    │
├─────────────────────┬─────────────────────┬────────────────────────────┤
│ ⏱️ 20-Hour Monthly  │ 🎓 7.0 CGPA Cutoff  │ 📚 Exam Blackout Periods   │
│    Work Ceiling     │    Benchmark        │    (Automatic Work Freeze) │
├─────────────────────┴─────────────────────┴────────────────────────────┤
│ 💳 Pre-Funded Escrow  ➔  Faculty Audit Gateway  ➔  Direct UPI Release   │
└────────────────────────────────────────────────────────────────────────┘
```

1. **⏱️ 20-Hour Monthly Ceiling**: Automatically caps work at 20 hours per calendar month (~5 hours/week). Once reached, applications freeze until the next month.
2. **🎓 7.0 CGPA Minimum Threshold**: Based on the 10-point Indian university grading scale. If a student's semester CGPA drops below 7.0, an *Academic Recovery Hold* is automatically applied.
3. **📚 Exam Blackout Windows**: Application submissions and project deliverables automatically pause 14 days before mid-semester and end-semester finals.
4. **🏛️ Faculty Audit Gateway**: Enterprise stipends are pre-funded into escrow. University coordinators must audit and sign off on completed deliverables before INR funds are released to student UPI / bank accounts.

---

## 🏛️ Three Connected Campus Portals

Earnest keeps student, university coordinator, and enterprise partner workflows cleanly separated with dedicated role-based consoles:

### 1. 🎓 Student Opportunity Portal
- **Smart Opportunity Discovery**: Search vetted deliverables tailored by degree (B.Tech, B.Des, BBA) and semester availability.
- **Milestone & Hour Logging**: Submit deliverable evidence and track hourly logs within the 20h monthly limit.
- **Live Safe Work Gauge**: Visual progress bars showing remaining safe hours and CGPA standing.
- **Protected Earnings Ledger**: Track pending, approved, and disbursed stipends in Indian Rupees (₹).
- **Official Work Transcripts**: Generate university-certified transcripts of completed industry work.

### 2. 🏛️ University Coordinator Console
- **Student Roster & Health**: Comprehensive directory of all participating students with live CGPA and monthly hour usage.
- **Milestone Certification Queue**: One-click review and digital sign-off of student deliverables before escrow payout.
- **Policy Settings**: Customize institutional CGPA thresholds, monthly hour limits, and approved industry partners.
- **Compliance & Accreditation**: Export audit-ready reports aligned with AICTE & UGC work-integrated learning directives.

### 3. 🏢 Enterprise Partner Hub
- **Structured Project Creator**: Post deliverables with milestone definitions, skill requirements, and escrow budgets.
- **Pre-Screened Talent Pool**: Review applications from verified students with faculty-authenticated academic standing.
- **Milestone Escrow Manager**: Pre-fund stipends securely and review student handoffs on an agreed timeline.

---

## 🎨 Visual Identity & Design System

Earnest features an original, art-directed visual identity inspired by modern editorial and illustrated product interfaces:

- **Organic Pastel Palette**:
  - Warm Ivory (`#FFFDF9`): Primary page canvas
  - Blush Pink (`#FFF0F3`): Section transitions and highlight accents
  - Signature Coral / Hot Pink (`#FF3366`): Primary action triggers and badges
  - Soft Lavender (`#F3E8FF`): Service and domain category surfaces
  - Midnight Navy (`#0B1120`): High-contrast footers and console headers
- **Tactile Details**: Hand-drawn squiggles, sparkle doodles (`✦`), and curved organic SVG section waves.
- **Responsive Layout**: Designed for seamless accessibility across mobile devices, tablets, and desktop workstations.

---

## 💻 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Styling & Design System** | [Tailwind CSS 3.4](https://tailwindcss.com/) with custom pastel themes |
| **Routing** | [React Router v6](https://reactrouter.com/) |
| **Icons & Visuals** | [Lucide React](https://lucide.dev/) + Custom SVG brand marks & doodles |
| **Build Tool & Bundler** | [Vite 6.0](https://vitejs.dev/) |
| **Data Architecture** | React Context API with persistent `localStorage` synchronization |

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version `18.0.0` or higher)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kanusheoran/earn-est.git
   cd earn-est
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   ```
   http://localhost:5173/
   ```

### Production Build
To create a minified, production-ready bundle:
```bash
npm run build
```
The output files will be generated in the `dist/` directory, ready to deploy to Vercel, Netlify, or AWS.

---

## 👥 Default Test Personas

For rapid testing and evaluation, Earnest comes pre-loaded with realistic Indian personas and active data:

| Portal | Name / Organization | Role / Details | Demo Credentials |
| :--- | :--- | :--- | :--- |
| **Student** | **Priya Sharma** | B.Tech CSE · IIT Delhi (CGPA 8.4) | `priya.sharma@campus.ac.in` / `password123` |
| **Student** | **Arjun Nair** | B.Des UI/UX · Active (14h / 20h used) | `arjun.nair@campus.ac.in` / `password123` |
| **Student** | **Rohan Verma** | B.Tech ECE · On Hold (CGPA 5.6) | `rohan.verma@campus.ac.in` / `password123` |
| **Coordinator** | **Dr. Ananya Bhatt** | Dean of Academic Affairs | `coordinator@university.ac.in` / `adminpass123` |
| **Enterprise** | **Infosys BPM** | Corporate Partner Hub | `campus.hiring@infosysbpm.com` / `enterprise123` |

*Note: You can switch between personas instantly using the **Quick Role Switcher** available across portal headers.*

---

## 📁 Project Directory Structure

```text
earn-est/
├── public/                 # Static public assets (favicons, SVG badges)
├── src/
│   ├── assets/             # Brand logos and illustration assets
│   ├── components/
│   │   ├── common/         # StatCard, BrandLogo, SearchFilterBar, Modal
│   │   ├── features/       # OpportunityCard, VerificationModal, WorkLogModal
│   │   └── layout/         # PublicNavbar, PublicFooter, PortalLayout, Sidebars
│   ├── context/
│   │   ├── AppContext.tsx  # Central state management & local storage engine
│   │   └── SafeguardEngine.ts # 20h cap, 7.0 CGPA & exam blackout validator
│   ├── data/
│   │   └── mockData.ts     # Realistic Indian students, enterprises & ₹ projects
│   ├── pages/
│   │   ├── public/         # LandingPage, StudentLogin, CoordinatorLogin
│   │   ├── student/        # StudentDashboard, Opportunities, Earnings, Projects
│   │   ├── coordinator/    # CoordinatorDashboard, Students, Verification, Settings
│   │   └── enterprise/     # EnterpriseDashboard, PostOpportunity, Applicants
│   ├── types/
│   │   └── index.ts        # TypeScript schemas & entity contracts
│   ├── App.tsx             # Route definitions & protected route guards
│   ├── index.css           # Custom utilities, animations & organic scrollbars
│   └── main.tsx            # React application entrypoint
├── tailwind.config.js      # Palette definitions (ivory, rose, forest, lavender)
└── vite.config.ts          # Vite build optimization configuration
```

---

## 📄 License & Attribution

This project is open-source under the [MIT License](LICENSE). Built for Indian university ecosystems in compliance with national student work-learning frameworks.
