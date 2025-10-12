# Product Requirements Document (PRD) - FINAL
## Health and Safety Evaluation of School Buildings Checklist 2025-2026
## Digital Form Application

**Version:** 1.0 (Final - Ready for Development)  
**Date:** October 7, 2025  
**Status:** ✅ Approved for Development

---

## 1. Executive Summary

Building a responsive web application to digitize the **NJ Department of Education Health and Safety Evaluation of School Buildings Checklist (2025-2026)**. This replaces a 10-page PDF form with a modern multi-step web interface that accommodates the reality of facilities data collection—information arrives incrementally from multiple sources throughout the year.

**Key Features:**
- 7-step multi-page form with free navigation
- Real-time progress tracking and auto-save
- Automated compliance calculation (100% Section A, 80% Section B)
- Simple authentication with multi-user collaboration
- Read-only view after submission

---

## 2. Form Structure & Content

### 2.1 Complete Page Breakdown

**Step 1: Basic Information** (6 fields)
- County (text input)
- District (text input)
- Building Type (radio: Leased/Owned)
- School Building (text input)
- Completed By (text input)
- Date (date picker)

**Step 2: Section A - Licenses & Certificates** (10 items, 100% compliance required)
- Items #1-10: Current certificates, inspections, environmental reports
- Each item: Yes/No/N/A + Violation Location text field
- Notes area

**Step 3: Section A - Building Safety** (15 items, 100% compliance required)
- Items #11-25: Exits, interior safety, carbon monoxide detectors, vocational safety
- Each item: Yes/No/N/A + Violation Location text field
- Notes area

**Step 4: Section B - Exterior & Structure** (4 items, 80% compliance required)
- Items #1-4: Structural integrity, grounds, playground safety
- Each item: Yes/No/N/A + Violation Location text field
- Notes area

**Step 5: Section B - Interior Safety** (22 items, 80% compliance required)
- Items #5-26: Interior exits, electrical, ventilation, storage, toilets, furniture
- Each item: Yes/No/N/A + Violation Location text field
- Notes area

**Step 6: Section B - Vocational/Laboratory Safety** (8 items, 80% compliance required)
- Items #27-34: Chemical storage, machinery safety, welding, gas cylinders
- Each item: Yes/No/N/A + Violation Location text field
- Notes area

**Step 7: Review & Submit** (Score summary + 3 signatures)
- Auto-calculated Section A compliance (must be 100%)
- Auto-calculated Section B compliance (must be ≥80%)
- Overall status: Compliant/Non-Compliant
- Signature fields (3): Name, Title, Date
- Final submission button

### 2.2 Total Field Count
- **Header fields:** 6
- **Section A items:** 25 items × 2 fields (response + location) = 50 fields
- **Section B items:** 34 items × 2 fields = 68 fields
- **Notes fields:** 6 (one per section page)
- **Signature fields:** 9 (3 signatures × 3 fields each)
- **Total interactive fields:** 139 fields

---

## 3. Technical Architecture

### 3.1 Technology Stack

```yaml
Frontend:
  - Framework: React 18+ with TypeScript
  - Styling: Tailwind CSS (core utilities only - no custom config)
  - Form Management: React Hook Form with Zod validation
  - Routing: React Router v6
  - State Management: Context API + React Hook Form
  - HTTP Client: Axios

Backend:
  - Runtime: Node.js 18+ LTS
  - Framework: Express.js with TypeScript
  - Database (Prototype): SQLite with better-sqlite3
  - Database (Production): PostgreSQL with node-postgres (pg)
  - Authentication: JWT (jsonwebtoken)
  - Password Hashing: bcrypt
  - Validation: Zod (shared with frontend)

Development Tools:
  - Build Tool: Vite
  - Linting: ESLint + Prettier
  - Testing: Jest + React Testing Library (optional for prototype)
  - API Testing: Thunder Client / Postman

Deployment (Future):
  - Cloud Provider: TBD (AWS/Azure/GCP)
  - Frontend: Static hosting (S3, Azure Blob, etc.)
  - Backend: Container service (ECS, App Service, Cloud Run)
  - Database: Managed PostgreSQL service
```

### 3.2 Project Structure

```
health-safety-checklist/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── form/
│   │   │   │   ├── FormHeader.tsx
│   │   │   │   ├── FormItem.tsx
│   │   │   │   ├── ProgressIndicator.tsx
│   │   │   │   └── SignatureField.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Navigation.tsx
│   │   │   │   └── StepperSidebar.tsx
│   │   │   └── ui/
│   │   │       ├── Button.tsx
│   │   │       ├── Input.tsx
│   │   │       └── RadioGroup.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── steps/
│   │   │   │   ├── Step1_BasicInfo.tsx
│   │   │   │   ├── Step2_SectionA_Licenses.tsx
│   │   │   │   ├── Step3_SectionA_Safety.tsx
│   │   │   │   ├── Step4_SectionB_Exterior.tsx
│   │   │   │   ├── Step5_SectionB_Interior.tsx
│   │   │   │   ├── Step6_SectionB_Vocational.tsx
│   │   │   │   └── Step7_ReviewSubmit.tsx
│   │   │   └── ViewSubmission.tsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx
│   │   │   └── FormContext.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   └── formService.ts
│   │   ├── types/
│   │   │   ├── form.types.ts
│   │   │   └── auth.types.ts
│   │   ├── utils/
│   │   │   ├── validation.ts
│   │   │   └── calculations.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── server/                      # Node.js backend
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   └── formController.ts
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   └── FormSubmission.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   └── formRoutes.ts
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   ├── formService.ts
│   │   │   └── calculationService.ts
│   │   ├── database/
│   │   │   ├── sqlite.ts
│   │   │   ├── migrations/
│   │   │   └── seeds/
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── jwt.ts
│   │   ├── config.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                      # Shared types/schemas
│   └── schemas/
│       ├── formSchema.ts
│       └── validationSchemas.ts
│
├── README.md
└── package.json
```

---

## 4. Database Design

### 4.1 SQLite Schema (Prototype)

```sql
-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Form submissions table
CREATE TABLE form_submissions (
  id TEXT PRIMARY KEY,
  created_by_user_id TEXT NOT NULL,
  
  -- Header Information
  county TEXT,
  district TEXT,
  building_type TEXT CHECK(building_type IN ('leased', 'owned')),
  school_building TEXT,
  completed_by TEXT,
  completion_date DATE,
  
  -- Section A Data (JSON for flexibility)
  section_a_items TEXT,
  section_a_notes TEXT,
  
  -- Section B Data (JSON for flexibility)
  section_b_items TEXT,
  section_b_notes TEXT,
  
  -- Auto-calculated scores
  section_a_no_count INTEGER DEFAULT 0,
  section_a_compliant BOOLEAN DEFAULT 0,
  section_b_yes_count INTEGER DEFAULT 0,
  section_b_no_count INTEGER DEFAULT 0,
  section_b_na_count INTEGER DEFAULT 0,
  section_b_percentage REAL DEFAULT 0,
  section_b_compliant BOOLEAN DEFAULT 0,
  overall_compliant BOOLEAN DEFAULT 0,
  
  -- Signatures
  signature_1_name TEXT,
  signature_1_title TEXT,
  signature_1_date DATE,
  signature_2_name TEXT,
  signature_2_title TEXT,
  signature_2_date DATE,
  signature_3_name TEXT,
  signature_3_title TEXT,
  signature_3_date DATE,
  
  -- Metadata
  status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'submitted')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  submitted_at DATETIME,
  
  FOREIGN KEY (created_by_user_id) REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX idx_submissions_user ON form_submissions(created_by_user_id);
CREATE INDEX idx_submissions_status ON form_submissions(status);
CREATE INDEX idx_submissions_school ON form_submissions(school_building);
CREATE INDEX idx_submissions_created ON form_submissions(created_at);
```

---

## 5. API Specification

### 5.1 Authentication Endpoints

```typescript
// POST /api/auth/register
Request: {
  username: string;
  password: string;
  email?: string;
  full_name?: string;
}
Response: {
  success: boolean;
  message: string;
  user?: { id, username, email, full_name }
}

// POST /api/auth/login
Request: {
  username: string;
  password: string;
}
Response: {
  success: boolean;
  token?: string;
  user?: { id, username, email, full_name }
}

// GET /api/auth/me (requires auth token)
Response: {
  id, username, email, full_name, role
}
```

### 5.2 Form Endpoints

```typescript
// POST /api/forms (create new form)
Request: {
  school_building: string;
}
Response: {
  id: string;
  status: 'draft';
  created_at: string;
}

// GET /api/forms (list all forms for logged-in user)
Response: {
  forms: [
    { id, school_building, status, completion_percentage, updated_at }
  ]
}

// GET /api/forms/:id (get specific form)
Response: {
  id, status, ...all form fields
}

// PATCH /api/forms/:id (auto-save / update form)
Request: {
  county?: string;
  section_a_items?: {...};
}
Response: {
  success: boolean;
  updated_at: string;
}

// POST /api/forms/:id/submit (final submission)
Request: {
  signatures: {...}
}
Response: {
  success: boolean;
  compliance_report: {
    section_a_compliant, 
    section_b_compliant,
    overall_compliant
  }
}

// GET /api/forms/:id/readonly (view submitted form)
Response: {
  ...all form data (read-only)
}
```

---

## 6. Key Functional Requirements

### 6.1 Navigation & Progress

**Free Navigation:**
- Users can jump to any step at any time via sidebar or Previous/Next buttons
- No validation blocks navigation between steps
- Current step highlighted in progress indicator
- Visited steps marked as "in progress"

**Progress Calculation:**
```typescript
const totalFields = 139;
const filledFields = countNonEmptyFields(formData);
const completionPercentage = (filledFields / totalFields) * 100;
```

### 6.2 Auto-Save Functionality

**Auto-Save Triggers:**
- Every 30 seconds (configurable)
- On field blur (when user moves to next field)
- On navigation between steps
- Visual indicator: "Saving..." → "Saved ✓" → "Last saved: 2 min ago"

**Error Handling:**
- If auto-save fails, show error banner
- Retry 3 times with exponential backoff
- Store unsaved changes in localStorage as backup
- On successful save, clear localStorage backup

### 6.3 Validation Rules

**Section A Compliance (100% required):**
```typescript
function validateSectionA(items) {
  const responses = Object.values(items).map(item => item.response);
  const noCount = responses.filter(r => r === 'no').length;
  const isCompliant = noCount === 0;
  
  return {
    compliant: isCompliant,
    noCount,
    message: isCompliant 
      ? "Section A: Compliant ✓"
      : `Section A: Non-Compliant - ${noCount} items marked "No"`
  };
}
```

**Section B Compliance (80% required):**
```typescript
function validateSectionB(items) {
  const responses = Object.values(items).map(item => item.response);
  const yesCount = responses.filter(r => r === 'yes').length;
  const noCount = responses.filter(r => r === 'no').length;
  const totalCountable = yesCount + noCount; // N/A excluded
  
  const percentage = totalCountable > 0 
    ? (yesCount / totalCountable) * 100 
    : 0;
  const isCompliant = percentage >= 80;
  
  return {
    compliant: isCompliant,
    yesCount,
    noCount,
    percentage: percentage.toFixed(1),
    requiredYes: Math.ceil(totalCountable * 0.8),
    message: isCompliant
      ? `Section B: Compliant ✓ (${percentage.toFixed(1)}%)`
      : `Section B: Non-Compliant - Need ${Math.ceil(totalCountable * 0.8)} "Yes", have ${yesCount}`
  };
}
```

**Final Submission Validation:**
```typescript
function canSubmit(formData) {
  const sectionA = validateSectionA(formData.section_a_items);
  const sectionB = validateSectionB(formData.section_b_items);
  const signaturesComplete = formData.signatures.length === 3 &&
    formData.signatures.every(sig => sig.name && sig.title && sig.date);
  
  return {
    canSubmit: sectionA.compliant && sectionB.compliant && signaturesComplete,
    errors: [
      !sectionA.compliant ? sectionA.message : null,
      !sectionB.compliant ? sectionB.message : null,
      !signaturesComplete ? "All 3 signatures required" : null
    ].filter(Boolean)
  };
}
```

### 6.4 Multi-User Collaboration

**Concurrent Editing:**
- Multiple users can edit the same form simultaneously
- Last write wins (no conflict resolution in V1)
- Auto-save ensures minimal data loss

**User Permissions:**
- All authenticated users have equal access
- Any user can create/edit/submit forms
- No role-based restrictions in V1

### 6.5 Post-Submission Behavior

**After Submission:**
- Form status changes from 'draft' to 'submitted'
- submitted_at timestamp recorded
- Form becomes read-only
- User redirected to read-only view

**Read-Only View:**
- Displays all form data in same 7-step layout
- Navigation enabled but all fields disabled
- Shows compliance scores and signatures
- "Print" button (browser native print)
- "Return to Dashboard" button

---

## 7. User Interface Design

### 7.1 Design System

**Color Palette:**
```css
/* Primary - NJ DOE Blue */
--primary-500: #3b82f6;
--primary-700: #1d4ed8;

/* Success */
--success-500: #22c55e;

/* Warning */
--warning-500: #f59e0b;

/* Error */
--error-500: #ef4444;

/* Neutral */
--gray-100: #f3f4f6;
--gray-500: #6b7280;
--gray-900: #111827;
```

### 7.2 Layout Components

**Desktop Layout (≥1024px):**
```
┌─────────────────────────────────────────────────────┐
│ Header: School Building Name | Save Draft | Logout  │
├──────────────┬──────────────────────────────────────┤
│              │                                       │
│  Progress    │  Step Content                        │
│  Sidebar     │                                       │
│              │  Step 2: Section A - Licenses        │
│  ✓ Basic     │                                       │
│  ◐ Licenses  │  #1. Fire Code Certificate           │
│  ○ Safety    │  ○ Yes ○ No ○ N/A                    │
│  ○ Exterior  │  Violation Location: [__________]    │
│  ○ Interior  │                                       │
│  ○ Vocational│  ...                                  │
│  ○ Review    │                                       │
│              │  [Save Draft] [< Prev] [Next >]      │
│  12% Done    │                                       │
└──────────────┴──────────────────────────────────────┘
```

### 7.3 Responsive Behavior

**Breakpoint Strategy:**
- Mobile First approach
- Tailwind breakpoints: `sm:` `md:` `lg:` `xl:`
- Progress indicator: 
  - Mobile: Horizontal dots + percentage
  - Tablet: Compact sidebar
  - Desktop: Full sidebar with details

---

## 8. Form Items Configuration

### 8.1 Section A Items (25 total - 100% Compliance Required)

**Licenses & Certificates (#1-10):**
1. Current certificate of compliance with Uniform Fire Code
2. Current inspection report of local health official
3. 3-year asbestos management plan available
4. Annual inspection report of DEP for sewage treatment plant
5. Current boiler inspection certificate(s) posted
6. Current license(s) for boiler operators posted
7. Environmental Inspection Reports current (water, lead, air quality, pest management)
8. Fire drill and security drill held monthly
9. Right-To-Know requirements posted, SDS materials on file
10. AEDs available and properly identified (Janet's Law)

**Exits/Exterior (#11-12):**
11. Exterior switches/receptacles covered, weather-proof
12. Exterior exits in good condition, accessible, free of obstructions

**Interior (#13-21):**
13. Electrical outlets, switches properly covered/secured
14. Sufficient access around electrical equipment (36" clearance)
15. Instructional areas free of unapproved construction
16. Doors free of deadbolts, permit exit without key
17. Vision panels with code-approved glass in corridor doors
18. Kindergarten/Pre-K toilet requirements met
19. District approvals in place (Dual Use, Change-of-Use, etc.)
20. No dangerous chemicals/explosives; proper storage if needed
21. Carbon Monoxide detectors near all fuel-burning appliances

**Vocational/Laboratories (#22-25):**
22. Power machinery/science labs have appropriate safety features
23. Fire extinguisher (#20 ABC) in each lab/vocational area
24. Eye/body protection provided (glasses, eyewash, shower)
25. Proper ventilation/exhausting of toxic fumes

### 8.2 Section B Items (34 total - 80% Compliance Required)

**Exits/Exterior (#1-4):**
1. No major exterior structural damage
2. Exterior receptacles GFCI-protected
3. School grounds free of hazards
4. Playground equipment in safe condition

**Interior (#5-26):**
5. Interior exits/corridors accessible, free of obstructions
6. Emergency evacuation procedures posted
7. Interior courtyard doors marked "Not an Exit"
8. Handrails/stair treads in good condition
9. Stage curtains flame-proof, certificates on file
10. Communication device in all education spaces
11. Electric outlets/wiring appropriate (GFI, sufficient outlets)
12. Nurse's Office properly equipped
13. Mechanical ventilation operating in all occupied areas
14. Lighting levels ≥50 foot-candles in instructional areas
15. No unauthorized/hazardous materials in instructional areas
16. Chalkboard/whiteboard/display board in each space
17. Ceilings/walls/floors free of holes, water damage
18. Drains working, covered with appropriate plates
19. Floors clean, free of hazards
20. Supplies/materials properly stored
21. Student clothing storage provided (not in corridors)
22. Drinking fountains/water coolers available
23. Toilet facilities meet UCC requirements
24. Food/non-food items stored separately
25. Non-instructional areas free of unapproved construction
26. Furniture/equipment in good condition, age-appropriate

**Vocational/Laboratories (#27-34):**
27. Hazardous substances in rated cabinets, labeled
28. Sufficient space for machinery operation
29. Automotive lifts have locking devices
30. Shop floors free of hazards
31. "Eye Hazard Area" signs posted
32. Welding safety measures in place (curtains, PPE)
33. Gas cylinders secured, caps in place
34. Oxygen/fuel gas cylinders separated (20 feet minimum)

---

## 9. Environment Configuration

### 9.1 Development Environment

**Backend (.env):**
```bash
NODE_ENV=development
PORT=3000
DATABASE_PATH=./database/dev.db
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRATION=7d
CORS_ORIGIN=http://localhost:5173
```

**Frontend (.env):**
```bash
VITE_API_URL=http://localhost:3000/api
```

### 9.2 Package Dependencies

**Frontend (client/package.json):**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "axios": "^1.6.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

**Backend (server/package.json):**
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "better-sqlite3": "^9.2.0",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.0",
    "zod": "^3.22.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/better-sqlite3": "^7.6.0",
    "@types/bcrypt": "^5.0.0",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/cors": "^2.8.0",
    "typescript": "^5.3.0",
    "ts-node": "^10.9.0",
    "nodemon": "^3.0.0"
  }
}
```

---

## 10. Implementation Phases

### Phase 1: Foundation
- Project setup (Vite + React + TypeScript)
- Backend setup (Express + TypeScript + SQLite)
- Database schema creation
- Authentication system (register, login, JWT)
- Basic API endpoints (CRUD for forms)

### Phase 2: Core Form
- Multi-step navigation system
- Progress indicator component
- Form context for state management
- All 7 step pages with form fields
- Auto-save functionality

### Phase 3: Validation & Scoring
- Section A/B compliance calculation
- Real-time validation feedback
- Submission validation logic
- Score display on Step 7
- Error messaging system

### Phase 4: Polish & Testing
- Responsive design refinement
- Read-only submitted form view
- Dashboard for form list
- Loading states and error handling
- Basic testing
- Documentation

---

## 11. Success Criteria

**Prototype is complete when:**
- ✅ Users can register and login
- ✅ Users can create new forms
- ✅ All 7 pages navigable in any order
- ✅ 139 fields functional with proper input types
- ✅ Auto-save works reliably (no data loss)
- ✅ Progress indicator shows accurate completion
- ✅ Section A 100% compliance enforced
- ✅ Section B 80% compliance calculated correctly
- ✅ Cannot submit until requirements met
- ✅ Clear error messages on validation failures
- ✅ Submitted forms viewable as read-only
- ✅ Responsive on mobile (375px), tablet (768px), desktop (1280px)
- ✅ Data persists correctly to SQLite
- ✅ Clean, modern UI following design system

---

## 12. Out of Scope (Future Iterations)

**Explicitly NOT in V1:**
- ❌ Form amendments/revisions after submission
- ❌ Admin dashboard for reviewing all submissions
- ❌ PDF export functionality
- ❌ Email notifications
- ❌ Bulk data export (CSV/Excel)
- ❌ Real-time collaboration indicators
- ❌ Audit trail/version history
- ❌ File uploads (documents/photos)
- ❌ Offline mode

---

## 13. Quick Reference

### Compliance Calculations
```
Section A: (No count = 0) → Compliant
Section B: (Yes count ÷ (Yes + No count) ≥ 0.80) → Compliant
Overall: (Section A AND Section B = Compliant) → Can Submit
```

### Response Options
- **Yes**: Item is compliant
- **No**: Item is NOT compliant (requires violation location)
- **N/A**: Item is not applicable to this building

### Key Technologies
- React 18 + TypeScript + Tailwind
- Node.js + Express + TypeScript
- SQLite (prototype) → PostgreSQL (production)
- JWT authentication
- React Hook Form + Zod

---

## ✅ PRD Status: FINAL & APPROVED

This PRD is complete and ready for development with Claude Code.

**Instructions for Claude Code:**
1. Read this entire PRD carefully
2. Follow the project structure in Section 3.2
3. Implement features in phases (Section 10)
4. Use the technology stack specified in Section 3.1
5. Follow the database schema in Section 4.1
6. Implement validation logic from Section 6.3
7. Use form items configuration from Section 8
8. Meet all success criteria in Section 11

**Start with Phase 1: Foundation**
- Set up project structure
- Initialize package.json files
- Create database schema
- Build authentication system
- Set up basic API endpoints