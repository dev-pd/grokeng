import React, { useState, useEffect } from "react";
import { PlusIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
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
import AnalysisModal from "../../components/leads/AnalysisModal";
import MessageModal from "../../components/leads/MessageModal";
import AddLeadModal from "../../components/leads/AddLeadModal";
import ErrorAlert from "../../components/common/ErrorAlert";

const LeadsPage: React.FC = () => {
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

  // Loading states - separate for different operations
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

  // Selected data for modals
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [grokAnalysis, setGrokAnalysis] = useState<GrokAnalysisResponse | null>(
    null
  );
  const [generatedMessage, setGeneratedMessage] =
    useState<GrokMessageResponse | null>(null);

  // Individual lead operations
  const handleGenerateScore = async (leadId: number) => {
    setProcessingLeads((prev) => new Set([...prev, leadId]));
    setError(null);
    try {
      const updatedLead = await LeadService.generateLeadScore(leadId);
      setLeads((prev) =>
        prev.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead))
      );
    } catch (err: any) {
      setError(`Failed to generate score for lead ${leadId}: ${err.message}`);
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
      setError(`Failed to analyze lead: ${err.message}`);
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
      setError(`Failed to generate message: ${err.message}`);
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
      setError(`Failed to auto-qualify lead: ${err.message}`);
      console.error("Auto-qualify error:", err);
    } finally {
      setProcessingLeads((prev) => {
        const newSet = new Set(prev);
        newSet.delete(leadId);
        return newSet;
      });
    }
  };

  // Fetch leads when page or filters change
  useEffect(() => {
    const fetchLeads = async () => {
      setTableLoading(true);
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
        setLeads(response.leads);
        setTotalLeads(response.total);
        setTotalPages(response.total_pages);
      } catch (err) {
        setError("Failed to fetch leads. Please try again later.");
        console.error(err);
      } finally {
        setTableLoading(false);
      }
    };

    fetchLeads();
  }, [page, filters, perPage]);

  // Filter handlers
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({});
    setPage(1);
  };

  // Lead creation
  const handleCreateLead = async (leadData: LeadCreate) => {
    try {
      await LeadService.createLead(leadData);
      setIsAddModalOpen(false);
      // Refresh the leads list
      setFilters((prev) => ({ ...prev }));
    } catch (err) {
      setError("Failed to create lead. Please try again.");
      console.error(err);
      throw err; // Re-throw to let the modal handle it
    }
  };

  // Modal handlers
  const handleAddLead = () => setIsAddModalOpen(true);
  const handleImportCSV = () => {
    // TODO: Implement CSV import
    console.log("Import CSV functionality to be implemented");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lead Management</h2>
          <p className="text-gray-600 mt-1">
            Manage and qualify your sales leads with AI assistance
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            className="btn-outline"
            onClick={handleImportCSV}>
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Import
          </button>
          <button
            className="btn-primary"
            onClick={handleAddLead}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <ErrorAlert
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      {/* Filters */}
      <LeadsFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        onResetFilters={handleResetFilters}
      />

      {/* Leads Table */}
      <LeadsTable
        leads={leads}
        totalLeads={totalLeads}
        loading={tableLoading}
        error={error}
        processingLeads={processingLeads}
        onGenerateScore={handleGenerateScore}
        onAnalyzeLead={handleAnalyzeLead}
        onGenerateMessage={handleGenerateMessage}
        onAutoQualify={handleAutoQualify}
        onAddLead={handleAddLead}
        onImportCSV={handleImportCSV}
      />

      {/* Pagination */}
      {!tableLoading && leads.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          disabled={tableLoading}
        />
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
  );
};

export default LeadsPage;
