# NJ Health & Safety Evaluation Checklist 2025-2026

A responsive web application to digitize the New Jersey Department of Education Health and Safety Evaluation of School Buildings Checklist.

## Project Overview

This application replaces a 10-page PDF form with a modern multi-step web interface that enables:
- 7-step multi-page form with free navigation
- Real-time progress tracking and auto-save
- Automated compliance calculation (100% Section A, 80% Section B)
- Simple JWT authentication with multi-user collaboration
- Read-only view after submission

## Quick Start

### Prerequisites
- Node.js 18+ LTS
- npm

### Installation & Running

```bash
# Install all dependencies (root, client, and server)
npm install

# Run both client and server in development mode
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Health check: http://localhost:3000/health

### Alternative: Run Separately

```bash
# Run server only
npm run dev:server

# Run client only
npm run dev:client
```

## Development Status

### ✅ Phase 1: Foundation (COMPLETED)
- [x] Project setup (Vite + React + TypeScript)
- [x] Backend setup (Express + TypeScript + SQLite)
- [x] Database schema creation
- [x] Authentication system (register, login, JWT)
- [x] Basic API endpoints (CRUD for forms)
- [x] Login and Dashboard pages

### 🔄 Phase 2: Core Form (Next)
- [ ] Multi-step navigation system
- [ ] Progress indicator component
- [ ] Form context for state management
- [ ] All 7 step pages with form fields
- [ ] Auto-save functionality

### 📋 Phase 3: Validation & Scoring (Planned)
- [ ] Section A/B compliance calculation
- [ ] Real-time validation feedback
- [ ] Submission validation logic
- [ ] Score display on Step 7

### 🎨 Phase 4: Polish & Testing (Planned)
- [ ] Responsive design refinement
- [ ] Read-only submitted form view
- [ ] Loading states and error handling
- [ ] Documentation

## Tech Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS
- React Hook Form + Zod validation
- React Router v6
- Axios

### Backend
- Node.js 18+ with Express
- TypeScript
- SQLite (prototype) → PostgreSQL (production)
- JWT authentication
- bcrypt for password hashing

## Project Structure

```
hse-checklist/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
├── server/          # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── types/
│   └── package.json
└── shared/          # Shared types/schemas
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Forms
- `POST /api/forms` - Create new form
- `GET /api/forms` - List all forms for user
- `GET /api/forms/:id` - Get specific form
- `PATCH /api/forms/:id` - Update form (auto-save)
- `POST /api/forms/:id/submit` - Submit form
- `GET /api/forms/:id/readonly` - View submitted form

## Compliance Rules

**Section A (100% required):**
- 25 safety checklist items
- ALL items must be "Yes" or "N/A" to pass
- ANY "No" response = Non-compliant

**Section B (80% required):**
- 34 safety checklist items
- At least 80% of answered items must be "Yes"
- N/A responses excluded from calculation

## Documentation

- See `PRD.md` for complete product specifications
- See `PROJECT_BRIEF.md` for development guide

## License

TBD
