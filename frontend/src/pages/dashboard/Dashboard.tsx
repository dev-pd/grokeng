// components/Dashboard.tsx
import React, { useState, useEffect } from "react";
import {
  UserGroupIcon,
  CheckCircleIcon,
  TrophyIcon,
  ChartBarIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { LeadService } from "../../services/leadService";
import type { DashboardStats, Lead } from "../../types";

interface StatCard {
  name: string;
  value: number;
  change: number;
  changeLabel: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  bgColor: string;
}

interface LeadScoreDistribution {
  range: string;
  count: number;
  percentage: number;
  color: string;
}

interface TopLead {
  id: number;
  name: string;
  company: string;
  score: number;
  status: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [scoreDistribution, setScoreDistribution] = useState<
    LeadScoreDistribution[]
  >([]);
  const [topLeads, setTopLeads] = useState<TopLead[]>([]);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch lead stats
        const statsData: DashboardStats = await LeadService.getLeadStats();

        // Fetch recent leads for analysis
        const leadsResponse = await LeadService.getLeads({
          page: 1,
          per_page: 50,
        });
        const allLeads = leadsResponse.leads || [];
        setRecentLeads(allLeads.slice(0, 3));

        // Calculate conversion rates and trends
        const conversionRate =
          statsData.total_leads > 0
            ? (statsData.converted_leads / statsData.total_leads) * 100
            : 0;

        const qualificationRate =
          statsData.total_leads > 0
            ? (statsData.qualified_leads / statsData.total_leads) * 100
            : 0;

        // Set enhanced stats with trends
        setStats([
          {
            name: "Total Leads",
            value: statsData.total_leads || 0,
            change: 12.5,
            changeLabel: "vs last month",
            icon: UserGroupIcon,
            color: "text-blue-600",
            bgColor: "bg-blue-500",
          },
          {
            name: "Qualified Rate",
            value: Math.round(qualificationRate),
            change: 8.3,
            changeLabel: "vs last month",
            icon: CheckCircleIcon,
            color: "text-green-600",
            bgColor: "bg-green-500",
          },
          {
            name: "Conversion Rate",
            value: Math.round(conversionRate),
            change: -2.1,
            changeLabel: "vs last month",
            icon: TrophyIcon,
            color: "text-purple-600",
            bgColor: "bg-purple-500",
          },
          {
            name: "Avg Score",
            value: Math.round(statsData.average_score || 0),
            change: 5.7,
            changeLabel: "vs last month",
            icon: ChartBarIcon,
            color: "text-yellow-600",
            bgColor: "bg-yellow-500",
          },
        ]);

        // Calculate score distribution
        const distribution = calculateScoreDistribution(allLeads);
        setScoreDistribution(distribution);

        // Get top performing leads
        const topPerformingLeads = allLeads
          .filter((lead: { score: number }) => lead.score && lead.score > 0)
          .sort(
            (a: { score: any }, b: { score: any }) =>
              (b.score || 0) - (a.score || 0)
          )
          .slice(0, 5)
          .map(
            (lead: {
              id: any;
              first_name: any;
              last_name: any;
              company: any;
              score: any;
              status: any;
            }) => ({
              id: lead.id,
              name:
                `${lead.first_name || ""} ${lead.last_name || ""}`.trim() ||
                "Unknown",
              company: lead.company || "No Company",
              score: lead.score || 0,
              status: lead.status || "New Lead",
            })
          );
        setTopLeads(topPerformingLeads);
      } catch (err) {
        setError("Failed to fetch dashboard data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateScoreDistribution = (
    leads: Lead[]
  ): LeadScoreDistribution[] => {
    const total = leads.length;
    if (total === 0) return [];

    const ranges = [
      { range: "90-100", min: 90, max: 100, color: "bg-green-500" },
      { range: "80-89", min: 80, max: 89, color: "bg-green-400" },
      { range: "70-79", min: 70, max: 79, color: "bg-yellow-500" },
      { range: "60-69", min: 60, max: 69, color: "bg-yellow-400" },
      { range: "Below 60", min: 0, max: 59, color: "bg-red-400" },
    ];

    return ranges
      .map((range) => {
        const count = leads.filter((lead) => {
          const score = lead.score || 0;
          return score >= range.min && score <= range.max;
        }).length;

        return {
          range: range.range,
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0,
          color: range.color,
        };
      })
      .filter((item) => item.count > 0);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "qualified":
        return "bg-green-100 text-green-800";
      case "converted":
        return "bg-purple-100 text-purple-800";
      case "contacted":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-white rounded-lg shadow-sm p-6 h-32"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm p-6 h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Compact Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Welcome to Grok SDR ✨</h2>
            <p className="text-blue-100">
              Your AI assistant has analyzed{" "}
              <strong>{stats[0]?.value || 0} leads</strong> with a{" "}
              <strong>{stats[3]?.value || 0}%</strong> average score
            </p>
          </div>
          <div className="hidden md:flex space-x-3">
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 flex items-center">
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Lead
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-400 flex items-center">
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Import CSV
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Enhanced Stats Grid with Trends */}
      {!error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div
                  className={`flex items-center text-sm ${
                    stat.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}>
                  {stat.change >= 0 ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.name}
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.name.includes("Rate") ? `${stat.value}%` : stat.value}
                </p>
                <p className="text-sm text-gray-500">{stat.changeLabel}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Score Distribution Chart */}
        <div className="xl:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2 text-blue-500" />
              Lead Score Distribution
            </h3>
            <span className="text-sm text-gray-500">
              {recentLeads.length + topLeads.length} leads analyzed
            </span>
          </div>

          {scoreDistribution.length > 0 ? (
            <div className="space-y-3">
              {scoreDistribution.map((item) => (
                <div
                  key={item.range}
                  className="flex items-center">
                  <div className="w-20 text-sm font-medium text-gray-700 mr-4">
                    {item.range}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 mr-4 overflow-hidden">
                    <div
                      className={`h-4 ${item.color} rounded-full transition-all duration-300`}
                      style={{ width: `${item.percentage}%` }}></div>
                  </div>
                  <div className="w-16 text-sm text-gray-600 text-right">
                    {item.count} ({item.percentage}%)
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ChartBarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No scored leads yet</p>
              <p className="text-sm mt-1">
                Start analyzing leads to see distribution
              </p>
            </div>
          )}
        </div>

        {/* Top Performing Leads */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <SparklesIcon className="h-5 w-5 mr-2 text-yellow-500" />
              Top Leads
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </button>
          </div>

          {topLeads.length > 0 ? (
            <div className="space-y-4">
              {topLeads.map((lead, index) => (
                <div
                  key={lead.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {lead.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {lead.company}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-bold text-gray-900">
                      {lead.score}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        lead.status
                      )}`}>
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <UserGroupIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No scored leads yet</p>
              <p className="text-sm mt-1">
                Generate AI scores to see top performers
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ClockIcon className="h-5 w-5 mr-2 text-green-500" />
            Recent Leads
            {recentLeads.length > 0 && (
              <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                {recentLeads.length}
              </span>
            )}
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Manage Leads →
          </button>
        </div>

        {recentLeads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {(lead.first_name?.[0] || "?").toUpperCase()}
                      {(lead.last_name?.[0] || "").toUpperCase()}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      lead.status
                    )}`}>
                    {lead.status}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1 truncate">
                  {lead.first_name} {lead.last_name}
                </h4>
                <p className="text-sm text-gray-600 mb-2 truncate">
                  {lead.company || "No Company"}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {lead.industry || "Unknown Industry"}
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      (lead.score || 0) >= 80
                        ? "text-green-600"
                        : (lead.score || 0) >= 60
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}>
                    {lead.score || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No leads yet</p>
            <p className="text-sm text-gray-400 mt-1 mb-4">
              Get started by adding your first lead
            </p>
            <button className="btn-primary">Add Your First Lead</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
