# 🚀 Quick Deployment Checklist

Use this checklist to deploy to Railway in under 15 minutes.

## ✅ Pre-Flight Checklist

### Information You Need
- [ ] **Embeddables API Key** - Get from Embeddables dashboard
- [ ] **Slack Webhook URL** - Create at https://api.slack.com/messaging/webhooks
- [ ] **Anthropic API Key** - Get from https://console.anthropic.com

### Accounts to Create (if needed)
- [ ] Railway account - https://railway.app (free tier available)
- [ ] GitHub account - https://github.com (for repo access)

---

## 📤 Step 1: Push to GitHub (2 minutes)

```bash
cd getthin-funnel-analytics
git status
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

**Verify:** Visit https://github.com/cro4080marketing/getthin-funnel-analytics

---

## 🚂 Step 2: Deploy to Railway (3 minutes)

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose **`cro4080marketing/getthin-funnel-analytics`**
5. Wait for initial deployment (auto-detects Next.js)

---

## 🗄️ Step 3: Add Databases (2 minutes)

### PostgreSQL
1. Click **"+ New"** → **Database** → **PostgreSQL**
2. Wait for provisioning (~30 seconds)
3. ✅ `DATABASE_URL` automatically added

### Redis
1. Click **"+ New"** → **Database** → **Redis**
2. Wait for provisioning (~30 seconds)
3. ✅ `REDIS_URL` automatically added

---

## 🔧 Step 4: Add Environment Variables (5 minutes)

Click on your app service → **Variables** tab → **+ New Variable**

### Required Variables

```bash
EMBEDDABLES_API_KEY=paste_your_key_here
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK
ANTHROPIC_API_KEY=paste_your_key_here
NODE_ENV=production
CRON_SECRET=generate_random_string_here
```

**Pro tip:** Generate CRON_SECRET with:
```bash
openssl rand -hex 32
```

### Your App URL

Railway provides this automatically. Find it at:
- Settings → Domains → Copy the `.railway.app` URL
- Add as: `NEXT_PUBLIC_APP_URL=https://your-app.railway.app`

---

## ⏱️ Step 5: Set Up Cron Jobs (3 minutes)

### Option 1: Railway Cron (if available)

Click **"+ New"** → **"Cron Job"** for each:

**Data Sync:**
```
Schedule: */15 * * * *
Command: curl -X GET https://your-app.railway.app/api/cron/sync-data -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Alert Check:**
```
Schedule: */15 * * * *
Command: curl -X GET https://your-app.railway.app/api/cron/check-alerts -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Daily Report:**
```
Schedule: 0 13 * * *
Command: curl -X GET https://your-app.railway.app/api/cron/daily-report -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Option 2: Use EasyCron or Cron-job.org

Sign up and create the same three cron jobs with the commands above.

---

## ✨ Step 6: Verify Deployment (5 minutes)

### 1. Visit Your App
Go to: `https://your-app.railway.app`

**Expected:** Dashboard homepage loads

### 2. Check Logs
Railway → Your App → Deployments → Latest → Logs

**Look for:**
- `✓ Starting...`
- `Ready on http://0.0.0.0:3000`
- No error messages

### 3. Test Data Sync
```bash
curl -X GET "https://your-app.railway.app/api/cron/sync-data" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Expected response:**
```json
{
  "success": true,
  "recordsProcessed": 1,
  "duration": 2341
}
```

### 4. Check Slack
Within 15-30 minutes, you should receive:
- Data sync confirmation
- Any alerts (if issues detected)

---

## 🎯 Next Steps

After successful deployment:

1. **Monitor for 24 hours**
   - Check Slack for alerts
   - Review dashboard data
   - Verify cron jobs run on schedule

2. **Adjust thresholds** (if needed)
   - Too many false positive alerts?
   - Update threshold variables in Railway

3. **Share with team**
   - Add team members to Slack channel
   - Share dashboard URL
   - Gather feedback

4. **Phase 2 Features** (optional)
   - Add Apify API key for screenshots
   - Enable A/B test analysis
   - Custom dashboard views

---

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check Railway logs for errors. Likely missing env variable. |
| Database errors | Verify `DATABASE_URL` exists in Variables tab. Check PostgreSQL is running. |
| No Slack notifications | Test webhook URL manually. Check SLACK_WEBHOOK_URL is correct. |
| Cron not running | Verify CRON_SECRET matches. Test endpoints manually with curl. |
| 500 errors | Check application logs. Look for stack traces. |

---

## 📞 Need Help?

**See detailed guides:**
- `DEPLOYMENT_GUIDE.md` - Full Railway deployment guide
- `README.md` - Complete project documentation

**Railway Support:**
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

---

## ✅ Deployment Complete!

Once all checkboxes are ✅, your funnel analytics platform is live and monitoring your quiz funnels 24/7!

**What you've deployed:**
- Real-time funnel analytics dashboard
- Automated alert detection system
- Daily performance reports to Slack
- AI-powered recommendations
- Scalable infrastructure on Railway

**Time to value:** Your first insights in < 30 minutes! 🚀
