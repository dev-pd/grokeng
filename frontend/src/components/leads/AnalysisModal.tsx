// components/leads/AnalysisModal.tsx
import React from "react";
import { XMarkIcon, SparklesIcon } from "@heroicons/react/24/outline";
import type { Lead, GrokAnalysisResponse } from "../../types";

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  analysis: GrokAnalysisResponse;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({
  isOpen,
  onClose,
  lead,
  analysis,
}) => {
  if (!isOpen) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "qualified":
        return "bg-green-100 text-green-800 border-green-200";
      case "not qualified":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <SparklesIcon className="h-5 w-5 mr-2 text-blue-500" />
                AI Analysis: {lead.first_name} {lead.last_name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {lead.title} at {lead.company} • {lead.email}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Score and Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div
              className={`p-4 rounded-lg border-2 ${getScoreColor(
                analysis.analysis.overall_score
              )}`}>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">
                  {analysis.analysis.overall_score}
                </div>
                <div className="text-xs uppercase tracking-wide font-semibold">
                  Overall Score
                </div>
                <div className="mt-2 text-xs opacity-75">out of 100</div>
              </div>
            </div>

            <div
              className={`p-4 rounded-lg border-2 ${getStatusColor(
                analysis.analysis.qualification_status
              )}`}>
              <div className="text-center">
                <div className="text-lg font-bold mb-1">
                  {analysis.analysis.qualification_status}
                </div>
                <div className="text-xs uppercase tracking-wide font-semibold">
                  Status
                </div>
                <div className="mt-2 text-xs opacity-75">
                  Qualification Result
                </div>
              </div>
            </div>

            <div
              className={`p-4 rounded-lg border-2 ${getPriorityColor(
                analysis.analysis.priority_level
              )}`}>
              <div className="text-center">
                <div className="text-lg font-bold mb-1">
                  {analysis.analysis.priority_level}
                </div>
                <div className="text-xs uppercase tracking-wide font-semibold">
                  Priority
                </div>
                <div className="mt-2 text-xs opacity-75">
                  Follow-up Priority
                </div>
              </div>
            </div>
          </div>

          {/* Scoring Breakdown */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              📊 Score Breakdown
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(analysis.analysis.scoring_breakdown).map(
                ([key, score]) => {
                  const label = key
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase());

                  return (
                    <div
                      key={key}
                      className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {label}
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            getScoreColor(score as number).split(" ")[0]
                          }`}>
                          {score}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            (score as number) >= 80
                              ? "bg-green-500"
                              : (score as number) >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Key Insights */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              💡 Key Insights
            </h4>
            <div className="space-y-3">
              {analysis.analysis.key_insights.map((insight, index) => (
                <div
                  key={index}
                  className="flex items-start bg-blue-50 p-4 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Approach */}
          {analysis.analysis.recommended_approach && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                🎯 Recommended Approach
              </h4>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {analysis.analysis.recommended_approach}
                </p>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              ✅ Next Steps
            </h4>
            <div className="space-y-2">
              {analysis.analysis.next_steps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Factors */}
          {analysis.analysis.risk_factors.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                ⚠️ Risk Factors
              </h4>
              <div className="space-y-2">
                {analysis.analysis.risk_factors.map((risk, index) => (
                  <div
                    key={index}
                    className="flex items-start bg-red-50 border border-red-200 p-3 rounded-lg">
                    <div className="flex-shrink-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      !
                    </div>
                    <p className="text-sm text-red-700 leading-relaxed">
                      {risk}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Metadata */}
          <div className="border-t border-gray-200 pt-4 mt-6">
            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
              <span>Analysis ID: {analysis.lead_id}</span>
              {analysis.analysis.grok_version && (
                <span>Model: {analysis.analysis.grok_version}</span>
              )}
              {analysis.analysis.analyzed_at && (
                <span>
                  Generated:{" "}
                  {new Date(analysis.analysis.analyzed_at).toLocaleString()}
                </span>
              )}
              <span className="flex items-center">
                <SparklesIcon className="h-3 w-3 mr-1" />
                AI Generated
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            This analysis was generated using AI and should be reviewed by a
            human.
          </div>
          <div className="flex space-x-3">
            <button
              className="btn-outline"
              onClick={onClose}>
              Close
            </button>
            <button className="btn-primary">Generate Message</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
