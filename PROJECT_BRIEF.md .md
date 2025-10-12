# Project Brief for Claude Code

## Objective
Build a responsive web application to digitize the NJ Department of Education Health and Safety Evaluation of School Buildings Checklist (2025-2026).

## Input Documents
- `PRD.md` - Complete Product Requirements Document (located in project root)

## What to Build
A full-stack web application with:
- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite (for prototype)
- **Authentication**: Simple JWT-based login

## Architecture Overview

### Multi-Step Form Application
- 7 steps with free navigation
- 139 total form fields
- Auto-save every 30 seconds
- Real-time progress tracking
- Compliance validation before submission

### Key Requirements Summary

**Section A (100% Compliance Required):**
- 25 safety checklist items
- ALL items must be "Yes" or "N/A" to pass
- ANY "No" response = Non-compliant

**Section B (80% Compliance Required):**
- 34 safety checklist items
- At least 80% of answered items must be "Yes"
- N/A responses excluded from calculation

**User Flow:**
1. User logs in
2. Creates new form (or continues draft)
3. Completes 7 steps in any order
4. System auto-saves progress
5. Reviews compliance on Step 7
6. Submits when fully compliant
7. Views read-only submitted form

## Project Structure

Follow the structure detailed in PRD Section 3.2:

```
health-safety-checklist/
├── client/          # React frontend (Vite + TypeScript)
├── server/          # Express backend (TypeScript)
└── shared/          # Shared types/schemas
```

## Development Phases

### Phase 1: