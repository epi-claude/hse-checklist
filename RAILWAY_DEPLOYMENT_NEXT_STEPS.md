# Railway Deployment - Next Steps

## ✅ Completed (Phase 1-7)

All preparation work is complete! Your project is **ready for Railway deployment**.

### What We Did:

1. ✅ **Created deployment branch**: `railway-deploy-episolve`
2. ✅ **Added Railway configuration files**:
   - `Dockerfile` (simplified, no Chromium)
   - `railway.json`
   - `.dockerignore`
   - `.npmrc`
   - `.env.example`

3. ✅ **Converted server to CommonJS**:
   - Removed ES module syntax
   - Updated imports (removed .js extensions)
   - Updated tsconfig.json and package.json

4. ✅ **Updated build scripts** for Railway
5. ✅ **Tested locally** - all working! ✨
6. ✅ **Exported database** backups
7. ✅ **Committed changes** to git

---

## 🚀 Next Steps (You Need to Do)

### Step 1: Push to GitHub

```bash
# Make sure you're on the deployment branch
git checkout railway-deploy-episolve

# Push to GitHub (use your credentials)
git push -u origin railway-deploy-episolve
```

### Step 2: Deploy to Railway

#### Option A: Railway Dashboard (Recommended)

1. **Go to Railway**: https://railway.app
2. **Sign in** with your GitHub account
3. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose: `rdbrdb/hse-checklist`
   - Select branch: `railway-deploy-episolve`

4. **Railway Auto-Detection**:
   - Railway will detect the `Dockerfile`
   - Build will start automatically
   - Watch the build logs

5. **Configure Environment Variables** (Critical!):

   Go to your service → Variables tab → Add these:

   ```env
   NODE_ENV=production
   ```

   ```env
   DATABASE_PATH=/data/production.db
   ```

   ```env
   JWT_SECRET=<paste-your-secret-here>
   ```

   **Generate JWT_SECRET**:
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and paste as JWT_SECRET value.

6. **Add Persistent Volume** (CRITICAL!):

   - Go to: Settings → Volumes
   - Click "+ New Volume"
   - **Mount Path**: `/data`
   - **Size**: 1GB
   - Click "Add"

   **⚠️ Without this, your database will be lost on every deployment!**

7. **Wait for Deployment**:
   - First build takes ~3-5 minutes
   - Green checkmark = success!
   - Railway assigns a URL

#### Option B: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up

# Watch logs
railway logs
```

---

### Step 3: Verify Deployment

#### 3.1: Get Your Railway URL

From Railway dashboard:
- Go to your service
- Click "Settings" tab
- See "Domains" section
- Your URL: `https://hse-checklist-production.up.railway.app` (example)

#### 3.2: Test Endpoints

**Health Check**:
```bash
curl https://your-app.railway.app/health
```

Expected:
```json
{
  "status": "ok",
  "timestamp": "2025-11-15T..."
}
```

**Frontend**:
```bash
# Open in browser
open https://your-app.railway.app
```

Check:
- ✅ Page loads
- ✅ No console errors
- ✅ Can navigate to login
- ✅ Can register/login
- ✅ Can create forms

#### 3.3: Test Database Persistence (CRITICAL!)

1. Create a test user account
2. Note the email/password
3. Trigger a redeploy:
   ```bash
   git commit --allow-empty -m "Test database persistence"
   git push
   ```
4. Wait for Railway to redeploy
5. Try to login with same credentials
6. **If successful**: ✅ Database persistence working!
7. **If failed**: ⚠️ Check volume configuration

---

### Step 4: Migrate Existing Data (Optional)

If you want to migrate your existing user and form submission:

#### Install Railway CLI
```bash
npm install -g @railway/cli
railway login
railway link  # Link to your Railway project
```

#### Restore Database
```bash
railway run sqlite3 /data/production.db < server/database/data-backup.sql
```

#### Verify
```bash
railway run sqlite3 /data/production.db "SELECT COUNT(*) FROM users;"
# Should output: 1
```

---

## 📊 Deployment Checklist

After deployment, verify:

- [ ] Build succeeds in Railway (green checkmark)
- [ ] Health endpoint returns 200: `/health`
- [ ] Frontend loads in browser
- [ ] Static assets load (CSS, images)
- [ ] Can register new user
- [ ] Can login
- [ ] Can create form
- [ ] Can view dashboard
- [ ] Database persists after redeploy (MOST CRITICAL!)
- [ ] No errors in Railway logs

---

## 🔧 Environment Variables Summary

**Required in Railway Dashboard → Variables**:

| Variable | Value | How to Generate |
|----------|-------|----------------|
| `NODE_ENV` | `production` | Fixed value |
| `DATABASE_PATH` | `/data/production.db` | Fixed value (matches volume mount) |
| `JWT_SECRET` | `<random-string>` | `openssl rand -base64 32` |

**Optional**:
| Variable | Value | Purpose |
|----------|-------|---------|
| `JWT_EXPIRATION` | `7d` | Token expiration (default: 7 days) |
| `CORS_ORIGIN` | `*` | CORS origin (default: all) |

---

## 🎯 Success Criteria

Your deployment is successful when:

1. ✅ Railway build completes (green checkmark)
2. ✅ Health endpoint accessible
3. ✅ Frontend loads correctly
4. ✅ Can register and login
5. ✅ Can create and save forms
6. ✅ **Database persists across redeployments**
7. ✅ No errors in Railway deployment logs

---

## 🚨 Troubleshooting

### Build Fails

Check Railway build logs for specific errors. Common issues:
- Missing dependencies: Update package.json
- TypeScript errors: Check server/src/ files
- Docker errors: Review Dockerfile

### App Not Accessible

1. Check Railway logs for startup errors
2. Verify PORT binding (should be `0.0.0.0`)
3. Check environment variables are set

### Database Lost After Redeploy

1. Check volume is mounted at `/data`
2. Verify `DATABASE_PATH=/data/production.db`
3. Ensure volume shows as "Active" in Railway

### 404 on Routes

1. Verify static file serving in server.ts
2. Check catch-all route is after API routes
3. Ensure client built correctly

---

## 📚 Reference Documents

- **Full Deployment Guide**: `RAILWAY_DEPLOYMENT_COMPLETE_GUIDE.md`
- **Database Migration**: `RAILWAY_MIGRATION_README.md`
- **Environment Template**: `.env.example`

---

## 🎉 After Successful Deployment

### Merge to Main

```bash
git checkout main
git merge railway-deploy-episolve
git push origin main
```

### Update Railway to Track Main

In Railway dashboard:
- Settings → Deployment
- Change branch from `railway-deploy-episolve` to `main`
- Future pushes to main will auto-deploy

### Set Up Custom Domain (Optional)

Railway dashboard:
- Settings → Domains
- Add custom domain
- Update DNS records as instructed

---

## 🆘 Need Help?

**Railway Resources**:
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

**Project-Specific Issues**:
- Check build logs in Railway dashboard
- Review the deployment guide
- Verify all environment variables are set
- Ensure persistent volume is mounted

---

## 📝 Summary

**Current Status**: ✅ **Code is ready for Railway deployment!**

**What You Need to Do**:
1. Push branch to GitHub
2. Create Railway project from repo
3. Set environment variables (3 required)
4. Add persistent volume at `/data` (1GB)
5. Deploy and verify
6. Test database persistence

**Estimated Time**: 20-30 minutes

**Expected Result**: Fully deployed HSE Checklist app on Railway with persistent database

---

**Good luck with your deployment! 🚀**

*Last Updated: 2025-11-15*
*Branch: railway-deploy-episolve*
*Ready for: Production deployment*
