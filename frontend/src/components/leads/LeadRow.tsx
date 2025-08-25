// components/leads/LeadRow.tsx
import React from "react";
import {
  SparklesIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import type { Lead } from "../../types";

interface LeadRowProps {
  lead: Lead;
  isProcessing: boolean;
  onGenerateScore: (leadId: number) => Promise<void>;
  onAnalyzeLead: (lead: Lead) => Promise<void>;
  onGenerateMessage: (
    lead: Lead,
    messageType?: "email" | "linkedin" | "call" | "meeting"
  ) => Promise<void>;
  onAutoQualify: (leadId: number) => Promise<void>;
}

const LeadRow: React.FC<LeadRowProps> = ({
  lead,
  isProcessing,
  onGenerateScore,
  onAnalyzeLead,
  onGenerateMessage,
  onAutoQualify,
}) => {
  const getScoreColor = (score: number | null) => {
    if (!score) return "text-gray-400";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "qualified":
        return "bg-green-100 text-green-800";
      case "contacted":
        return "bg-blue-100 text-blue-800";
      case "converted":
        return "bg-purple-100 text-purple-800";
      case "not qualified":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <tr className={`hover:bg-gray-50 ${isProcessing ? "opacity-75" : ""}`}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">
            {lead.first_name} {lead.last_name}
          </div>
          <div className="text-sm text-gray-500">{lead.email}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">
            {lead.company || "N/A"}
          </div>
          <div className="text-sm text-gray-500">{lead.title}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
            lead.status
          )}`}>
          {lead.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`text-sm font-medium ${getScoreColor(lead.score)}`}>
          {lead.score || "—"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => onGenerateScore(lead.id)}
            disabled={isProcessing}>
            <SparklesIcon className="h-4 w-4 mr-1" />
            {isProcessing ? "Scoring..." : "Score"}
          </button>

          <button
            className="btn btn-sm btn-outline"
            onClick={() => onAnalyzeLead(lead)}
            disabled={isProcessing}>
            <EyeIcon className="h-4 w-4 mr-1" />
            Analyze
          </button>

          <button
            className="btn btn-sm btn-outline"
            onClick={() => onGenerateMessage(lead)}
            disabled={isProcessing}>
            <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
            Message
          </button>

          <button
            className="btn btn-sm btn-outline"
            onClick={() => onAutoQualify(lead.id)}
            disabled={isProcessing}>
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            Qualify
          </button>
        </div>
      </td>
    </tr>
  );
};

export default LeadRow;
