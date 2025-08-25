// components/leads/LeadsTable.tsx
import React from "react";
import {
  UserGroupIcon,
  PlusIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import LeadRow from "./LeadRow";
import type { Lead } from "../../types";

interface LeadsTableProps {
  leads: Lead[];
  totalLeads: number;
  loading: boolean;
  error: string | null;
  processingLeads: Set<number>;
  onGenerateScore: (leadId: number) => Promise<void>;
  onAnalyzeLead: (lead: Lead) => Promise<void>;
  onGenerateMessage: (
    lead: Lead,
    messageType?: "email" | "linkedin" | "call" | "meeting"
  ) => Promise<void>;
  onAutoQualify: (leadId: number) => Promise<void>;
  onAddLead: () => void;
  onImportCSV: () => void;
}

const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse">
    {[1, 2, 3, 4, 5].map((i) => (
      <tr
        key={i}
        className="border-b border-gray-200">
        <td className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-6 bg-gray-200 rounded w-12"></div>
        </td>
        <td className="px-6 py-4">
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((j) => (
              <div
                key={j}
                className="h-8 bg-gray-200 rounded w-16"></div>
            ))}
          </div>
        </td>
      </tr>
    ))}
  </div>
);

const EmptyState: React.FC<{
  onAddLead: () => void;
  onImportCSV: () => void;
}> = ({ onAddLead, onImportCSV }) => (
  <div className="text-center py-16 px-4">
    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6">
      <UserGroupIcon className="h-10 w-10 text-blue-600" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">No leads yet</h3>
    <p className="text-gray-500 mb-8 max-w-md mx-auto">
      Get started by adding your first lead or importing from a CSV file. Your
      AI-powered lead management journey begins here.
    </p>
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <button
        onClick={onAddLead}
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent text-base font-medium rounded-lg text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transition-all duration-200">
        <PlusIcon className="h-5 w-5 mr-2" />
        Add First Lead
      </button>
      <button
        onClick={onImportCSV}
        className="inline-flex items-center px-6 py-3 border-2 border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
        Import CSV
      </button>
    </div>
  </div>
);

const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <div className="text-center py-16 px-4">
    <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
      <span className="text-3xl">⚠️</span>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      Something went wrong
    </h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
    <button
      onClick={() => window.location.reload()}
      className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent text-sm font-medium rounded-lg text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
      Try Again
    </button>
  </div>
);

const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  totalLeads,
  loading,
  error,
  processingLeads,
  onGenerateScore,
  onAnalyzeLead,
  onGenerateMessage,
  onAutoQualify,
  onAddLead,
  onImportCSV,
}) => {
  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <LoadingSkeleton />
          </tbody>
        </table>
      </div>
    );
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (leads.length === 0) {
    return (
      <EmptyState
        onAddLead={onAddLead}
        onImportCSV={onImportCSV}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Contact Information
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Company Details
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              AI Score
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {leads.map((lead, index) => (
            <LeadRow
              key={lead.id || `lead-${index}`}
              lead={lead}
              isProcessing={processingLeads.has(lead.id)}
              onGenerateScore={onGenerateScore}
              onAnalyzeLead={onAnalyzeLead}
              onGenerateMessage={onGenerateMessage}
              onAutoQualify={onAutoQualify}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsTable;
