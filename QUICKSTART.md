# Quick Start Guide

Get your funnel analytics platform deployed in 30 minutes.

## Prerequisites
- ✅ GitHub repo: https://github.com/cro4080marketing/getthin-funnel-analytics
- ✅ Railway account: https://railway.app
- ⏳ Embeddables API key
- ⏳ Slack webhook URL
- ⏳ Anthropic API key (optional for Phase 1)

---

## 5 Steps to Deploy

### Step 1: Push Code to GitHub (2 minutes)

\`\`\`bash
# Navigate to your project directory
cd /path/to/getthin-funnel-analytics

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Funnel analytics platform"

# Add remote (already exists)
git remote add origin https://github.com/cro4080marketing/getthin-funnel-analytics.git

# Push
git push -u origin main
\`\`\`

### Step 2: Deploy to Railway (5 minutes)

1. Go to **[railway.app](https://railway.app)**
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select: `cro4080marketing/getthin-funnel-analytics`
4. Click **"Deploy Now"**

### Step 3: Add Databases (3 minutes)

**Add PostgreSQL:**
1. Click **"New"** → **"Database"** → **"Add PostgreSQL"**

**Add Redis:**
1. Click **"New"** → **"Database"** → **"Add Redis"**

Railway automatically links these to your app.

### Step 4: Configure Environment Variables (5 minutes)

Go to your app service → **Variables** tab → Add:

\`\`\`env
EMBEDDABLES_API_KEY=your_key_here
EMBEDDABLES_API_URL=https://api.embeddables.com/v1
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
SLACK_CHANNEL=#funnel-alerts
ANTHROPIC_API_KEY=your_anthropic_key_here
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app-name.railway.app
\`\`\`

**Note**: Get your Railway URL from the deployment, then update `NEXT_PUBLIC_APP_URL`.

### Step 5: Verify Deployment (2 minutes)

1. Click on your Railway deployment URL
2. You should see the dashboard welcome page
3. Check that it says "Database: Connected" and "Redis Cache: Ready"

---

## ✅ You're Deployed!

Your platform is now live at: `https://your-app-name.railway.app`

---

## Next: Enable Automated Monitoring

### Set Up Cron Jobs (10 minutes)

Go to **[cron-job.org](https://cron-job.org)** and create 3 jobs:

**1. Data Sync** (Every 15 minutes)
\`\`\`
URL: https://your-app-name.railway.app/api/cron/sync-data
Schedule: */15 * * * *
Method: POST
\`\`\`

**2. Alert Check** (Every 15 minutes)
\`\`\`
URL: https://your-app-name.railway.app/api/cron/check-alerts
Schedule: */15 * * * *
Method: POST
\`\`\`

**3. Daily Report** (Daily at 8 AM EST)
\`\`\`
URL: https://your-app-name.railway.app/api/cron/daily-report
Schedule: 0 13 * * *
Method: POST
\`\`\`

---

## What's Next?

Now that your infrastructure is deployed, the next phase is to build out the core functionality:

### Phase 2: Core Development (This Week)
1. Implement Funnel API routes
2. Build data sync service (connect to Embeddables)
3. Create alert detection logic
4. Build dashboard UI components

See **[PROJECT_STATUS.md](PROJECT_STATUS.md)** for the complete roadmap.

---

## Quick Links

- 📖 **Full README**: [README.md](README.md)
- 🚂 **Railway Guide**: [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)
- 📊 **Project Status**: [PROJECT_STATUS.md](PROJECT_STATUS.md)
- 🐛 **Issues**: Report on GitHub

---

## Troubleshooting

**Build Failed?**
- Check Railway logs for errors
- Verify all dependencies are in package.json
- Ensure DATABASE_URL is set

**Can't Access App?**
- Wait 2-3 minutes for deployment to complete
- Check that all environment variables are set
- Verify PostgreSQL and Redis are running

**Database Not Connected?**
- Check DATABASE_URL is set automatically by Railway
- Try redeploying the service

---

**Need Help?** Check the troubleshooting section in [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)
