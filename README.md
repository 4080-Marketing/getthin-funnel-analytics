# Get Thin MD - Funnel Analytics Platform

Real-time analytics and monitoring system for medical questionnaire funnels at Get Thin MD. Built with Next.js 14, PostgreSQL, Redis, and AI-powered insights.

## 🎯 Overview

This platform provides:
- **Real-time Dashboard**: Monitor funnel performance with interactive charts
- **Intelligent Alerts**: Automatic detection of drop-off anomalies and conversion issues
- **Daily Reports**: AI-generated insights sent to Slack
- **Recommendations**: AI-powered optimization suggestions
- **Step-by-Step Analysis**: Detailed breakdown of each funnel step

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (managed by Railway)
- **Cache**: Redis (managed by Railway)
- **Integrations**: Embeddables API, Slack Webhooks, Anthropic API
- **Hosting**: Railway

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Git
- Railway account (for deployment)
- Embeddables API key
- Slack webhook URL
- Anthropic API key (for AI features)

## 🚀 Local Development Setup

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/cro4080marketing/getthin-funnel-analytics.git
cd getthin-funnel-analytics
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set Up Environment Variables

Copy the example environment file:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit \`.env.local\` and add your credentials:

\`\`\`env
# Database (use local PostgreSQL or Railway database)
DATABASE_URL="postgresql://user:password@localhost:5432/funnel_analytics"

# Redis (use local Redis or Railway Redis)
REDIS_URL="redis://localhost:6379"

# API Keys
EMBEDDABLES_API_KEY="your_embeddables_api_key"
SLACK_WEBHOOK_URL="your_slack_webhook_url"
ANTHROPIC_API_KEY="your_anthropic_api_key"
\`\`\`

### 4. Set Up Database

\`\`\`bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# Optional: Open Prisma Studio to view database
npx prisma studio
\`\`\`

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚂 Railway Deployment

### 1. Create Railway Project

1. Go to [Railway.app](https://railway.app)
2. Create a new project
3. Connect your GitHub repository: `cro4080marketing/getthin-funnel-analytics`

### 2. Add Services

**Add PostgreSQL:**
1. Click "New" → "Database" → "Add PostgreSQL"
2. Railway automatically provisions the database and sets \`DATABASE_URL\`

**Add Redis:**
1. Click "New" → "Database" → "Add Redis"
2. Railway automatically provisions Redis and sets \`REDIS_URL\`

### 3. Configure Environment Variables

In your Railway project → Variables tab, add:

\`\`\`
EMBEDDABLES_API_KEY=your_embeddables_api_key
EMBEDDABLES_API_URL=https://api.embeddables.com/v1
SLACK_WEBHOOK_URL=your_slack_webhook_url
SLACK_CHANNEL=#funnel-alerts
ANTHROPIC_API_KEY=your_anthropic_api_key
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app-name.railway.app
ALERT_CHECK_INTERVAL_MINUTES=15
DAILY_REPORT_TIME=08:00
DAILY_REPORT_TIMEZONE=America/New_York
\`\`\`

### 4. Deploy

Railway automatically deploys on every push to your main branch.

**Manual deploy:**
\`\`\`bash
git add .
git commit -m "Initial deployment"
git push origin main
\`\`\`

### 5. Set Up Cron Jobs

Railway doesn't have built-in cron, so you'll need to set up external cron triggers:

**Option 1: Use Cron-Job.org**
1. Go to [cron-job.org](https://cron-job.org)
2. Create jobs to hit your cron endpoints:
   - \`https://your-app.railway.app/api/cron/sync-data\` (every 15 minutes)
   - \`https://your-app.railway.app/api/cron/check-alerts\` (every 15 minutes)
   - \`https://your-app.railway.app/api/cron/daily-report\` (once daily at 8 AM EST)

**Option 2: Use Railway Cron Plugin (if available)**

### 6. Initialize Database

Run database migrations:

\`\`\`bash
# Connect to Railway database
npm run db:push
\`\`\`

## 📁 Project Structure

\`\`\`
getthin-funnel-analytics/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── funnel/              # Funnel endpoints
│   │   ├── alerts/              # Alert management
│   │   ├── recommendations/     # AI recommendations
│   │   └── cron/                # Scheduled jobs
│   ├── dashboard/               # Dashboard pages
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                  # React components
│   ├── ui/                      # Shadcn components
│   ├── charts/                  # Chart components
│   ├── dashboard/               # Dashboard components
│   └── alerts/                  # Alert components
├── lib/                         # Utilities and services
│   ├── db/                      # Database utilities
│   ├── integrations/            # External APIs
│   ├── services/                # Business logic
│   └── utils/                   # Helper functions
├── types/                       # TypeScript types
├── prisma/                      # Database schema
│   └── schema.prisma
└── public/                      # Static assets
\`\`\`

## 🔧 Configuration

### Alert Thresholds

Customize alert thresholds in your environment variables:

\`\`\`env
ALERT_DROPOFF_THRESHOLD_1DAY=15      # % increase vs previous day
ALERT_DROPOFF_THRESHOLD_7DAY=10      # % increase vs 7-day average
ALERT_CONVERSION_THRESHOLD_1DAY=20   # % decrease vs previous day
ALERT_CONVERSION_THRESHOLD_7DAY=15   # % decrease vs 7-day average
ALERT_VOLUME_THRESHOLD_1DAY=30       # % decrease vs previous day
ALERT_VOLUME_THRESHOLD_7DAY=25       # % decrease vs 7-day average
\`\`\`

### Daily Report Schedule

\`\`\`env
DAILY_REPORT_TIME=08:00                    # 8:00 AM
DAILY_REPORT_TIMEZONE=America/New_York     # EST/EDT
\`\`\`

## 🧪 Development Workflow

### Running Locally

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
\`\`\`

### Database Management

\`\`\`bash
npx prisma studio              # Open database GUI
npx prisma db push             # Push schema changes
npx prisma migrate dev         # Create migration
npx prisma generate            # Generate Prisma Client
\`\`\`

## 📊 API Endpoints

### Funnel Analytics
- \`GET /api/funnel/list\` - Get all funnels
- \`GET /api/funnel/:id\` - Get funnel details
- \`GET /api/funnel/:id/analytics\` - Get funnel analytics

### Alerts
- \`GET /api/alerts\` - Get all alerts
- \`POST /api/alerts/:id/acknowledge\` - Acknowledge alert
- \`POST /api/alerts/:id/resolve\` - Resolve alert

### Cron Jobs (Protected)
- \`POST /api/cron/sync-data\` - Sync data from Embeddables
- \`POST /api/cron/check-alerts\` - Check for anomalies
- \`POST /api/cron/daily-report\` - Generate daily report

## 🔒 Security

- All API endpoints should be protected with authentication (to be implemented)
- Cron endpoints should use secret tokens
- Environment variables are never committed to Git
- Database credentials are managed by Railway

## 📈 Monitoring

The platform monitors:
- API response times
- Cron job execution success/failure
- Database connection health
- Alert accuracy and false positive rate

## 🐛 Troubleshooting

### Database Connection Issues

\`\`\`bash
# Check if DATABASE_URL is set correctly
echo $DATABASE_URL

# Test database connection
npx prisma db pull
\`\`\`

### Redis Connection Issues

\`\`\`bash
# Check if REDIS_URL is set correctly
echo $REDIS_URL
\`\`\`

### Embeddables API Issues

Check the API key and endpoint configuration. Verify with:
\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.embeddables.com/v1/funnels
\`\`\`

## 📝 Next Steps

1. ✅ Initial project setup complete
2. ⏳ Implement dashboard UI components
3. ⏳ Create API routes for funnel analytics
4. ⏳ Build alert detection service
5. ⏳ Implement Slack notifications
6. ⏳ Add AI recommendation engine
7. ⏳ Set up cron jobs for automated monitoring

## 🤝 Contributing

This is an internal project for 4080 Marketing. Contact the development team for access and contribution guidelines.

## 📧 Support

For questions or issues, contact:
- **Technical Lead**: Ethan @ 4080 Marketing
- **Slack**: #funnel-analytics channel

---

Built with ❤️ by 4080 Marketing for Get Thin MD
