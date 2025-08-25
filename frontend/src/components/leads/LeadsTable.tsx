// components/leads/LeadsTable.tsx
import React from "react";
import { UserGroupIcon } from "@heroicons/react/24/outline";
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
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            All Leads ({totalLeads})
          </h3>
        </div>
        <div className="text-center py-12 text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            All Leads ({totalLeads})
          </h3>
        </div>
        <div className="text-center py-12 text-red-600">{error}</div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            All Leads ({totalLeads})
          </h3>
        </div>
        <div className="text-center py-12">
          <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <UserGroupIcon className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No leads yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start by adding your first lead or importing from a CSV file
          </p>
          <div className="flex justify-center space-x-3">
            <button
              className="btn-primary"
              onClick={onAddLead}>
              Add First Lead
            </button>
            <button
              className="btn-outline"
              onClick={onImportCSV}>
              Import CSV
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          All Leads ({totalLeads})
        </h3>
      </div>

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
            {leads.map((lead) => (
              <LeadRow
                key={lead.id}
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
    </div>
  );
};

export default LeadsTable;
