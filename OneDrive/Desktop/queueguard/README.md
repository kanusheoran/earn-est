# QueueGuard — Smart Queue Management System

QueueGuard is a full-stack, real-time digital queue management platform built for environments with customer waiting lines — such as university student service centers, healthcare clinics, banking halls, and public administrative offices.

The platform eliminates physical crowds, provides transparent wait-time estimations with real-time tracking tokens, and empowers counter staff with concurrent transactional controls and live reception monitors.

---

## 🌟 Key Features

### 1. Digital Queue Joining & Smart Tokens
- **One-Click Check-in**: Customers join directly from their mobile devices without installing an app.
- **Human-Readable Tokens**: Incrementing daily department tokens (e.g., `QG-REG-016`) scoped per department.
- **Priority Tiering**: Configurable priority support (`VIP`, `URGENT`, `SENIOR_ACCESSIBLE`, `STANDARD`).
- **Capacity & Business Hours Safeguard**: Rejects joins when daily department capacities are reached or queues are paused.
- **Anti-Spam & Validation**: Full Zod schema validation on all inputs.

### 2. Live Waiting-Time Estimator & Tracking Screen
- **Algorithmic Estimation**:
  $$\text{Estimated Minutes} = \frac{\text{Customers Ahead} \times \text{Avg Service Duration}}{\max(1, \text{Active Serving Desks})}$$
  Estimates adjust dynamically based on the rolling average of the last completed services in that specific department.
- **Live WebSocket Synchronization**: Socket.IO broadcasts updates whenever tickets are called, served, skipped, or cancelled.
- **Audio Chime Alerts**: Web Audio API tone alerts when the customer's token is called to a counter.
- **Secure Anonymous Sharing**: Unpredictable cryptographic secret tokens enable tracking without exposing personal phone numbers or emails on shared displays.

### 3. Staff Counter Workstation
- **Concurrency-Safe Atomic Call-Next**: Concurrency control prevents two staff members from simultaneously calling the same customer.
- **Strict State Transitions**: Rejects invalid transitions (e.g. cannot mark `SERVED` without being `CALLED` or `SERVING`).
- **Comprehensive Desk Controls**: `Call Next`, `Start Service`, `Complete Service`, `Skip Customer`, `Recall Announcement`, and `Pause/Resume Counter`.
- **Desk Session History**: Live log of customers served by the authenticated staff member.

### 4. Public Reception TV / Wall Display
- High-contrast, reception-ready screen optimized for waiting room displays and monitors.
- Shows current active tokens called with counter number, department code, and recent completed tickets.
- Real-time updates with zero manual page refreshes required.

### 5. Administrator Suite & Analytics
- **Live Operational KPIs**: Total served today, active queue entries, average wait time, average service duration, and abandonment rate.
- **Data Visualizations**: Recharts-powered department volume bars and hourly traffic arrival distribution curves.
- **Audit Trails**: Live system event logs of all queue state transitions.
- **Entity Management**: CRUD controls for Service Departments, Counter Desks, and Staff Accounts with counter assignments.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Recharts |
| **Backend** | Node.js, Express, TypeScript, Socket.IO |
| **Database & ORM** | SQLite / PostgreSQL, Prisma ORM |
| **Validation & Auth** | Zod, JSON Web Tokens (JWT), bcryptjs |
| **Testing** | Vitest |

---

## 📂 Project Architecture

```
queueguard/
├── .env.example
├── .gitignore
├── README.md
├── server/
│   ├── prisma/
│   │   └── schema.prisma        # Database schema (SQLite / Postgres)
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── queueController.ts
│   │   │   ├── staffController.ts
│   │   │   ├── adminController.ts
│   │   │   └── displayController.ts
│   │   ├── middleware/
│   │   │   └── auth.ts          # JWT & RBAC role enforcement
│   │   ├── routes/
│   │   │   └── index.ts         # REST API endpoints
│   │   ├── services/
│   │   │   └── queueService.ts  # Token generation & wait-time algorithm
│   │   ├── tests/
│   │   │   └── queue.test.ts    # Vitest automated test suite
│   │   ├── index.ts             # Express & Socket.IO server entrypoint
│   │   ├── prisma.ts            # Prisma client instance
│   │   ├── seed.ts              # Database seeding script
│   │   └── socket.ts            # WebSocket manager
│   ├── package.json
│   └── tsconfig.json
└── client/
    ├── src/
    │   ├── components/
    │   │   └── Navbar.tsx
    │   ├── context/
    │   │   └── AuthContext.tsx  # Auth state & user session
    │   ├── pages/
    │   │   ├── LandingPage.tsx   # Public discovery & token lookup
    │   │   ├── JoinQueuePage.tsx # Digital ticket issuance
    │   │   ├── TrackQueuePage.tsx# Live position & wait-time tracker
    │   │   ├── LoginPage.tsx     # Staff & admin authentication
    │   │   ├── StaffDashboard.tsx# Counter desk management
    │   │   ├── AdminDashboard.tsx# Analytics, departments, desks, staff
    │   │   └── LiveDisplayPage.tsx# TV / monitor reception screen
    │   ├── services/
    │   │   ├── api.ts           # Type-safe API client
    │   │   └── socket.ts        # Socket.IO client instance
    │   ├── types/
    │   │   └── index.ts         # Shared TypeScript interfaces
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.ts
```

---

## 🚀 Quickstart & Installation

### Prerequisites
- **Node.js** >= 20.x
- **npm** >= 10.x

### 1. Clone & Setup Backend
```bash
cd server
npm install

# Setup database & generate Prisma client
npx prisma db push

# Seed initial departments, counters, staff accounts, and test queues
npm run seed
```

### 2. Setup Frontend Client
```bash
cd ../client
npm install
```

### 3. Running the Development Servers
Open two terminal windows:

**Terminal 1 (Backend API & Socket.IO on port 5000):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend Client on port 5173):**
```bash
cd client
npm run dev
```

Visit the application at: **`http://localhost:5173`**

---

## 👥 Demo Accounts

The database comes pre-seeded with ready-to-test accounts (with one-click auto-fill buttons on the login page):

| Role | Email | Password | Assigned Counter |
|---|---|---|---|
| **Administrator** | `admin@queueguard.io` | `admin123` | All Desks / Administrative Suite |
| **Staff Member** | `sarah@queueguard.io` | `staff123` | Counter 01 (Registration) |
| **Staff Member** | `james@queueguard.io` | `staff123` | Window A (Financial Services) |

---

## 🧪 Running Automated Tests

To run the unit and integration test suite:

```bash
cd server
npm test
```

The tests verify:
- Department token formatting and auto-incrementation.
- Priority queue ordering (VIP/Urgent jumping ahead of Standard FIFO).
- State machine enforcement preventing invalid lifecycle transitions.

---

## 🌐 Production & PostgreSQL Deployment

To switch from the local SQLite fallback to production PostgreSQL:

1. Update `server/.env`:
   ```env
   DATABASE_URL="postgresql://username:password@your-db-host:5432/queueguard?schema=public"
   ```
2. In `server/prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```
4. Build the client for production:
   ```bash
   cd client && npm run build
   ```
5. Serve client static assets through Nginx, Vercel, or Express static middleware.
