// export default Dashboard;
import React, { useState, useEffect } from "react";
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { LeadService } from "../../services/leadService";
import type { DashboardStats } from "../../types"; // Ensure types are imported correctly

interface Stat {
  name: string;
  value: string | number;
  icon: React.FC<{ className?: string }>;
  color: string;
}

interface SystemStatus {
  apiConnection: string;
  grokIntegration: string;
  database: string;
}

const Dashboard: React.FC = () => {
  // State for stats and system status
  const [stats, setStats] = useState<Stat[]>([
    {
      name: "Total Leads",
      value: "0",
      icon: UserGroupIcon,
      color: "bg-blue-500",
    },
    {
      name: "Messages Sent",
      value: "0",
      icon: ChatBubbleLeftRightIcon,
      color: "bg-green-500",
    },
    {
      name: "Qualified Leads",
      value: "0",
      icon: CheckCircleIcon,
      color: "bg-yellow-500",
    },
    {
      name: "Conversions",
      value: "0",
      icon: TrophyIcon,
      color: "bg-purple-500",
    },
  ]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    apiConnection: "Disconnected",
    grokIntegration: "Not Configured",
    database: "Not Connected",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch lead stats
        const statsData: DashboardStats = await LeadService.getLeadStats();
        setStats([
          {
            name: "Total Leads",
            value: statsData.total_leads || "0",
            icon: UserGroupIcon,
            color: "bg-blue-500",
          },
          {
            name: "Messages Sent",
            value: statsData.contacted_leads || "0",
            icon: ChatBubbleLeftRightIcon,
            color: "bg-green-500",
          },
          {
            name: "Qualified Leads",
            value: statsData.qualified_leads || "0",
            icon: CheckCircleIcon,
            color: "bg-yellow-500",
          },
          {
            name: "Conversions",
            value: statsData.converted_leads || "0",
            icon: TrophyIcon,
            color: "bg-purple-500",
          },
        ]);

        // Fetch API health
        const healthData = await LeadService.checkApiHealth();
        setSystemStatus({
          apiConnection:
            healthData.status === "healthy" ? "Connected" : "Disconnected",
          grokIntegration:
            healthData.status === "healthy" ? "Configured" : "Not Configured",
          database:
            healthData.database === "connected" ? "Connected" : "Not Connected",
        });
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome to Grok SDR
            </h2>
            <p className="text-gray-600 mt-1">
              Your AI-powered sales development representative is ready to help
              you qualify leads and automate outreach.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading/Error State */}
      {loading && <div className="text-center text-gray-600">Loading...</div>}
      {error && <div className="text-center text-red-600">{error}</div>}

      {/* Stats Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions and System Status */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="btn-primary w-full">Add New Lead</button>
              <button className="btn-outline w-full">
                Import Leads from CSV
              </button>
              <button className="btn-secondary w-full">
                Generate Outreach Message
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              System Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Connection</span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    systemStatus.apiConnection === "Connected"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                  {systemStatus.apiConnection}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Grok Integration</span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    systemStatus.grokIntegration === "Configured"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                  {systemStatus.grokIntegration}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    systemStatus.database === "Connected"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                  {systemStatus.database}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="text-center py-12">
          <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <p className="text-gray-500">No recent activity</p>
          <p className="text-sm text-gray-400 mt-1">
            Start by adding some leads to see activity here
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
