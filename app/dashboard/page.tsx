import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Get Thin MD - Funnel Analytics
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Real-time monitoring and insights for medical questionnaire funnels
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </main>
    </div>
  );
}

function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          🎉 Welcome to Your Funnel Analytics Platform
        </h2>
        <p className="text-gray-600 mb-4">
          Your comprehensive analytics system has been set up successfully. 
          The platform is ready to start monitoring your quiz funnels.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            🚀 Next Steps:
          </h3>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>Configure your Embeddables API key in environment variables</li>
            <li>Set up Slack webhook for notifications</li>
            <li>Run the initial data sync to populate the database</li>
            <li>Configure cron jobs for automated monitoring</li>
          </ul>
        </div>
      </div>

      {/* Feature Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          icon="📊"
          title="Real-time Dashboard"
          description="Monitor funnel performance with interactive charts and live metrics"
        />
        <FeatureCard
          icon="🚨"
          title="Smart Alerts"
          description="Automatic detection of anomalies and conversion issues"
        />
        <FeatureCard
          icon="🤖"
          title="AI Recommendations"
          description="Get optimization suggestions powered by AI analysis"
        />
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard
          title="Database"
          status="Connected"
          color="green"
        />
        <StatusCard
          title="Redis Cache"
          status="Ready"
          color="green"
        />
        <StatusCard
          title="Embeddables API"
          status="Not Configured"
          color="yellow"
        />
        <StatusCard
          title="Slack Integration"
          status="Not Configured"
          color="yellow"
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function StatusCard({ title, status, color }: { title: string; status: string; color: 'green' | 'yellow' | 'red' }) {
  const colorClasses = {
    green: 'bg-green-100 text-green-800 border-green-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    red: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h4 className="text-sm font-medium text-gray-600 mb-2">{title}</h4>
      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${colorClasses[color]}`}>
        {status}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-gray-200 h-40 rounded-lg" />
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gray-200 h-32 rounded-lg" />
        <div className="bg-gray-200 h-32 rounded-lg" />
        <div className="bg-gray-200 h-32 rounded-lg" />
      </div>
    </div>
  );
}
