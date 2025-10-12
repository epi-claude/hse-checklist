# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

**Phase 1: Foundation ✅ COMPLETED**

The project has completed Phase 1 implementation with:
- Full-stack TypeScript setup (React + Express)
- SQLite database with schema
- JWT authentication system
- Basic CRUD API for forms
- Login and Dashboard UI

**Next Phase: Core Form (Phase 2)**

## Development Setup

```bash
# Install dependencies
npm install

# Run development (both client and server)
npm run dev

# Access:
# - Frontend: http://localhost:5173
# - Backend: http://localhost:3000
```

## Architecture

### Frontend (client/)
- React 18 + TypeScript + Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Context API for state management

### Backend (server/)
- Node.js + Express + TypeScript
- SQLite database (better-sqlite3)
- JWT authentication with bcrypt
- RESTful API architecture

### Key Files
- `PRD.md` - Complete product requirements
- `PROJECT_BRIEF.md` - Development guide
- `server/src/database/sqlite.ts` - Database schema
- `server/src/routes/` - API endpoints
- `client/src/contexts/AuthContext.tsx` - Auth state

## Development Guidelines

1. **Follow the PRD** - All features are specified in PRD.md
2. **Use TypeScript** - Strict typing throughout
3. **API-first approach** - Backend before frontend
4. **Component structure** - Keep components focused and reusable
5. **State management** - Use Context API for global state, local state for component-specific

## Next Steps (Phase 2)

1. Create multi-step form navigation
2. Build all 7 step components
3. Implement auto-save functionality
4. Add progress tracking
