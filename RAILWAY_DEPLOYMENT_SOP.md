# Railway Deployment SOP (Standard Operating Procedure)

## Critical: Deployment Architecture Pattern

**⚠️ IMPORTANT: This is a SINGLE SERVICE deployment, NOT two services**

### Architecture Overview

```
┌─────────────────────────────────────┐
│   Single Railway Service            │
│                                      │
│  ┌────────────────────────────┐    │
│  │   Express Server (Node.js)  │    │
│  │                              │    │
│  │  ├─ API Routes (/api/*)     │    │
│  │  └─ Static Files (React)    │    │
│  └────────────────────────────┘    │
│                                      │
│  ┌────────────────────────────┐    │
│  │   SQLite Database           │    │
│  │   (Persistent Volume)       │    │
│  └────────────────────────────┘    │
└─────────────────────────────────────┘
```

### Why Single Service?

1. **Express serves everything**: The Node server hosts both API and React build
2. **No CORS issues**: Same origin for API and frontend
3. **Simpler deployment**: One build process, one container
4. **Shared database**: Single persistent volume
5. **Lower cost**: One service instead of two

## Pre-Deployment Checklist

### ✅ Before Creating Railway Service

- [ ] Confirm project structure is monorepo with workspace setup
- [ ] Verify single Dockerfile exists at project root
- [ ] Confirm Express server serves static files from client build
- [ ] Check railway.json exists with single build/start command
- [ ] Verify NODE_ENV handling for production vs development

### ✅ Railway Service Creation

**STOP**: Before creating any services, verify:

- [ ] **You will create EXACTLY ONE service** (not two, not three - ONE)
- [ ] Service name: `hse-checklist` (or project name)
- [ ] GitHub repo connected: `epi-claude/hse-checklist`
- [ ] Branch: `railway-deploy-episolve` (or main deployment branch)

**If you see TWO services in Railway dashboard - DELETE BOTH and start over**

### ✅ Service Configuration

- [ ] Root Directory: `/` (leave default)
- [ ] Build Command: `npm run build` (from railway.json)
- [ ] Start Command: `npm start` (from railway.json)
- [ ] Watch Paths: leave default (deploys on any commit)

### ✅ Environment Variables

Required:
- [ ] `DATABASE_PATH=/data/production.db`
- [ ] `JWT_SECRET=<generate-random-string>`
- [ ] `NODE_ENV=production`
- [ ] `PORT=3000` (or Railway's default)

Optional:
- [ ] `CORS_ORIGIN=https://yourdomain.com` (if needed)

### ✅ Volume Configuration

- [ ] Add persistent volume
- [ ] Mount path: `/data`
- [ ] This ensures database survives redeployments

### ✅ Domain Configuration

- [ ] Note the Railway-provided domain (e.g., `*.up.railway.app`)
- [ ] Optionally add custom domain
- [ ] Update CORS_ORIGIN if using custom domain

## Common Errors and Solutions

### Error: "Two Services Created"

**Symptom**: You see two cards in Railway dashboard (e.g., "client" and "server")

**Solution**:
1. DELETE both services completely
2. Create a single new service from GitHub repo
3. Follow the checklist above

**Why This Happens**:
- Misunderstanding of architecture (thinking separate client/server needed)
- Railway UI can be confusing
- Not reading deployment guide carefully

**Prevention**:
- Always read SOP before creating services
- Remember: "SINGLE SERVICE" mantra
- Check dashboard before finalizing

### Error: "Directory does not exist"

**Symptom**: Database fails to initialize, crashes on startup

**Solution**:
- Ensure persistent volume mounted at `/data`
- Check server code creates directory if not exists:
  ```javascript
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  ```

### Error: CORS Issues

**Symptom**: API calls fail with CORS errors in browser console

**Possible Causes**:
1. Two services created (client separate from server) - DELETE and use single service
2. CORS_ORIGIN misconfigured
3. Frontend making requests to wrong URL

**Solution**:
- Use single service (Express serves both API and static files)
- Set CORS_ORIGIN correctly or remove for same-origin

### Error: Build Failures

**Common Issues**:
- Missing dependencies in package.json
- TypeScript errors
- Build script not in railway.json

**Solution**:
1. Test build locally: `npm run build`
2. Fix all TypeScript errors
3. Verify railway.json has correct commands
4. Check Railway build logs for specific errors

## Deployment Workflow

### Initial Deployment

1. ✅ Complete Pre-Deployment Checklist
2. ✅ Create SINGLE Railway service from GitHub
3. ✅ Configure environment variables
4. ✅ Add persistent volume
5. ✅ Verify deployment succeeds
6. ✅ Test application at Railway URL
7. ✅ Test database persistence (create data, redeploy, verify data exists)

### Subsequent Deployments

1. Make changes locally
2. Test locally: `npm run build && npm start`
3. Commit to deployment branch
4. Push to GitHub
5. Railway auto-deploys
6. Monitor deployment logs
7. Verify changes on production URL

## Verification Steps

After deployment, verify:

- [ ] Application loads at Railway URL
- [ ] Can register new user
- [ ] Can login
- [ ] Can create form
- [ ] Database persists after redeploy
- [ ] All API endpoints work
- [ ] No CORS errors in browser console

## Quick Reference

### Architecture Type
**Single Service**: Express + React in one container

### Key Files
- `/Dockerfile` - Builds both client and server
- `/railway.json` - Build and start commands
- `/.env.example` - Template for environment variables
- `/server/src/server.ts` - Serves static files

### Railway Service Count
**ONE** (not zero, not two - exactly ONE)

### Database Location
`/data/production.db` (persistent volume)

### Port Binding
`0.0.0.0:${PORT}` (Railway sets PORT variable)

## Lessons Learned

### Issue: Multiple Services Created
- **Date**: 2025-11-16
- **Project**: hse-checklist
- **Error**: Created two Railway services (client + server) instead of one
- **Impact**: Multiple failed deployments, wasted time debugging
- **Root Cause**: Unclear initial guidance, misunderstanding of architecture
- **Solution**: Deleted both, created single service
- **Prevention**: This SOP document, explicit "SINGLE SERVICE" warnings

### Best Practices Going Forward

1. **Always** read this SOP before Railway deployment
2. **Always** verify service count (must be ONE)
3. **Always** test build locally before deploying
4. **Always** check Railway dashboard matches expected architecture
5. **Never** create multiple services unless explicitly documented otherwise

---

**Last Updated**: 2025-11-16
**Applies To**: Express + React monorepo projects with SQLite
**Related Docs**: RAILWAY_DEPLOYMENT_COMPLETE_GUIDE.md, RAILWAY_DEPLOYMENT_NEXT_STEPS.md
