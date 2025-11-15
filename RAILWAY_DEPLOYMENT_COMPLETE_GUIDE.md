# Complete Railway Deployment Guide - Full Stack React + Express

**Production-Tested Configuration** from Basel Compliance App
**Platform**: Railway.app
**Last Updated**: 2025-11-15
**Status**: ✅ PRODUCTION READY

This is your complete reference for deploying full-stack TypeScript applications (React + Express + SQLite + Puppeteer) to Railway. Everything you need in one place.

---

## Table of Contents

1. [Overview](#overview)
2. [Success Pattern Summary](#success-pattern-summary)
3. [What Worked vs What Didn't](#what-worked-vs-what-didnt)
4. [Required Files & Configuration](#required-files--configuration)
5. [Step-by-Step Application Guide](#step-by-step-application-guide)
6. [Critical Configuration Patterns](#critical-configuration-patterns)
7. [Verification & Testing](#verification--testing)
8. [Troubleshooting](#troubleshooting)
9. [Quick Reference](#quick-reference)

---

## Overview

### Architecture

This guide covers deploying:
- **Frontend**: React + TypeScript (Vite build)
- **Backend**: Express + TypeScript
- **Database**: SQLite with better-sqlite3
- **PDF Generation**: Puppeteer with Chromium (optional)
- **Deployment**: Single Railway service (frontend + backend together)

### Key Success Factors

| Factor | Configuration | Why Critical |
|--------|--------------|-------------|
| **Dockerfile** | Container with explicit dependencies | Full control over Chromium and system libs |
| **Persistent Volume** | Mounted at `/data` | Database survives redeployments |
| **Port Binding** | `0.0.0.0:${PORT}` | Railway's dynamic port assignment |
| **Static Files** | Express serves `client/dist/` | Single service, no CORS complexity |
| **Native Modules** | `.npmrc` configuration | better-sqlite3 compatibility |
| **Environment** | Railway Variables | Secure secrets management |

### Project Structure

```
your-project/
├── Dockerfile                    # ✅ Container configuration
├── .dockerignore                # ✅ Build optimization
├── railway.json                 # ✅ Railway platform config
├── .npmrc                       # ✅ Native module builds
├── .env.example                 # ✅ Environment template
├── package.json                 # ✅ Root workspace config
├── client/
│   ├── package.json            # React app
│   ├── vite.config.ts          # Vite with API proxy
│   ├── tsconfig.json           # TypeScript config
│   ├── tailwind.config.js      # Tailwind CSS
│   ├── src/                    # React components
│   └── dist/                   # Build output (created by build)
└── server/
    ├── package.json            # Express API
    ├── tsconfig.json           # TypeScript config
    ├── src/
    │   ├── server.ts           # ⚠️ CRITICAL: Must serve static files
    │   ├── database/           # DB initialization
    │   ├── routes/             # API routes
    │   └── ...
    └── dist/                   # Build output (created by build)
```

---

## Success Pattern Summary

### The Winning Configuration ✅

1. **Dockerfile with Chromium** - Full control over system dependencies
2. **Railway Volume at `/data`** - Database persistence across deploys
3. **Workspace monorepo** - Coordinated client + server builds
4. **Express serves static files** - No separate frontend deployment
5. **`.npmrc` for native modules** - better-sqlite3 compatibility
6. **Environment variables in Railway** - Secure configuration

### Deployment Flow

```
Developer → git push → GitHub
                        ↓
                     Railway
                        ↓
                 Detects Dockerfile
                        ↓
           Runs: npm run build
                        ↓
        ┌───────────────┴────────────────┐
        ↓                                ↓
  Vite build                      TypeScript compile
  client/ → client/dist/          server/ → server/dist/
        ↓                                ↓
        └───────────────┬────────────────┘
                        ↓
              Runs: npm start
           (node server/dist/server.js)
                        ↓
      Express serves static files from client/dist/
                        ↓
              App accessible at Railway URL
```

---

## What Worked vs What Didn't

### ✅ What Worked (Follow This Path)

| Approach | Result | Lesson |
|----------|--------|--------|
| **Dockerfile** | ✅ Build succeeded, all dependencies installed | Use Dockerfile for complex system dependencies |
| **Persistent Volume at `/data`** | ✅ Database survives redeployments | Critical for any stateful data |
| **Single service deployment** | ✅ No CORS issues, simpler architecture | Serve static files from Express |
| **`.npmrc` configuration** | ✅ better-sqlite3 builds correctly | Essential for native modules |
| **Railway automatic builds** | ✅ Seamless GitHub integration | Reliable deployment pipeline |
| **`0.0.0.0:${PORT}` binding** | ✅ App accessible on Railway | Required for Railway's networking |

### ❌ What Didn't Work (Avoid These Mistakes)

| Approach | Result | Lesson Learned |
|----------|--------|----------------|
| **nixpacks.toml** | ❌ Build failed with exit code 100 | Dockerfile is more reliable for complex deps |
| **Render.com detour** | ❌ Wasted time, same issue existed there | Diagnose thoroughly before changing platforms |
| **Missing persistent volume** | ❌ Database recreated on each deploy | Users had to create accounts every time |
| **Hardcoded port 3020** | ❌ App not accessible on Railway | Always use `process.env.PORT` |
| **Separate frontend deploy** | ❌ CORS complexity, two services to manage | Single service is simpler |

### Key Insights

1. **Render.com Detour Was Unnecessary**: Switched platforms thinking Railway had a caching issue. The problem was actually code-related and existed on Render too. Eventually fixed the real issue and returned to Railway successfully.

2. **nixpacks.toml Syntax Issues**: Initial attempt with `nixpacks.toml` for Chromium installation failed. Switched to Dockerfile which provided full control and worked perfectly.

3. **Database Persistence Critical**: Railway has ephemeral filesystem. Without explicit volume mounting, all data is lost on redeploy. This cost time debugging user account issues.

4. **Platform Issues Are Rare**: Usually configuration or code issues, not platform issues. Thoroughly diagnose before switching platforms.

---

## Required Files & Configuration

### 1. Dockerfile (Root Directory)

**Location**: `/Dockerfile`

```dockerfile
# Use Node.js LTS
FROM node:18-slim

# ============================================
# CHROMIUM INSTALLATION (OPTIONAL)
# Only needed if using Puppeteer for PDF generation
# Remove this entire section if not needed (saves ~200MB)
# ============================================
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-sandbox \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files for all workspaces
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies for all workspaces
RUN npm install --production=false
RUN cd client && npm install --production=false
RUN cd server && npm install --production=false

# Copy source code
COPY . .

# Build client (Vite)
RUN cd client && npm run build

# Build server (TypeScript)
RUN cd server && npm run build

# Expose port (Railway will set PORT env var dynamically)
EXPOSE 3020

# Set environment variables
ENV NODE_ENV=production
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Start command
CMD ["node", "server/dist/server.js"]
```

**Customization Notes**:
- **If NOT using Puppeteer**: Delete lines 4-25 (Chromium installation) and remove `ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium`
- **If different build output**: Adjust the build commands for your project structure

---

### 2. .dockerignore (Root Directory)

**Location**: `/.dockerignore`

```
# Dependencies
node_modules
client/node_modules
server/node_modules

# Build output
client/dist
server/dist

# Git
.git
.gitignore

# Environment
.env
.env.local
.env.production

# Documentation
*.md
README.md

# Cache and logs
.cache
*.log
npm-debug.log*

# Test coverage
coverage

# IDE
.vscode
.idea
*.swp
*.swo
```

**Why**: Reduces Docker build context size and speeds up builds.

---

### 3. railway.json (Root Directory)

**Location**: `/railway.json`

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Why**: Tells Railway how to build and deploy your application. NIXPACKS builder detects Dockerfile automatically.

---

### 4. .npmrc (Root Directory)

**Location**: `/.npmrc`

```
build-from-source=false
python=python3
```

**Critical**: Ensures better-sqlite3 and other native modules build correctly on Railway.

---

### 5. .env.example (Root Directory)

**Location**: `/.env.example`

```env
# Server Configuration
NODE_ENV=production
PORT=3020

# Database Configuration
# CRITICAL: Must match Railway volume mount path
DATABASE_PATH=/data/production.db

# Authentication
# Generate with: openssl rand -base64 32
JWT_SECRET=CHANGE_THIS_IN_PRODUCTION
JWT_EXPIRATION=7d

# Client URL (optional, for CORS)
CLIENT_URL=https://your-app.railway.app
```

**Note**: This is a template. Set actual values in Railway dashboard, not in code.

---

### 6. package.json (Root Directory)

**Location**: `/package.json`

```json
{
  "name": "your-app-name",
  "version": "1.0.0",
  "description": "Your app description",
  "private": true,
  "workspaces": [
    "client",
    "server"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "cd server && npm run dev",
    "dev:client": "cd client && npm run dev",
    "install:all": "npm install && cd client && npm install && cd ../server && npm install",
    "build": "rm -rf client/dist server/dist && cd client && npm run build && cd ../server && npm run build",
    "start": "node server/dist/server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

**Critical Scripts**:
- `build`: Railway runs this - must build both client and server
- `start`: Railway runs this after build - must start production server

---

### 7. client/package.json

**Location**: `/client/package.json`

```json
{
  "name": "client",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router-dom": "^7.9.4",
    "axios": "^1.7.9"
  },
  "devDependencies": {
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.3",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.57.1",
    "postcss": "^8.4.49",
    "tailwindcss": "^4.1.8",
    "typescript": "^5.3.3",
    "vite": "^7.1.7"
  }
}
```

---

### 8. client/vite.config.ts

**Location**: `/client/vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3020',
        changeOrigin: true,
      },
    },
  },
});
```

**Why**: API proxy allows frontend to call backend during development without CORS issues.

---

### 9. server/package.json

**Location**: `/server/package.json`

```json
{
  "name": "server",
  "version": "1.0.0",
  "description": "Backend API",
  "main": "dist/server.js",
  "type": "commonjs",
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "better-sqlite3": "^9.2.2",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.10.6",
    "@types/bcrypt": "^5.0.2",
    "@types/better-sqlite3": "^7.6.8",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/multer": "^1.4.11",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.2"
  }
}
```

**Add if using Puppeteer**:
```json
{
  "dependencies": {
    "pdf-lib": "^1.17.1",
    "puppeteer": "^24.29.1"
  }
}
```

---

### 10. server/tsconfig.json

**Location**: `/server/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Step-by-Step Application Guide

### Phase 1: Prepare Your Project

#### Step 1.1: Create Backup Branch

```bash
cd /path/to/your-project
git checkout -b add-railway-deployment
```

#### Step 1.2: Copy Configuration Files

```bash
# If using Basel template directory:
TEMPLATE="/Users/rdb/Projects/Claude/basel-compliance-app/deployment-template"

cp $TEMPLATE/Dockerfile .
cp $TEMPLATE/.dockerignore .
cp $TEMPLATE/railway.json .
cp $TEMPLATE/.npmrc .
cp $TEMPLATE/.env.example .

# Verify files copied
ls -la Dockerfile .dockerignore railway.json .npmrc .env.example
```

**Or create manually**: Use the file contents from [Required Files & Configuration](#required-files--configuration) section above.

---

### Phase 2: Update Package Configuration

#### Step 2.1: Update Root package.json

Open `package.json` and ensure it has:

```json
{
  "name": "your-app-name",
  "private": true,
  "workspaces": ["client", "server"],
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "cd server && npm run dev",
    "dev:client": "cd client && npm run dev",
    "build": "rm -rf client/dist server/dist && cd client && npm run build && cd ../server && npm run build",
    "start": "node server/dist/server.js"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

Install concurrently if needed:
```bash
npm install -D concurrently
```

#### Step 2.2: Verify Client package.json

Ensure `client/package.json` has:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
```

#### Step 2.3: Verify Server package.json

Ensure `server/package.json` has:

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

---

### Phase 3: Update Server Configuration (CRITICAL)

#### Step 3.1: Update server.ts

This is the **most important change** for Railway deployment.

**Location**: `/server/src/server.ts`

**Add/Update these sections**:

```typescript
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// ============================================
// 1. CORS CONFIGURATION
// ============================================
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? '*'  // Accept all origins (or specify your Railway domain)
    : 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// 2. API ROUTES (must come BEFORE static files)
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// ... all your other API routes

// ============================================
// 3. HEALTH CHECK ENDPOINT (monitored by Railway)
// ============================================
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'connected', // Add DB check if needed
  });
});

// ============================================
// 4. STATIC FILE SERVING (production only)
// ============================================
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '../../client/dist');

  console.log(`📁 Serving static files from: ${clientDistPath}`);

  // Serve static assets (JS, CSS, images)
  app.use(express.static(clientDistPath));

  // Catch-all route for client-side routing
  // MUST be AFTER all API routes!
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// ============================================
// 5. START SERVER
// ============================================
// CRITICAL:
// - Use Railway's PORT environment variable (dynamic)
// - Bind to '0.0.0.0' not 'localhost' (required for Railway)
const PORT = process.env.PORT || 3020;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);

  if (process.env.NODE_ENV === 'production') {
    console.log(`📦 Serving static React app from client/dist`);
  } else {
    console.log(`⚛️  React dev server should be running on http://localhost:5173`);
  }
});

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});
```

**Why These Changes Matter**:

| Change | Why Critical |
|--------|-------------|
| `process.env.PORT` | Railway assigns port dynamically, not always 3020 |
| `0.0.0.0` binding | Railway's networking requires this, not `localhost` |
| Static file serving | Single service deployment, no CORS issues |
| Health endpoint | Railway monitors this for automatic restarts |
| Production CORS | Allows requests from your Railway domain |

---

### Phase 4: Customize Dockerfile (Optional)

#### If You DON'T Use Puppeteer

Open `Dockerfile` and **delete** this section:

```dockerfile
# DELETE LINES 4-25
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-sandbox \
    fonts-liberation \
    ...
    && rm -rf /var/lib/apt/lists/*
```

Also delete:
```dockerfile
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
```

This saves ~200MB in your Docker image.

#### If You DO Use Puppeteer

Keep the Dockerfile as-is. Ensure your Puppeteer code uses:

```typescript
const browser = await puppeteer.launch({
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu'
  ],
  executablePath: process.env.NODE_ENV === 'production'
    ? '/usr/bin/chromium'
    : undefined
});
```

---

### Phase 5: Test Locally

Before deploying to Railway, verify everything works locally.

#### Step 5.1: Clean Install

```bash
# Remove all node_modules
rm -rf node_modules client/node_modules server/node_modules

# Fresh install
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..
```

#### Step 5.2: Build Everything

```bash
# Build from root
npm run build

# Verify output
ls -la client/dist    # Should see: index.html, assets/
ls -la server/dist    # Should see: server.js, etc.
```

Expected output:
```
client/dist/
  - index.html
  - assets/
    - index-[hash].js
    - index-[hash].css

server/dist/
  - server.js
  - routes/
  - controllers/
  - ...
```

#### Step 5.3: Test Production Build

```bash
# Start in production mode
NODE_ENV=production DATABASE_PATH=./database/dev.db npm start
```

Expected console output:
```
🚀 Server running on port 3020
📍 Environment: production
🔗 Health check: http://localhost:3020/health
📦 Serving static React app from client/dist
```

#### Step 5.4: Verify Endpoints

**Test health endpoint**:
```bash
curl http://localhost:3020/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-15T...",
  "environment": "production"
}
```

**Test frontend**:
- Open browser: `http://localhost:3020`
- Should see your React app
- Check browser console for errors
- Test navigation (client-side routing should work)

**Test API**:
- Try login/signup
- Test data fetching
- Verify all features work

---

### Phase 6: Commit Changes

```bash
# Stage all changes
git add .

# Commit with detailed message
git commit -m "Add Railway deployment configuration

- Add Dockerfile with Chromium for Puppeteer
- Add railway.json for build/deploy config
- Add .npmrc for native module builds (better-sqlite3)
- Update package.json with workspace and build scripts
- Update server.ts to serve static files in production
- Add health endpoint for Railway monitoring
- Configure CORS for production deployment

Tested locally with production build - all features working.

Based on production-tested Basel Compliance App template."

# Push to GitHub
git push origin add-railway-deployment
```

---

### Phase 7: Deploy to Railway

#### Option A: Railway Dashboard (Recommended)

1. **Go to Railway**
   - Visit https://railway.app
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize Railway to access your repositories

3. **Select Repository**
   - Choose your repository
   - Select branch: `add-railway-deployment`

4. **Automatic Detection**
   - Railway detects `Dockerfile` and `railway.json`
   - Build starts automatically
   - Watch build logs for any errors

5. **Wait for Deployment**
   - Build takes 3-5 minutes (first time)
   - Green checkmark means success
   - Railway assigns a URL

#### Option B: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize (if new project)
railway init

# Or link to existing project
railway link

# Deploy
railway up

# Watch logs
railway logs
```

---

### Phase 8: Configure Railway Environment

#### Step 8.1: Add Environment Variables

1. **Go to Railway Dashboard**
   - Select your project
   - Click on your service
   - Go to "Variables" tab

2. **Add Variables**:

   Click "+ New Variable" for each:

   ```
   NODE_ENV=production
   ```

   ```
   JWT_SECRET=<paste-generated-secret>
   ```

   ```
   DATABASE_PATH=/data/production.db
   ```

3. **Generate JWT_SECRET**:

   ```bash
   # On macOS/Linux:
   openssl rand -base64 32

   # Or with Node:
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

   Copy the output and paste as `JWT_SECRET` value.

4. **Save**
   - Click outside or press Enter to save
   - Railway will redeploy automatically

---

#### Step 8.2: Add Persistent Volume (CRITICAL for SQLite)

**⚠️ Without this, your database will be recreated on every deployment!**

1. **Go to Settings**
   - In your service, click "Settings" tab
   - Scroll to "Volumes" section

2. **Create Volume**
   - Click "+ New Volume"
   - Configure:
     - **Mount Path**: `/data`
     - **Size**: 1GB (or as needed)
   - Click "Add"

3. **Verify**
   - Volume should appear in list
   - Mount path should show `/data`
   - Status should be "Active"

4. **Check Environment Variable**
   - Go back to "Variables" tab
   - Verify `DATABASE_PATH=/data/production.db`
   - The path `/data` must match volume mount path

**Why This Matters**:
- Railway has **ephemeral filesystem**
- Everything except mounted volumes is deleted on redeploy
- Without volume: users, data, uploads all lost on every deployment
- With volume: data persists across deployments

---

### Phase 9: Verify Deployment

#### Step 9.1: Get Your Railway URL

From Railway dashboard:
- Go to your service
- Click "Settings" tab
- See "Domains" section
- Your URL: `https://your-app-production.up.railway.app`

Or via CLI:
```bash
railway domain
```

#### Step 9.2: Test Health Endpoint

```bash
curl https://your-app-production.up.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-15T12:34:56.789Z",
  "environment": "production",
  "database": "connected"
}
```

#### Step 9.3: Test Frontend

```bash
# Open in browser
open https://your-app-production.up.railway.app
```

Check:
- [ ] Page loads without errors
- [ ] Static assets load (CSS, images, fonts)
- [ ] No console errors in browser DevTools
- [ ] Client-side routing works (navigate between pages)
- [ ] UI looks correct

#### Step 9.4: Test API

- [ ] Login/signup works
- [ ] Data fetching works
- [ ] Create/update/delete operations work
- [ ] File uploads work (if applicable)
- [ ] PDF generation works (if using Puppeteer)

#### Step 9.5: Test Database Persistence

**Critical test**:

1. Create a user account or add some data
2. Note down the data (username, package name, etc.)
3. Trigger a redeployment:
   ```bash
   git commit --allow-empty -m "Test database persistence"
   git push
   ```
4. Wait for deployment to complete (watch Railway dashboard)
5. Try to login with same credentials
6. Check if data still exists

**If data is lost**: Volume is not configured correctly. Go back to Step 8.2.

**If data persists**: ✅ Success! Database persistence is working.

---

### Phase 10: Review Logs

Check Railway logs for any warnings or errors:

1. Go to Railway Dashboard
2. Click your service
3. Click "Deployments" tab
4. Click latest deployment
5. Review "Build Logs" and "Deploy Logs"

**Look for**:
- ✅ `Server running on port 3020`
- ✅ `Serving static files from: /app/client/dist`
- ✅ Database connection messages
- ✅ No errors or warnings

**Common log messages**:
```
📦 Installing dependencies...
🔨 Building client...
🔨 Building server...
🚀 Server running on port 3020
📍 Environment: production
📦 Serving static React app from client/dist
```

---

## Critical Configuration Patterns

### Pattern 1: Port Binding (Required)

**Wrong** ❌:
```typescript
app.listen(3020, 'localhost', () => {
  console.log('Server on 3020');
});
```

**Right** ✅:
```typescript
const PORT = process.env.PORT || 3020;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server on ${PORT}`);
});
```

**Why**: Railway assigns port dynamically and requires `0.0.0.0` binding.

---

### Pattern 2: Static File Serving (Required)

**Wrong** ❌:
```typescript
// No static file serving
// Only API routes
```

**Right** ✅:
```typescript
// After all API routes
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDistPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}
```

**Why**: Single service deployment - Express serves both API and frontend.

---

### Pattern 3: CORS Configuration (Required)

**Wrong** ❌:
```typescript
// No CORS or hardcoded origin
app.use(cors({ origin: 'http://localhost:5173' }));
```

**Right** ✅:
```typescript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? '*'  // or specific Railway domain
    : 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));
```

**Why**: Different origins for development vs production.

---

### Pattern 4: Database Path (Required for SQLite)

**Wrong** ❌:
```typescript
const dbPath = './database/production.db';
```

**Right** ✅:
```typescript
const dbPath = process.env.DATABASE_PATH || './database/dev.db';
```

**Environment Variable**:
```env
DATABASE_PATH=/data/production.db
```

**Why**: Volume is mounted at `/data` - database must be inside mounted volume.

---

### Pattern 5: Build Scripts (Required)

**Wrong** ❌:
```json
{
  "scripts": {
    "build": "tsc"
  }
}
```

**Right** ✅:
```json
{
  "scripts": {
    "build": "rm -rf client/dist server/dist && cd client && npm run build && cd ../server && npm run build"
  }
}
```

**Why**: Railway runs `npm run build` once - must build both client and server.

---

### Pattern 6: Health Endpoint (Recommended)

**Add to server.ts**:
```typescript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});
```

**Why**: Railway uses this to monitor your app and trigger restarts if needed.

---

## Verification & Testing

### Local Testing Checklist

Before deploying, verify locally:

- [ ] `npm run build` succeeds without errors
- [ ] `client/dist/` directory exists with `index.html` and `assets/`
- [ ] `server/dist/` directory exists with `server.js`
- [ ] `NODE_ENV=production npm start` starts server
- [ ] `curl http://localhost:3020/health` returns 200 OK
- [ ] Browser can access `http://localhost:3020`
- [ ] Static assets load (CSS, JS, images)
- [ ] API calls work
- [ ] No console errors

### Railway Deployment Checklist

After deploying:

- [ ] Build succeeds in Railway (green checkmark)
- [ ] Deployment succeeds in Railway
- [ ] Health endpoint returns 200: `curl https://your-app.railway.app/health`
- [ ] Frontend loads in browser
- [ ] Static assets load correctly
- [ ] API endpoints work
- [ ] Login/authentication works
- [ ] Database operations work
- [ ] **Database persists after redeploy** (critical test)
- [ ] PDF generation works (if using Puppeteer)
- [ ] File uploads work (if applicable)
- [ ] No errors in Railway logs

### Database Persistence Test

**Most important test**:

1. Create data (user account, records, etc.)
2. Note the data
3. Trigger redeploy: `git commit --allow-empty -m "Test" && git push`
4. Wait for deployment
5. Check if data still exists

**If data is lost**: Volume not configured correctly - fix immediately!

---

## Troubleshooting

### Build Failures

#### Error: Exit Code 100

**Symptoms**: Build fails with `exit code: 100`

**Possible Causes**:
- Dockerfile syntax error
- Missing dependencies in package.json
- TypeScript compilation errors

**Fix**:
1. Review Railway build logs
2. Test `npm run build` locally
3. Check Dockerfile syntax
4. Verify all dependencies are in package.json

---

#### Error: Module Not Found

**Symptoms**: `Error: Cannot find module 'xyz'`

**Causes**:
- Missing dependency in package.json
- devDependency should be dependency

**Fix**:
```bash
# Add missing dependency
npm install xyz --save

# Or move from dev to regular dependency
# Edit package.json and move dependency
```

---

### Deployment Failures

#### Error: App Not Accessible

**Symptoms**: Railway shows deployed but URL doesn't work

**Causes**:
- Server not binding to `0.0.0.0`
- Server not using `process.env.PORT`
- Server crashed after start

**Fix**:
```typescript
// Ensure this pattern in server.ts
const PORT = process.env.PORT || 3020;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server on ${PORT}`);
});
```

Check Railway logs for startup errors.

---

#### Error: 404 on Frontend Routes

**Symptoms**: Homepage loads but other routes show 404

**Causes**:
- No catch-all route for client-side routing
- Static file serving not configured
- Catch-all route before API routes

**Fix**:
```typescript
// Ensure this order in server.ts:

// 1. API routes first
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 2. Static files after
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientDistPath));

  // 3. Catch-all last
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}
```

---

### Database Issues

#### Error: Database Lost After Redeploy

**Symptoms**: Users/data disappear after each deployment

**Cause**: No persistent volume or wrong database path

**Fix**:

1. **Add Volume** (Railway Dashboard → Settings → Volumes):
   - Mount Path: `/data`
   - Size: 1GB

2. **Set Environment Variable** (Variables tab):
   ```
   DATABASE_PATH=/data/production.db
   ```

3. **Verify in Code**:
   ```typescript
   const dbPath = process.env.DATABASE_PATH || './database/dev.db';
   ```

4. **Redeploy**

**Test**: Create data, redeploy, verify data persists.

---

#### Error: Database Connection Failed

**Symptoms**: `Error: unable to open database file`

**Causes**:
- Database path doesn't match volume mount
- Permissions issue
- Volume not mounted

**Fix**:
1. Check DATABASE_PATH matches volume mount path (`/data`)
2. Check Railway logs for permission errors
3. Verify volume is mounted (Settings → Volumes)

---

### PDF Generation Issues (Puppeteer)

#### Error: Failed to Launch Browser

**Symptoms**: `Failed to launch the browser process: Code: 127`

**Cause**: Chromium not installed or missing dependencies

**Fix**:

1. **Verify Dockerfile** includes Chromium installation:
   ```dockerfile
   RUN apt-get update && apt-get install -y \
       chromium \
       chromium-sandbox \
       ...
   ```

2. **Set Environment Variable** in Railway:
   ```
   PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
   ```

3. **Update Puppeteer Code**:
   ```typescript
   const browser = await puppeteer.launch({
     executablePath: process.env.NODE_ENV === 'production'
       ? '/usr/bin/chromium'
       : undefined,
     args: ['--no-sandbox', '--disable-setuid-sandbox']
   });
   ```

4. **Redeploy**

---

#### Error: Missing Shared Library

**Symptoms**: `error while loading shared libraries: libglib-2.0.so.0`

**Cause**: Missing system library

**Fix**: Ensure Dockerfile includes all dependencies (see Dockerfile section above).

---

### CORS Issues

#### Error: CORS Policy Blocked

**Symptoms**: API calls fail with CORS error in browser console

**Cause**: CORS not configured for Railway domain

**Fix**:
```typescript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? '*'  // Allow all (or specify Railway domain)
    : 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
```

**Or specify exact domain**:
```typescript
origin: process.env.CLIENT_URL || '*'
```

Set in Railway Variables:
```
CLIENT_URL=https://your-app.railway.app
```

---

### Port Issues

#### Error: EADDRINUSE

**Symptoms**: `Error: listen EADDRINUSE: address already in use`

**Cause**: Another process using the port

**Fix** (Local):
```bash
# Find process
lsof -i :3020

# Kill process
kill -9 <PID>
```

**Fix** (Railway): Not applicable - Railway handles ports.

---

## Quick Reference

### Deployment Commands

```bash
# Local development
npm run dev                    # Start both client and server
npm run dev:client             # Start client only
npm run dev:server             # Start server only

# Build
npm run build                  # Build both client and server
cd client && npm run build     # Build client only
cd server && npm run build     # Build server only

# Production
NODE_ENV=production npm start  # Test production locally

# Railway CLI
railway login                  # Login to Railway
railway init                   # Create new project
railway link                   # Link to existing project
railway up                     # Deploy
railway logs                   # View logs
railway domain                 # Get app URL
```

---

### Environment Variables

**Set in Railway Dashboard → Variables**:

```env
NODE_ENV=production
JWT_SECRET=<openssl rand -base64 32>
DATABASE_PATH=/data/production.db
CLIENT_URL=https://your-app.railway.app
```

**Generate JWT_SECRET**:
```bash
openssl rand -base64 32
```

---

### Critical Patterns Summary

| Pattern | Code |
|---------|------|
| **Port** | `const PORT = process.env.PORT \|\| 3020;` |
| **Binding** | `app.listen(PORT, '0.0.0.0', ...)` |
| **CORS** | `origin: process.env.NODE_ENV === 'production' ? '*' : 'http://localhost:5173'` |
| **Static** | `app.use(express.static(clientDistPath))` |
| **Catch-all** | `app.get('*', (req, res) => res.sendFile(...))` |
| **DB Path** | `process.env.DATABASE_PATH \|\| './database/dev.db'` |
| **Health** | `app.get('/health', (req, res) => res.json({status:'ok'}))` |

---

### File Checklist

**Root directory**:
- [ ] `Dockerfile`
- [ ] `.dockerignore`
- [ ] `railway.json`
- [ ] `.npmrc`
- [ ] `.env.example`
- [ ] `package.json` (with workspace and build scripts)

**Client**:
- [ ] `package.json` (with `build: vite build`)
- [ ] `vite.config.ts` (with API proxy)

**Server**:
- [ ] `package.json` (with `build: tsc` and `start: node dist/server.js`)
- [ ] `tsconfig.json` (with `outDir: ./dist`)
- [ ] `server.ts` (with all critical patterns)

---

### Railway Configuration

**Settings → Volumes**:
- Mount Path: `/data`
- Size: 1GB (minimum)

**Variables**:
- `NODE_ENV=production`
- `JWT_SECRET=<generated>`
- `DATABASE_PATH=/data/production.db`

**Deployment**:
- Build Command: `npm run build`
- Start Command: `npm start`
- Restart Policy: ON_FAILURE (max 10 retries)

---

## Success Criteria

Your deployment is successful when ALL of these are true:

1. ✅ Build completes without errors in Railway
2. ✅ Deployment shows green checkmark
3. ✅ Health endpoint returns 200 OK
4. ✅ Frontend loads in browser
5. ✅ Static assets load (CSS, JS, images)
6. ✅ No console errors in browser DevTools
7. ✅ API calls work correctly
8. ✅ Login/authentication works
9. ✅ Database operations work
10. ✅ **Database persists after redeployment** (most critical)
11. ✅ Client-side routing works (all pages accessible)
12. ✅ PDF generation works (if using Puppeteer)
13. ✅ File uploads work (if applicable)
14. ✅ No errors in Railway logs

**The most critical test**: Database persistence across redeployments.

---

## Next Steps After Successful Deployment

1. **Merge to Main**
   ```bash
   git checkout main
   git merge add-railway-deployment
   git push origin main
   ```

2. **Set Up CI/CD**
   - Railway auto-deploys on push to main
   - Configure branch deployments if needed

3. **Custom Domain** (Optional)
   - Go to Railway → Settings → Domains
   - Add custom domain
   - Update DNS records

4. **Monitoring**
   - Set up error tracking (Sentry, LogRocket)
   - Monitor Railway metrics
   - Set up external uptime monitoring

5. **Backups**
   - Download database backups regularly
   - Document restore procedure

6. **Team Documentation**
   - Share this guide with team
   - Document any project-specific configuration
   - Create deployment runbook

---

## Resources

- **Railway Documentation**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Dockerfile Best Practices**: https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
- **Puppeteer in Docker**: https://pptr.dev/troubleshooting#running-puppeteer-in-docker
- **better-sqlite3**: https://github.com/WiseLibs/better-sqlite3

---

## Template Maintenance

**Version**: 1.0
**Last Updated**: 2025-11-15
**Tested With**:
- Node.js: 18 LTS
- React: 19.1.1
- Express: 4.18.2
- TypeScript: 5.3.3
- Vite: 7.1.7
- better-sqlite3: 9.2.2
- Puppeteer: 24.29.1

**Update History**:
- 2025-11-15: Initial complete guide
  - Based on Basel Compliance App successful deployment
  - Documented nixpacks.toml → Dockerfile migration
  - Captured Render.com detour lessons
  - Comprehensive troubleshooting from real issues

---

## Summary

This guide captures the **proven, production-tested Railway deployment pattern** from the Basel Compliance App. Follow it step-by-step and you'll avoid the costly mistakes we made (Render.com detour, nixpacks.toml issues, database persistence problems).

**The Three Most Critical Things**:

1. **Dockerfile** - For full control over dependencies (especially Chromium)
2. **Persistent Volume at `/data`** - So your database survives redeployments
3. **Server serves static files** - Single service deployment, no CORS issues

Everything else follows from these three fundamentals.

**Good luck with your deployment!** 🚀

---

*Generated from successful Basel Compliance App Railway deployment - November 2025*
