import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  SparklesIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { LeadService } from "../../services/leadService";
import type {
  Lead,
  LeadCreate,
  PaginatedResponse,
  GrokAnalysisResponse,
  GrokMessageResponse,
} from "../../types";
import LeadsFilters from "../../components/leads/LeadsFilters";
import LeadsTable from "../../components/leads/LeadsTable";
import Pagination from "../../components/common/Pagination";
import AddLeadModal from "../../components/leads/AddLeadModal";
import AnalysisModal from "../../components/leads/AnalysisModal";
import MessageModal from "../../components/leads/MessageModal";
import ErrorAlert from "../../components/common/ErrorAlert";

const LeadsPage: React.FC = () => {
  // State management
  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalLeads, setTotalLeads] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [perPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filters, setFilters] = useState<{
    status?: string;
    industry?: string;
    company_size?: string;
    score_range?: string;
    search?: string;
  }>({});

  // Loading states
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const [processingLeads, setProcessingLeads] = useState<Set<number>>(
    new Set()
  );
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] =
    useState<boolean>(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState<boolean>(false);

  // UI state
  const [isFiltersExpanded, setIsFiltersExpanded] = useState<boolean>(false);

  // Selected data for modals
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [grokAnalysis, setGrokAnalysis] = useState<GrokAnalysisResponse | null>(
    null
  );
  const [generatedMessage, setGeneratedMessage] =
    useState<GrokMessageResponse | null>(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0);

  // Individual lead operations with better error handling
  const handleGenerateScore = async (leadId: number) => {
    setProcessingLeads((prev) => new Set([...prev, leadId]));
    setError(null);

    try {
      const updatedLead = await LeadService.generateLeadScore(leadId);
      setLeads((prev) =>
        prev.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead))
      );

      // Success notification could be added here
    } catch (err: any) {
      const leadName = leads.find((l) => l.id === leadId)?.first_name || "Lead";
      setError(
        `Failed to generate score for ${leadName}: ${
          err.message || "Unknown error"
        }`
      );
      console.error("Generate score error:", err);
    } finally {
      setProcessingLeads((prev) => {
        const newSet = new Set(prev);
        newSet.delete(leadId);
        return newSet;
      });
    }
  };

  const handleAnalyzeLead = async (lead: Lead) => {
    setSelectedLead(lead);
    setProcessingLeads((prev) => new Set([...prev, lead.id]));

    try {
      const analysis = await LeadService.analyzeLeadWithGrok(lead.id);
      setGrokAnalysis(analysis);
      setIsAnalysisModalOpen(true);
    } catch (err: any) {
      const leadName = `${lead.first_name || "Unknown"} ${
        lead.last_name || "Lead"
      }`;
      setError(
        `Failed to analyze ${leadName}: ${err.message || "Unknown error"}`
      );
      console.error("Analysis error:", err);
    } finally {
      setProcessingLeads((prev) => {
        const newSet = new Set(prev);
        newSet.delete(lead.id);
        return newSet;
      });
    }
  };

  const handleGenerateMessage = async (
    lead: Lead,
    messageType: "email" | "linkedin" | "call" | "meeting" = "email"
  ) => {
    setSelectedLead(lead);
    setProcessingLeads((prev) => new Set([...prev, lead.id]));

    try {
      const message = await LeadService.generatePersonalizedMessage(
        lead.id,
        messageType
      );
      setGeneratedMessage(message);
      setIsMessageModalOpen(true);
    } catch (err: any) {
      const leadName = `${lead.first_name || "Unknown"} ${
        lead.last_name || "Lead"
      }`;
      setError(
        `Failed to generate message for ${leadName}: ${
          err.message || "Unknown error"
        }`
      );
      console.error("Message generation error:", err);
    } finally {
      setProcessingLeads((prev) => {
        const newSet = new Set(prev);
        newSet.delete(lead.id);
        return newSet;
      });
    }
  };

  const handleAutoQualify = async (leadId: number) => {
    setProcessingLeads((prev) => new Set([...prev, leadId]));

    try {
      const result = await LeadService.autoQualifyLead(leadId);
      const updatedLead = await LeadService.getLead(leadId);
      setLeads((prev) =>
        prev.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead))
      );
      console.log("Lead auto-qualified:", result);
    } catch (err: any) {
      const leadName = leads.find((l) => l.id === leadId)?.first_name || "Lead";
      setError(
        `Failed to auto-qualify ${leadName}: ${err.message || "Unknown error"}`
      );
      console.error("Auto-qualify error:", err);
    } finally {
      setProcessingLeads((prev) => {
        const newSet = new Set(prev);
        newSet.delete(leadId);
        return newSet;
      });
    }
  };

  // Fetch leads with better error handling
  useEffect(() => {
    const fetchLeads = async () => {
      setTableLoading(true);
      setError(null);

      try {
        const params: any = { page, per_page: perPage, ...filters };

        // Convert filter formats
        if (params.score_range) {
          const [min, max] = params.score_range
            .replace("High (80-100)", "80-100")
            .replace("Medium (50-79)", "50-79")
            .replace("Low (0-49)", "0-49")
            .split("-")
            .map(Number);
          params.score_min = min;
          params.score_max = max;
          delete params.score_range;
        }

        // Clean up default values
        if (params.status === "All Statuses") delete params.status;
        if (params.industry === "All Industries") delete params.industry;
        if (params.company_size === "All Sizes") delete params.company_size;
        if (params.search === "") delete params.search;

        const response: PaginatedResponse<Lead> = await LeadService.getLeads(
          params
        );
        setLeads(response.leads || []);
        setTotalLeads(response.total || 0);
        setTotalPages(response.total_pages || 1);
      } catch (err: any) {
        setError(
          "Failed to fetch leads. Please check your connection and try again."
        );
        console.error("Fetch leads error:", err);
      } finally {
        setTableLoading(false);
      }
    };

    fetchLeads();
  }, [page, filters, perPage]);

  // Count active filters
  useEffect(() => {
    const count = Object.entries(filters).filter(([key, value]) => {
      if (key === "search") return value && value.length > 0;
      if (!value) return false;
      return !["All Statuses", "All Industries", "All Sizes", "All Scores"].includes(
        value
      );
    }).length;
    setActiveFiltersCount(count);
  }, [filters]);

  // Filter handlers
  const handleFilterChange = (key: string, value: string) => {
    const isAll = ["All Statuses", "All Industries", "All Sizes", "All Scores"].includes(
      value
    );
    setFilters((prev) => ({ ...prev, [key]: isAll ? undefined : value }));
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilters((prev) => ({ ...prev, search: value }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({});
    setSearchTerm("");
    setPage(1);
  };

  const handleBulkActions = () => {
    // TODO: Implement bulk actions
    console.log("Bulk actions");
  };

  // Lead creation
  const handleCreateLead = async (leadData: LeadCreate) => {
    try {
      await LeadService.createLead(leadData);
      setIsAddModalOpen(false);
      // Refresh the leads list
      setFilters((prev) => ({ ...prev }));
    } catch (err: any) {
      setError("Failed to create lead. Please try again.");
      console.error(err);
      throw err;
    }
  };

  // Modal handlers
  const handleAddLead = () => setIsAddModalOpen(true);
  const handleImportCSV = () => {
    console.log("Import CSV functionality to be implemented");
  };

  // Calculate stats for header
  const qualifiedCount = leads.filter(
    (lead) => lead.status === "Qualified"
  ).length;
  const highScoreCount = leads.filter((lead) => (lead.score || 0) >= 80).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {/* Compact Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <SparklesIcon className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Lead Management
                  </h1>
                </div>

                <div className="lg:hidden flex space-x-2">
                  <button
                    onClick={handleImportCSV}
                    className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                    <ArrowDownTrayIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleAddLead}
                    className="px-3 py-2 bg-blue-600 border border-transparent text-sm font-medium rounded-lg text-white hover:bg-blue-700">
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Quick Stats - Single Line */}
              <div className="flex items-center space-x-6 text-sm mt-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">
                    Total:{" "}
                    <span className="font-semibold text-gray-900">
                      {totalLeads}
                    </span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">
                    Qualified:{" "}
                    <span className="font-semibold text-green-700">
                      {qualifiedCount}
                    </span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600">
                    High Score:{" "}
                    <span className="font-semibold text-yellow-700">
                      {highScoreCount}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-3 mt-3 lg:mt-0">
              <button
                onClick={handleImportCSV}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Import
              </button>
              <button
                onClick={handleAddLead}
                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent text-sm font-medium rounded-lg text-white hover:bg-blue-700 shadow-sm">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Lead
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <ErrorAlert
            message={error}
            onDismiss={() => setError(null)}
          />
        )}

        {/* Compact Search and Collapsible Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Search Bar - Always Visible */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search by name, email, company, or industry..."
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                className={`flex items-center px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium transition-colors ${
                  activeFiltersCount > 0
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}>
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
                {isFiltersExpanded ? (
                  <ChevronUpIcon className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4 ml-2" />
                )}
              </button>
            </div>
          </div>

          {/* Collapsible Filters */}
          {isFiltersExpanded && (
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Filter Options
                </span>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-sm text-gray-600 hover:text-gray-800 font-medium">
                    Clear all
                  </button>
                )}
              </div>
              <LeadsFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
              />
            </div>
          )}

          {/* Table Header with Pagination Info */}
          <div className="px-4 py-3 bg-gray-50 flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="font-medium text-gray-900">
                {totalLeads} {totalLeads === 1 ? "lead" : "leads"}
              </span>
              {totalPages > 1 && (
                <span className="text-gray-500">
                  Page {page} of {totalPages}
                </span>
              )}
            </div>
            <button
              onClick={handleBulkActions}
              className="text-gray-600 hover:text-gray-800 font-medium">
              Bulk Actions
            </button>
          </div>
        </div>

        {/* Leads Table - Now More Prominent */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <LeadsTable
            leads={leads}
            totalLeads={totalLeads}
            loading={tableLoading}
            error={null}
            processingLeads={processingLeads}
            onGenerateScore={handleGenerateScore}
            onAnalyzeLead={handleAnalyzeLead}
            onGenerateMessage={handleGenerateMessage}
            onAutoQualify={handleAutoQualify}
            onAddLead={handleAddLead}
            onImportCSV={handleImportCSV}
          />
        </div>

        {/* Compact Pagination */}
        {!tableLoading && totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              disabled={tableLoading || processingLeads.size > 0}
            />
          </div>
        )}

        {/* Processing Indicator */}
        {processingLeads.size > 0 && (
          <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3 flex items-center space-x-2 z-40">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-sm text-gray-700">
              Processing {processingLeads.size}{" "}
              {processingLeads.size === 1 ? "lead" : "leads"}...
            </span>
          </div>
        )}

        {/* Modals */}
        {isAddModalOpen && (
          <AddLeadModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={handleCreateLead}
          />
        )}

        {isAnalysisModalOpen && grokAnalysis && selectedLead && (
          <AnalysisModal
            isOpen={isAnalysisModalOpen}
            onClose={() => setIsAnalysisModalOpen(false)}
            lead={selectedLead}
            analysis={grokAnalysis}
          />
        )}

        {isMessageModalOpen && generatedMessage && selectedLead && (
          <MessageModal
            isOpen={isMessageModalOpen}
            onClose={() => setIsMessageModalOpen(false)}
            lead={selectedLead}
            message={generatedMessage}
            onGenerateNew={handleGenerateMessage}
          />
        )}
      </div>
    </div>
  );
};

export default LeadsPage;
