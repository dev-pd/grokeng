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
  // Safe accessors with fallbacks for edge cases
  const getFullName = () => {
    const firstName = lead.first_name?.trim() || "";
    const lastName = lead.last_name?.trim() || "";

    if (!firstName && !lastName) return "Unknown Name";
    if (!firstName) return lastName;
    if (!lastName) return firstName;
    return `${firstName} ${lastName}`;
  };

  const getEmail = () => {
    return lead.email?.trim() || "No email provided";
  };

  const getCompanyName = () => {
    return lead.company?.trim() || "No Company";
  };

  const getJobTitle = () => {
    return lead.title?.trim() || "No Title";
  };

  const getIndustry = () => {
    return lead.industry?.trim() || "Unknown Industry";
  };

  const getScoreColor = (score: number | null | undefined) => {
    if (!score || score === 0) return "text-gray-400 bg-gray-50";
    if (score >= 80) return "text-green-700 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-700 bg-yellow-50 border-yellow-200";
    return "text-red-700 bg-red-50 border-red-200";
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status?.toLowerCase()?.trim() || "unknown";

    switch (normalizedStatus) {
      case "qualified":
        return "bg-green-100 text-green-800 border-green-200";
      case "contacted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "converted":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "not qualified":
        return "bg-red-100 text-red-800 border-red-200";
      case "needs review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "new lead":
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInitials = () => {
    const firstName = lead.first_name?.trim() || "";
    const lastName = lead.last_name?.trim() || "";

    if (!firstName && !lastName) return "??";

    const firstInitial = firstName.charAt(0).toUpperCase() || "?";
    const lastInitial = lastName.charAt(0).toUpperCase() || "";

    return `${firstInitial}${lastInitial}`;
  };

  const formatCreatedDate = () => {
    if (!lead.created_at) return "Unknown date";

    try {
      return new Date(lead.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getEmailDisplay = () => {
    const email = getEmail();
    if (email === "No email provided") return email;

    return (
      <div className="flex items-center">
        <span
          className={`${
            isEmailValid(email) ? "text-gray-900" : "text-red-600"
          }`}>
          {email}
        </span>
        {!isEmailValid(email) && (
          <span
            className="ml-1 text-xs text-red-500"
            title="Invalid email format">
            ⚠️
          </span>
        )}
      </div>
    );
  };

  return (
    <tr
      className={`hover:bg-gray-50 transition-colors duration-150 ${
        isProcessing ? "opacity-75 bg-blue-50" : ""
      }`}>
      {/* Contact Information */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="flex-shrink-0 w-10 h-10">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-sm font-semibold text-white">
                {getInitials()}
              </span>
            </div>
          </div>

          {/* Name and Email */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">
              {getFullName()}
            </div>
            <div className="text-sm text-gray-500 truncate">
              {getEmailDisplay()}
            </div>
            {lead.phone && (
              <div className="text-xs text-gray-400 truncate">
                📞 {lead.phone}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Company Details */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm">
          <div
            className="font-semibold text-gray-900 truncate max-w-xs"
            title={getCompanyName()}>
            {getCompanyName()}
          </div>
          <div
            className="text-gray-500 truncate max-w-xs"
            title={getJobTitle()}>
            {getJobTitle()}
          </div>
          <div className="text-xs text-gray-400 flex items-center mt-1">
            <span className="truncate">
              🏭 {getIndustry()}
              {lead.company_size && ` • ${lead.company_size}`}
            </span>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
            lead.status
          )}`}>
          {lead.status || "New Lead"}
        </span>
        <div className="text-xs text-gray-400 mt-1">{formatCreatedDate()}</div>
      </td>

      {/* AI Score */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center px-2 py-1 text-sm font-semibold rounded-lg border ${getScoreColor(
              lead.score
            )}`}>
            {lead.score || 0}
            <span className="text-xs ml-1 opacity-75">/100</span>
          </span>
        </div>
        {lead.budget_range && (
          <div className="text-xs text-gray-400 mt-1">
            💰 {lead.budget_range}
          </div>
        )}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-wrap gap-2">
          <button
            className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
              isProcessing
                ? "bg-blue-100 text-blue-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
            }`}
            onClick={() => onGenerateScore(lead.id)}
            disabled={isProcessing}
            title="Generate AI Score">
            <SparklesIcon className="h-3 w-3 mr-1" />
            {isProcessing ? "Processing..." : "Score"}
          </button>

          <button
            className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
              isProcessing
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:shadow-md"
            }`}
            onClick={() => onAnalyzeLead(lead)}
            disabled={isProcessing}
            title="Detailed AI Analysis">
            <EyeIcon className="h-3 w-3 mr-1" />
            Analyze
          </button>

          <button
            className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
              isProcessing
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-purple-700 border border-purple-300 hover:bg-purple-50 hover:shadow-md"
            }`}
            onClick={() => onGenerateMessage(lead)}
            disabled={isProcessing}
            title="Generate Personalized Message">
            <ChatBubbleLeftRightIcon className="h-3 w-3 mr-1" />
            Message
          </button>

          <button
            className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
              isProcessing
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-green-700 border border-green-300 hover:bg-green-50 hover:shadow-md"
            }`}
            onClick={() => onAutoQualify(lead.id)}
            disabled={isProcessing}
            title="Auto-Qualify Lead">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Qualify
          </button>
        </div>

        {/* Processing indicator */}
        {isProcessing && (
          <div className="flex items-center mt-2 text-xs text-blue-600">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
            Processing...
          </div>
        )}
      </td>
    </tr>
  );
};

export default LeadRow;
