# 🚀 Railway Deployment Guide - Next Steps

This guide walks you through deploying the Get Thin MD Funnel Analytics platform to Railway.

---

## ✅ Pre-Deployment Checklist

Before deploying, make sure you have:

- [x] GitHub repository created: `https://github.com/cro4080marketing/getthin-funnel-analytics`
- [ ] Railway account (sign up at https://railway.app if needed)
- [ ] Embeddables API key
- [ ] Slack webhook URL
- [ ] Anthropic API key (for AI features)

---

## 📋 Step-by-Step Deployment

### Step 1: Push Code to GitHub

```bash
# Navigate to project directory
cd getthin-funnel-analytics

# Check git status
git status

# Add all files
git add .

# Commit changes
git commit -m "Initial deployment setup"

# Push to GitHub
git push origin main
```

### Step 2: Create Railway Project

1. **Go to Railway**: https://railway.app
2. **Sign in** with your GitHub account
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose**: `cro4080marketing/getthin-funnel-analytics`
6. Railway will automatically:
   - Detect Next.js application
   - Install dependencies
   - Build the application
   - Start the server

### Step 3: Add PostgreSQL Database

1. In your Railway project dashboard
2. **Click "+ New"** → **Database** → **PostgreSQL**
3. Railway will automatically:
   - Provision a PostgreSQL instance
   - Create `DATABASE_URL` environment variable
   - Link it to your application

### Step 4: Add Redis Cache

1. **Click "+ New"** → **Database** → **Redis**
2. Railway will automatically:
   - Provision a Redis instance
   - Create `REDIS_URL` environment variable
   - Link it to your application

### Step 5: Configure Environment Variables

1. Click on your **app service** (not the database)
2. Go to the **"Variables"** tab
3. Click **"+ New Variable"**
4. Add these **required** variables:

```bash
# Required API Keys
EMBEDDABLES_API_KEY=your_embeddables_api_key_here
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Application URL (Railway provides this, but you can customize)
NEXT_PUBLIC_APP_URL=https://your-app-name.up.railway.app

# Node Environment
NODE_ENV=production

# Cron Job Security (generate a random string)
CRON_SECRET=your_secure_random_string_here
```

5. **Optional variables** (these have defaults):

```bash
# Alert Configuration
ALERT_CHECK_INTERVAL_MINUTES=15
DAILY_REPORT_TIME=08:00
DAILY_REPORT_TIMEZONE=America/New_York

# Alert Thresholds
ALERT_DROPOFF_THRESHOLD_1DAY=15
ALERT_DROPOFF_THRESHOLD_7DAY=10
ALERT_CONVERSION_THRESHOLD_1DAY=20
ALERT_CONVERSION_THRESHOLD_7DAY=15
```

### Step 6: Deploy & Verify

1. Railway will **automatically redeploy** when you add variables
2. Wait for deployment to complete (usually 2-5 minutes)
3. Check the **"Deployments"** tab for status
4. Click on the **latest deployment** to see logs

**Your app is now live!** 🎉

URL will be something like: `https://getthin-funnel-analytics-production.up.railway.app`

### Step 7: Initialize Database

The database schema will be automatically created on first deployment via `prisma generate` in the build script.

To verify:
1. Click on your **PostgreSQL service** in Railway
2. Click **"Data"** tab
3. You should see tables: `Funnel`, `FunnelStep`, `Alert`, etc.

---

## ⏱️ Setting Up Cron Jobs

Railway has two options for cron jobs:

### Option A: Railway Cron (Recommended)

1. In your Railway project, click **"+ New"**
2. Select **"Cron Job"**
3. Configure each cron:

**Data Sync** (every 15 minutes):
```
Schedule: */15 * * * *
Command: curl -X GET https://your-app.railway.app/api/cron/sync-data -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Alert Check** (every 15 minutes):
```
Schedule: */15 * * * *
Command: curl -X GET https://your-app.railway.app/api/cron/check-alerts -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Daily Report** (8:00 AM EST = 1:00 PM UTC):
```
Schedule: 0 13 * * *
Command: curl -X GET https://your-app.railway.app/api/cron/daily-report -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Option B: External Cron Service

If Railway cron isn't available, use services like:
- **EasyCron** (https://www.easycron.com)
- **Cron-job.org** (https://cron-job.org)
- **AWS EventBridge**

---

## 🧪 Testing Your Deployment

### 1. Test the Application

Visit your Railway URL: `https://your-app.railway.app`

You should see the dashboard homepage.

### 2. Test API Endpoints

```bash
# Replace YOUR_URL with your actual Railway URL
export APP_URL="https://your-app.railway.app"
export CRON_SECRET="your_cron_secret"

# Test data sync
curl -X GET "$APP_URL/api/cron/sync-data" \
  -H "Authorization: Bearer $CRON_SECRET"

# Expected response: {"success": true, "recordsProcessed": X, ...}
```

### 3. Test Slack Integration

The data sync or alert check should automatically send a test message to Slack if configured correctly.

### 4. Check Logs

1. Go to Railway dashboard
2. Click on your app service
3. Click **"Deployments"**
4. Click on the latest deployment
5. View **"Logs"** to see application output

---

## 🔧 Post-Deployment Configuration

### Custom Domain (Optional)

1. Go to your app service in Railway
2. Click **"Settings"**
3. Scroll to **"Domains"**
4. Click **"+ Custom Domain"**
5. Add your domain (e.g., `analytics.getthin.md`)
6. Add the CNAME record to your DNS:
   ```
   CNAME analytics -> your-app.up.railway.app
   ```

### Environment-Specific Settings

Railway allows you to have different environments:

1. Click **"Settings"** → **"Environments"**
2. Create **"Staging"** and **"Production"** environments
3. Set different variables for each

---

## 📊 Monitoring Your Application

### Railway Metrics

1. Go to your app service
2. Click **"Metrics"**
3. View:
   - CPU usage
   - Memory usage
   - Network traffic
   - Request count

### Database Monitoring

1. Click on **PostgreSQL service**
2. Click **"Metrics"**
3. Monitor:
   - Connection count
   - Query performance
   - Database size

### Application Logs

1. Click **"Deployments"** → **Latest deployment**
2. Click **"Logs"**
3. Filter by:
   - `[Sync]` - Data sync jobs
   - `[Alert]` - Alert detection
   - `[Report]` - Daily reports
   - `Error` - Application errors

---

## 🚨 Troubleshooting

### Deployment Failed

**Check build logs:**
1. Go to **"Deployments"**
2. Click failed deployment
3. Review build logs for errors

**Common issues:**
- Missing environment variables
- Database connection failure
- Build timeout

### Database Connection Errors

```bash
# Verify DATABASE_URL is set
# In Railway Variables tab, ensure DATABASE_URL exists

# Check database is running
# Click PostgreSQL service, ensure it's "Running"
```

### Cron Jobs Not Running

1. **Verify cron secret matches** in:
   - Railway Variables (`CRON_SECRET`)
   - Cron job command (`Authorization: Bearer ...`)

2. **Check cron job logs:**
   - Railway → Cron Job service → Logs

3. **Test manually:**
   ```bash
   curl -X GET "https://your-app.railway.app/api/cron/sync-data" \
     -H "Authorization: Bearer YOUR_CRON_SECRET" \
     -v
   ```

### Slack Notifications Not Working

1. **Test webhook directly:**
   ```bash
   curl -X POST "$SLACK_WEBHOOK_URL" \
     -H 'Content-Type: application/json' \
     -d '{"text":"Test from Railway"}'
   ```

2. **Check variable is set:**
   - Railway → Variables → `SLACK_WEBHOOK_URL`

3. **Review logs for errors:**
   - Look for `[Slack]` in application logs

---

## 🎯 Next Steps

After successful deployment:

1. ✅ **Verify cron jobs are running**
   - Check Slack for sync confirmations
   - Check logs for cron execution

2. ✅ **Test alert system**
   - Wait for first data sync
   - Verify alerts appear in Slack

3. ✅ **Review daily report**
   - Wait for scheduled time (8 AM EST)
   - Check Slack for report delivery

4. ✅ **Access dashboard**
   - Visit your Railway URL
   - Explore funnel analytics

5. ✅ **Monitor performance**
   - Check Railway metrics
   - Review application logs

---

## 📞 Need Help?

### Railway Support
- **Documentation**: https://docs.railway.app
- **Discord**: https://discord.gg/railway
- **Status**: https://railway.app/status

### Application Issues
- Check **Railway logs** first
- Review **Embeddables API documentation**
- Contact **4080 Marketing dev team**

---

## ✨ Success!

Your funnel analytics platform is now deployed and running on Railway! 

**What's deployed:**
- ✅ Next.js application
- ✅ PostgreSQL database
- ✅ Redis cache
- ✅ Automated data sync
- ✅ Alert detection system
- ✅ Daily reporting
- ✅ Slack integration

**Next phase:**
- Monitor for a few days
- Adjust alert thresholds based on false positives
- Add team members to Slack channel
- Customize dashboard based on feedback
