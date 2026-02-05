# Railway Deployment Guide

This guide walks you through deploying the Get Thin MD Funnel Analytics platform to Railway.

## Prerequisites

- GitHub repository: `https://github.com/cro4080marketing/getthin-funnel-analytics`
- Railway account (sign up at [railway.app](https://railway.app))
- Embeddables API key
- Slack webhook URL
- Anthropic API key

## Step-by-Step Deployment

### 1. Push Code to GitHub

First, push your local code to the GitHub repository:

\`\`\`bash
cd /path/to/getthin-funnel-analytics

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Funnel analytics platform"

# Add remote
git remote add origin https://github.com/cro4080marketing/getthin-funnel-analytics.git

# Push to main branch
git push -u origin main
\`\`\`

### 2. Create Railway Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub account
5. Select the repository: `cro4080marketing/getthin-funnel-analytics`
6. Click **"Deploy Now"**

### 3. Add PostgreSQL Database

1. In your Railway project, click **"New"**
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Railway will automatically:
   - Provision a PostgreSQL database
   - Set the \`DATABASE_URL\` environment variable
   - Link it to your application

### 4. Add Redis Cache

1. In your Railway project, click **"New"**
2. Select **"Database"**
3. Choose **"Add Redis"**
4. Railway will automatically:
   - Provision a Redis instance
   - Set the \`REDIS_URL\` environment variable
   - Link it to your application

### 5. Configure Environment Variables

In your Railway project:

1. Select your application service (the one connected to GitHub)
2. Go to the **"Variables"** tab
3. Add the following environment variables:

\`\`\`
# Embeddables API
EMBEDDABLES_API_KEY=your_embeddables_api_key_here
EMBEDDABLES_API_URL=https://api.embeddables.com/v1

# Slack Integration
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
SLACK_CHANNEL=#funnel-alerts

# Anthropic API
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Application Settings
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app-name.railway.app

# Alert Configuration
ALERT_CHECK_INTERVAL_MINUTES=15
DAILY_REPORT_TIME=08:00
DAILY_REPORT_TIMEZONE=America/New_York

# Alert Thresholds
ALERT_DROPOFF_THRESHOLD_1DAY=15
ALERT_DROPOFF_THRESHOLD_7DAY=10
ALERT_CONVERSION_THRESHOLD_1DAY=20
ALERT_CONVERSION_THRESHOLD_7DAY=15
ALERT_VOLUME_THRESHOLD_1DAY=30
ALERT_VOLUME_THRESHOLD_7DAY=25
\`\`\`

**Note**: \`DATABASE_URL\` and \`REDIS_URL\` are automatically set by Railway when you add those services.

### 6. Update App URL

After deployment:

1. Railway will assign you a domain like \`your-app-name.railway.app\`
2. Go back to **Variables** tab
3. Update \`NEXT_PUBLIC_APP_URL\` with your actual Railway domain
4. The app will automatically redeploy

### 7. Initialize Database

The database schema will be automatically created on first deployment because of the \`postinstall\` script in \`package.json\`.

To verify:

1. In Railway, click on your PostgreSQL service
2. Go to the **"Data"** tab
3. You should see all the tables (Funnel, FunnelStep, FunnelAnalytics, etc.)

Alternatively, you can run migrations manually:

\`\`\`bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run npx prisma db push
\`\`\`

### 8. Set Up Cron Jobs

Railway doesn't have built-in cron scheduling, so you'll need to use an external service to trigger your cron endpoints.

#### Option A: Use Cron-Job.org (Recommended)

1. Go to [cron-job.org](https://cron-job.org) and create a free account
2. Create three cron jobs:

**Data Sync Job** (Every 15 minutes)
- URL: \`https://your-app-name.railway.app/api/cron/sync-data\`
- Schedule: \`*/15 * * * *\` (every 15 minutes)
- Method: POST
- Auth: Add a secret header if you implement auth

**Alert Check Job** (Every 15 minutes)
- URL: \`https://your-app-name.railway.app/api/cron/check-alerts\`
- Schedule: \`*/15 * * * *\` (every 15 minutes)
- Method: POST

**Daily Report Job** (Daily at 8 AM EST)
- URL: \`https://your-app-name.railway.app/api/cron/daily-report\`
- Schedule: \`0 13 * * *\` (8 AM EST = 1 PM UTC)
- Method: POST

#### Option B: Use EasyCron

Similar setup to Cron-Job.org but with different interface.

#### Option C: Use GitHub Actions

Create \`.github/workflows/cron.yml\`:

\`\`\`yaml
name: Cron Jobs

on:
  schedule:
    - cron: '*/15 * * * *'  # Every 15 minutes

jobs:
  sync-data:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger sync
        run: |
          curl -X POST https://your-app-name.railway.app/api/cron/sync-data
          
  check-alerts:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger alerts
        run: |
          curl -X POST https://your-app-name.railway.app/api/cron/check-alerts
\`\`\`

### 9. Test Your Deployment

1. Visit your Railway app URL: \`https://your-app-name.railway.app\`
2. You should see the dashboard landing page
3. Check the logs in Railway dashboard to ensure no errors

### 10. Set Up Custom Domain (Optional)

If you want a custom domain like \`analytics.getthinmd.com\`:

1. In Railway, go to your app service
2. Click **"Settings"**
3. Scroll to **"Domains"**
4. Click **"Custom Domain"**
5. Enter your domain and follow the DNS setup instructions

## Monitoring Your Deployment

### View Logs

In Railway:
1. Select your application service
2. Go to the **"Deployments"** tab
3. Click on the latest deployment
4. View real-time logs

### Check Build Status

Railway shows build status in real-time. If the build fails:
1. Check the build logs for errors
2. Fix any issues in your code
3. Push to GitHub - Railway will automatically redeploy

### Database Access

To query your database:

\`\`\`bash
# Using Railway CLI
railway run npx prisma studio

# Or connect directly using the DATABASE_URL
psql $DATABASE_URL
\`\`\`

## Troubleshooting

### Build Failures

**Issue**: Build fails with "Module not found"
**Solution**: Ensure all dependencies are in \`package.json\` and run \`npm install\` locally first

**Issue**: Prisma generation fails
**Solution**: Check that \`postinstall\` script is in \`package.json\`:
\`\`\`json
"postinstall": "prisma generate"
\`\`\`

### Runtime Errors

**Issue**: Database connection fails
**Solution**: Ensure PostgreSQL service is running and \`DATABASE_URL\` is set

**Issue**: Redis connection fails
**Solution**: Ensure Redis service is running and \`REDIS_URL\` is set

### Environment Variables

**Issue**: Environment variables not working
**Solution**: 
1. Double-check variable names (case-sensitive)
2. Restart the service after adding variables
3. Ensure no extra spaces in values

## Updating Your Application

To deploy updates:

\`\`\`bash
# Make your changes
git add .
git commit -m "Description of changes"
git push origin main
\`\`\`

Railway automatically deploys when you push to the main branch.

### Rollback

If something goes wrong:
1. In Railway, go to **"Deployments"**
2. Find a previous working deployment
3. Click the three dots → **"Redeploy"**

## Cost Estimates

Railway Pricing (as of 2024):
- **Starter Plan**: $5/month
  - Includes: 500 hours of usage, unlimited projects
  - PostgreSQL: ~$5-10/month depending on usage
  - Redis: ~$5/month depending on usage
  
**Total Estimated Cost**: ~$15-20/month for production use

---

## Next Steps After Deployment

1. ✅ Verify all services are running
2. ✅ Test the dashboard at your Railway URL
3. ⏳ Set up cron jobs for automated monitoring
4. ⏳ Configure Slack webhook and test notifications
5. ⏳ Run initial data sync from Embeddables
6. ⏳ Monitor logs for any errors
7. ⏳ Set up custom domain (optional)

**Questions?** Check the main [README.md](README.md) or contact the dev team.
