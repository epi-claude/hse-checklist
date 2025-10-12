# Railway Deployment Guide

This guide will help you deploy your Health & Safety Checklist application to Railway.

## Quick Start (Deploy Now!)

Railway CLI is already installed. Let's deploy:

### Step 1: Login to Railway

```bash
railway login
```

This will open your browser to authenticate.

### Step 2: Initialize Project

```bash
cd /Users/rdb/Projects/Claude/hse-checklist
railway init
```

This will:
- Create a new Railway project
- Link it to your local directory

### Step 3: Deploy

```bash
railway up
```

That's it! Railway will:
- Auto-detect your Node.js monorepo
- Build both client and server
- Deploy everything
- Give you a live URL

## What Railway Does Automatically

✅ **Auto-detects monorepo** - Handles your client/server structure
✅ **Builds both services** - Runs `npm run build:all`
✅ **Sets up database** - SQLite with persistent volumes
✅ **Generates domain** - Your app gets a `.railway.app` URL
✅ **Environment variables** - Auto-configured

## Access Your App

After deployment completes:

```bash
railway open
```

Or check the dashboard:
```bash
railway status
```

Your app will be at: `https://[your-project].up.railway.app`

## Environment Variables

Railway needs these environment variables (set automatically or manually):

```bash
# Set production environment
railway variables set NODE_ENV=production

# Set JWT secret (Railway can generate this)
railway variables set JWT_SECRET=$(openssl rand -base64 32)

# Set CORS origin (after you get your Railway URL)
railway variables set CORS_ORIGIN=https://your-project.up.railway.app
```

## Update Your App

To deploy updates:

```bash
# Make changes
git add .
git commit -m "Your changes"

# Deploy
railway up
```

## View Logs

```bash
railway logs
```

## SQLite Database

Railway automatically provisions persistent storage for your SQLite database:

- Database file: `database/production.db`
- Persistent across deploys
- Automatic backups

## Costs

Railway offers:
- **$5 free credit per month** (enough for demos)
- **Pay-as-you-go** after credit runs out
- **No credit card required** for trial

## Troubleshooting

### Check Service Status
```bash
railway status
```

### View Logs
```bash
railway logs
```

### Shell Access
```bash
railway shell
```

### Check Variables
```bash
railway variables
```

## Advanced Configuration

If you need more control, create a `railway.toml`:

```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm run start:production"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

## Next Steps

1. **Custom Domain**: Add in Railway dashboard
2. **Monitor Usage**: Check dashboard for credit usage
3. **Scale**: Upgrade plan if needed

## Useful Commands

```bash
railway login          # Authenticate
railway init           # Create new project
railway link           # Link to existing project
railway up             # Deploy
railway open           # Open in browser
railway logs           # View logs
railway status         # Check status
railway variables      # Manage env vars
railway shell          # SSH into service
```

## Support

- Railway Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
