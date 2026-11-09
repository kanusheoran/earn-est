# earnest. — Student Earnings & Freelancing Tracker

**A student-first platform for managing freelance opportunities, tracking earnings, and balancing work with academics.**

earnest. is a frontend web application designed to help students discover freelance opportunities, monitor their earnings, and stay within academic and workload limits. It also provides coordinators with a dedicated interface to manage opportunities, review student activity, and monitor programme performance.

## Features

### Student Portal
- **Dashboard:** View earnings, active opportunities, applications, and workload summaries.
- **Opportunity Explorer:** Browse, search, and filter freelance opportunities by category.
- **Application Management:** Apply for opportunities and track application status.
- **Earnings Tracker:** Record earnings, review transaction history, and monitor payment status.
- **Academic Safeguards:** View academic eligibility indicators and workload limits.
- **Profile Management:** Update student information and track training progress.

### Coordinator Portal
- **Programme Dashboard:** Monitor student participation, earnings, and workload alerts.
- **Opportunity Management:** Create, edit, pause, and reopen freelance opportunities.
- **Student Management:** Browse student information and review student records.
- **Earnings Review:** Review submitted earnings and update verification status.
- **Programme Insights:** View programme metrics and access printable reports.

### Design
- Separate visual identities for student and coordinator interfaces.
- Editorial-inspired typography and a distinctive colour system.
- Responsive layouts and reusable React components.
- Interactive forms, navigation, filters, and dashboard controls.

## Tech Stack

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| Vite | Development server and build tooling |
| JavaScript (ES6+) | Application logic and interactions |
| CSS | Layout, styling, and responsive design |
| npm | Dependency management |

## Getting Started

### Prerequisites

Install [Node.js](https://nodejs.org/) and npm.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR-USERNAME/earnest-campus-tracker.git
   ```

2. Navigate to the project directory:

   ```bash
   cd earnest-campus-tracker
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal, usually `http://localhost:5173`.

### Production Build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Demo Access

The application is intended as a frontend prototype. Use the login interface to select either the Student or Coordinator portal and follow the demo sign-in flow configured in the application.

> **Note:** Demo sign-in is not real authentication. Do not use actual passwords or sensitive personal information.

## Project Structure

```text
earnest-campus-tracker/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
└── README.md
```

*The exact directory structure may vary depending on the current project files.*

## Current Limitations

- Frontend-only prototype; no backend or database is connected.
- Application data may reset when the page is refreshed.
- Authentication and role-based access are for demonstration purposes only.
- File uploads and payment verification are not connected to external services.
- Dashboard metrics use sample data.

## Future Improvements

- Backend API and database integration.
- Secure authentication and role-based authorization.
- Persistent application, earnings, and profile records.
- Document upload and verification workflows.
- Notifications for applications, payments, and academic limits.
- Data visualisations and exportable reports.
- Automated academic eligibility and workload checks.

## Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request describing your improvements.

## Disclaimer

earnest. is an educational project prototype and is not intended for processing real payments, storing sensitive student records, or enforcing official academic policies.

## License

No license has been specified yet. Add a `LICENSE` file before allowing others to reuse or redistribute the project.

---

**Built with React and Vite.**
