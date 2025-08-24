// frontend/src/pages/dashboard/Dashboard.tsx
import React from "react";
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

const Dashboard: React.FC = () => {
  const stats = [
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
  ];

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

      {/* Stats Grid */}
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
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
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
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                Disconnected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Grok Integration</span>
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                Not Configured
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                Not Connected
              </span>
            </div>
          </div>
        </div>
      </div>

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
