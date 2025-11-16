# Transfer Repository to epi-claude Account

## Method 1: GitHub Repository Transfer (Recommended)

### Steps:

1. **Go to GitHub Repository Settings**
   - Navigate to: https://github.com/rdbrdb/hse-checklist
   - Click "Settings" (top right)
   - Scroll to "Danger Zone"

2. **Transfer Repository**
   - Click "Transfer"
   - New owner: `epi-claude`
   - Confirm transfer

3. **Update Local Git Remote**
   ```bash
   cd /Users/rdb/Projects/Claude/hse-checklist
   git remote set-url origin https://github.com/epi-claude/hse-checklist.git
   git remote -v  # Verify
   ```

4. **Push to New Remote**
   ```bash
   git push -u origin railway-deploy-episolve
   ```

---

## Method 2: Create New Repository Under epi-claude

If you can't transfer (not owner or prefer fresh start):

### Steps:

1. **Create New Repository on GitHub**
   - Login as epi-claude
   - Go to: https://github.com/new
   - Repository name: `hse-checklist`
   - Make it Private or Public
   - DO NOT initialize with README
   - Click "Create repository"

2. **Update Local Git Remote**
   ```bash
   cd /Users/rdb/Projects/Claude/hse-checklist
   git remote set-url origin https://github.com/epi-claude/hse-checklist.git
   git remote -v  # Verify
   ```

3. **Push All Branches**
   ```bash
   # Push deployment branch
   git push -u origin railway-deploy-episolve

   # Optional: Push main branch too
   git push -u origin main
   ```

---

## Verify Remote Changed

```bash
git remote -v
```

Should show:
```
origin  https://github.com/epi-claude/hse-checklist.git (fetch)
origin  https://github.com/epi-claude/hse-checklist.git (push)
```

---

## Railway Setup with epi-claude Account

### Steps:

1. **Login to Railway**
   - Go to: https://railway.app
   - **Logout** if currently logged in as different account
   - Click "Login with GitHub"
   - **Authorize as epi-claude GitHub account**

2. **Connect GitHub Account**
   - Railway → Settings → GitHub
   - Ensure connected as `epi-claude`

3. **Create New Project**
   - Click "New Project"
   - "Deploy from GitHub repo"
   - Select: `epi-claude/hse-checklist`
   - Branch: `railway-deploy-episolve`

4. **Continue with Normal Deployment**
   - Follow RAILWAY_DEPLOYMENT_NEXT_STEPS.md
   - Set environment variables
   - Add persistent volume
   - Deploy!

---

## Git Configuration for epi-claude

If you want commits from this project to show as epi-claude:

```bash
# Set local git config for this repo only
cd /Users/rdb/Projects/Claude/hse-checklist
git config user.name "epi-claude"
git config user.email "claude@episolve.com"

# Verify
git config user.name
git config user.email
```

This only affects this repository, not your global git config.

---

## Summary

**Recommended Flow:**
1. Transfer or create repo under `epi-claude` GitHub account
2. Update local git remote to new URL
3. Push railway-deploy-episolve branch
4. Login to Railway as epi-claude (via GitHub OAuth)
5. Deploy from epi-claude/hse-checklist repository

This keeps everything under the episolve.com/epi-claude account.
