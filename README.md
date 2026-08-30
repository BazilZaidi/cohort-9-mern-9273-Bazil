# Notes App — MERN Stack Project

A full-stack notes application built as part of the 10Pearls MERN Stack Developer internship (Cohort 9). Users can sign up, log in, and manage personal notes with rich text editing, pinning, trash/restore, JSON export, and a full dark/light theme.

## Tech Stack

### Backend
- **Node.js** + **Express.js** — server and REST API
- **MongoDB** + **Mongoose** — database and schema modeling
- **JWT (jsonwebtoken)** — stateless authentication
- **bcryptjs** — password hashing
- **Pino** + **pino-http** — structured logging (requests, responses, errors, user activity)
- **CORS** — restricted to the frontend origin
- **dotenv** — environment variable management

### Frontend
- **React** + **Vite** — UI and build tooling
- **React Router** — client-side routing and protected routes
- **Axios** — HTTP client with automatic JWT attachment via interceptor
- **Tailwind CSS** — utility-first styling, with full dark/light mode support
- **react-quill-new** — rich text editor for notes
- **lucide-react** — icon library
- **DOMPurify** — sanitizes rich text HTML before rendering (XSS protection)

### Testing & Quality
- **Mocha**, **Chai**, **Supertest** — backend unit/integration tests
- **Jest**, **React Testing Library** — frontend component tests
- **SonarQube** (via SonarScanner CLI + SonarCloud) — static code analysis
- **CodeRabbit** — automated PR code review

## Features

### Authentication & Authorization
- Sign up, log in, log out
- JWT-based session handling
- Protected routes (frontend) and protected API endpoints (backend middleware)

### Notes Management
- Create, edit, delete notes
- Rich text editing (bold, italic, underline, lists, links)
- Pin/unpin notes with a dedicated "Pinned Notes" view
- Soft-delete (Trash) system — deleted notes can be restored or permanently removed
- Search notes by title
- Export individual notes as JSON

### User Profile
- View and edit name
- Upload, preview, and remove a profile picture (1MB size limit enforced on both client and server)
- Logout

### UI/UX
- Full dark/light theme support across every screen, toggled via a Settings dropdown and persisted in localStorage
- Responsive, card-based dashboard with a fixed sidebar

### Logging & Error Handling
- Every HTTP request/response logged via Pino
- Centralized error-handling middleware with consistent error responses
- 404 handler for unmatched routes

## Project Structure
├── client/ # React frontend
│ └── src/
│ ├── components/ # Reusable components (ProtectedRoute, etc.)
│ ├── context/ # AuthContext, ThemeContext
│ ├── pages/ # Login, Signup, Dashboard, NoteEditor, Profile
│ └── services/ # API call modules (authService, notesService)
├── server/ # Express backend
│ ├── config/ # Database connection
│ ├── controllers/ # Route handler logic
│ ├── middleware/ # Auth middleware, error handler
│ ├── models/ # Mongoose schemas (User, Note)
│ ├── routes/ # API route definitions
│ └── tests/ # Mocha/Chai test suites
└── sonarqube-screenshots/ # SonarQube analysis results and summary


## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB running locally (or a connection string to a hosted instance)

### Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in `server/`:
PORT=5000
MONGO_URI=mongodb://localhost:27017/notesapp
MONGO_URI_TEST=mongodb://localhost:27017/notesapp_test
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173


Run the server:
```bash
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
```

Create a `.env` file in `client/`:
VITE_API_BASE_URL=http://localhost:5000/api

Run the frontend:
```bash
npm run dev
```

## Running Tests

**Backend:**
```bash
cd server
npm test
```

**Frontend:**
```bash
cd client
npm test
```

## Code Quality

SonarQube analysis was run via SonarScanner CLI against SonarCloud. Results, including ratings and a summary of findings, are available in the [`sonarqube-screenshots/`](./sonarqube-screenshots) folder.

## Git Workflow

This project follows a fork-and-pull-request workflow:
- Feature branches are created off `develop`
- Each feature is developed, tested, and opened as a PR against upstream `develop`
- PRs are reviewed by CodeRabbit before merge
- Branches are rebased onto `develop` when a prior PR merges while work is in progress

## Author

Bazil Zaidi — MERN Stack Developer Intern, 10Pearls Pakistan