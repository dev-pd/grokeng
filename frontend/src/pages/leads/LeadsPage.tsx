// import React, { useState, useEffect } from "react";
// import {
//   PlusIcon,
//   FunnelIcon,
//   ArrowDownTrayIcon,
//   UserGroupIcon,
//   XMarkIcon,
// } from "@heroicons/react/24/outline";
// import { LeadService } from "../../services/leadService";
// import type { Lead, LeadCreate, PaginatedResponse } from "../../types";

// const LeadsPage: React.FC = () => {
//   const [leads, setLeads] = useState<Lead[]>([]);
//   const [totalLeads, setTotalLeads] = useState<number>(0);
//   const [page, setPage] = useState<number>(1);
//   const [perPage] = useState<number>(10);
//   const [totalPages, setTotalPages] = useState<number>(1);
//   const [filters, setFilters] = useState<{
//     status?: string;
//     industry?: string;
//     company_size?: string;
//     score_range?: string;
//     search?: string;
//   }>({});
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const [newLead, setNewLead] = useState<LeadCreate>({
//     first_name: "",
//     last_name: "",
//     email: "",
//     company: "",
//     title: "",
//     phone: "",
//     industry: "",
//     company_size: "",
//     budget_range: "",
//     lead_source: "",
//     notes: "",
//     linkedin_url: "",
//     website: "",
//   });

//   const handleGenerateScore = async (leadId: number) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const updatedLead = await LeadService.generateLeadScore(leadId);
//       setLeads((prev) =>
//         prev.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead))
//       );
//     } catch (err: any) {
//       setError(`Failed to generate score for lead ${leadId}`);
//       console.error("Generate score error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch leads when page or filters change
//   useEffect(() => {
//     const fetchLeads = async () => {
//       setLoading(true);
//       try {
//         const params: any = { page, per_page: perPage, ...filters };
//         if (params.score_range) {
//           // Convert score_range to API-compatible format if needed
//           const [min, max] = params.score_range
//             .replace("High (80-100)", "80-100")
//             .replace("Medium (50-79)", "50-79")
//             .replace("Low (0-49)", "0-49")
//             .split("-")
//             .map(Number);
//           params.score_min = min;
//           params.score_max = max;
//           delete params.score_range;
//         }
//         if (params.status === "All Statuses") delete params.status;
//         if (params.industry === "All Industries") delete params.industry;
//         if (params.company_size === "All Sizes") delete params.company_size;
//         if (params.search === "") delete params.search;

//         const response: PaginatedResponse<Lead> = await LeadService.getLeads(
//           params
//         );
//         setLeads(response.leads);
//         setTotalLeads(response.total);
//         setTotalPages(response.total_pages);
//       } catch (err) {
//         setError("Failed to fetch leads. Please try again later.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLeads();
//   }, [page, filters]);

//   // Handle filter changes
//   const handleFilterChange = (key: string, value: string) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//     setPage(1); // Reset to first page on filter change
//   };

//   // Handle search input
//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFilters((prev) => ({ ...prev, search: e.target.value }));
//     setPage(1);
//   };

//   // Handle new lead form input
//   const handleNewLeadChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     setNewLead((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   // Handle creating a new lead
//   const handleCreateLead = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await LeadService.createLead(newLead);
//       setIsModalOpen(false);
//       setNewLead({
//         first_name: "",
//         last_name: "",
//         email: "",
//         company: "",
//         title: "",
//         phone: "",
//         industry: "",
//         company_size: "",
//         budget_range: "",
//         lead_source: "",
//         notes: "",
//         linkedin_url: "",
//         website: "",
//       });
//       // Trigger a refresh of the leads list
//       setFilters((prev) => ({ ...prev }));
//     } catch (err) {
//       setError("Failed to create lead. Please try again.");
//       console.error(err);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Page Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Lead Management</h2>
//           <p className="text-gray-600 mt-1">
//             Manage and qualify your sales leads with AI assistance
//           </p>
//         </div>
//         <div className="flex space-x-3">
//           <button className="btn-outline">
//             <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
//             Import
//           </button>
//           <button
//             className="btn-primary"
//             onClick={() => setIsModalOpen(true)}>
//             <PlusIcon className="h-5 w-5 mr-2" />
//             Add Lead
//           </button>
//         </div>
//       </div>

//       {/* Filters and Search */}
//       <div className="bg-white rounded-lg shadow-sm p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-medium text-gray-900">Filters</h3>
//           <button
//             className="btn-outline text-sm"
//             onClick={() => setFilters({})}>
//             <FunnelIcon className="h-4 w-4 mr-2" />
//             Reset Filters
//           </button>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//           <div>
//             <label className="label">Status</label>
//             <select
//               className="input"
//               value={filters.status || "All Statuses"}
//               onChange={(e) => handleFilterChange("status", e.target.value)}>
//               <option>All Statuses</option>
//               <option>New Lead</option>
//               <option>Qualified</option>
//               <option>Contacted</option>
//               <option>Converted</option>
//             </select>
//           </div>
//           <div>
//             <label className="label">Industry</label>
//             <select
//               className="input"
//               value={filters.industry || "All Industries"}
//               onChange={(e) => handleFilterChange("industry", e.target.value)}>
//               <option>All Industries</option>
//               <option>Technology</option>
//               <option>Healthcare</option>
//               <option>Finance</option>
//             </select>
//           </div>
//           <div>
//             <label className="label">Company Size</label>
//             <select
//               className="input"
//               value={filters.company_size || "All Sizes"}
//               onChange={(e) =>
//                 handleFilterChange("company_size", e.target.value)
//               }>
//               <option>All Sizes</option>
//               <option>1-10</option>
//               <option>11-50</option>
//               <option>51-200</option>
//               <option>200+</option>
//             </select>
//           </div>
//           <div>
//             <label className="label">Score Range</label>
//             <select
//               className="input"
//               value={filters.score_range || "All Scores"}
//               onChange={(e) =>
//                 handleFilterChange("score_range", e.target.value)
//               }>
//               <option>All Scores</option>
//               <option>High (80-100)</option>
//               <option>Medium (50-79)</option>
//               <option>Low (0-49)</option>
//             </select>
//           </div>
//           <div>
//             <label className="label">Search</label>
//             <input
//               type="text"
//               className="input"
//               placeholder="Search by name, email, or company"
//               value={filters.search || ""}
//               onChange={handleSearchChange}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Leads Table */}
//       <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h3 className="text-lg font-medium text-gray-900">
//             All Leads ({totalLeads})
//           </h3>
//         </div>

//         {loading && (
//           <div className="text-center py-12 text-gray-600">Loading...</div>
//         )}
//         {error && <div className="text-center py-12 text-red-600">{error}</div>}

//         {!loading && !error && leads.length === 0 && (
//           <div className="text-center py-12">
//             <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
//               <UserGroupIcon className="h-6 w-6 text-gray-400" />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               No leads yet
//             </h3>
//             <p className="text-gray-500 mb-6">
//               Start by adding your first lead or importing from a CSV file
//             </p>
//             <div className="flex justify-center space-x-3">
//               <button
//                 className="btn-primary"
//                 onClick={() => setIsModalOpen(true)}>
//                 <PlusIcon className="h-5 w-5 mr-2" />
//                 Add First Lead
//               </button>
//               <button className="btn-outline">
//                 <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
//                 Import CSV
//               </button>
//             </div>
//           </div>
//         )}

//         {!loading && !error && leads.length > 0 && (
//           <div className="px-6 py-4">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead>
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Email
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Company
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Score
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Created At
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {leads.map((lead) => (
//                   <tr key={lead.id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {lead.first_name} {lead.last_name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {lead.email}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {lead.company || "N/A"}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {lead.status}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {lead.score}
//                     </td>
//                     <td>
//                       <button
//                         className="btn btn-primary"
//                         onClick={() => handleGenerateScore(lead.id)}
//                         disabled={loading}>
//                         {loading ? "Generating..." : "Generate Score"}
//                       </button>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {new Date(lead.created_at).toLocaleDateString()}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {/* Pagination Controls */}
//             <div className="flex justify-between items-center mt-4">
//               <button
//                 className="btn-outline"
//                 disabled={page === 1}
//                 onClick={() => setPage((prev) => prev - 1)}>
//                 Previous
//               </button>
//               <span>
//                 Page {page} of {totalPages}
//               </span>
//               <button
//                 className="btn-outline"
//                 disabled={page === totalPages}
//                 onClick={() => setPage((prev) => prev + 1)}>
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Add Lead Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 Add New Lead
//               </h3>
//               <button onClick={() => setIsModalOpen(false)}>
//                 <XMarkIcon className="h-6 w-6 text-gray-600" />
//               </button>
//             </div>
//             <form onSubmit={handleCreateLead}>
//               <div className="space-y-4">
//                 <div>
//                   <label className="label">First Name</label>
//                   <input
//                     type="text"
//                     name="first_name"
//                     className="input"
//                     value={newLead.first_name}
//                     onChange={handleNewLeadChange}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="label">Last Name</label>
//                   <input
//                     type="text"
//                     name="last_name"
//                     className="input"
//                     value={newLead.last_name}
//                     onChange={handleNewLeadChange}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="label">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     className="input"
//                     value={newLead.email}
//                     onChange={handleNewLeadChange}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="label">Company</label>
//                   <input
//                     type="text"
//                     name="company"
//                     className="input"
//                     value={newLead.company}
//                     onChange={handleNewLeadChange}
//                   />
//                 </div>
//                 <div>
//                   <label className="label">Industry</label>
//                   <select
//                     name="industry"
//                     className="input"
//                     value={newLead.industry}
//                     onChange={handleNewLeadChange}>
//                     <option value="">Select Industry</option>
//                     <option>Technology</option>
//                     <option>Healthcare</option>
//                     <option>Finance</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="label">Company Size</label>
//                   <select
//                     name="company_size"
//                     className="input"
//                     value={newLead.company_size}
//                     onChange={handleNewLeadChange}>
//                     <option value="">Select Size</option>
//                     <option>1-10</option>
//                     <option>11-50</option>
//                     <option>51-200</option>
//                     <option>200+</option>
//                   </select>
//                 </div>
//               </div>
//               <div className="flex justify-end space-x-3 mt-6">
//                 <button
//                   type="button"
//                   className="btn-outline"
//                   onClick={() => setIsModalOpen(false)}>
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="btn-primary">
//                   Create Lead
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LeadsPage;
// pages/LeadsPage.tsx
import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { LeadService } from "../../services/leadService"; // Service class
import type {
  Lead,
  LeadCreate,
  PaginatedResponse,
  GrokAnalysisResponse, // Now from types
  GrokMessageResponse, // Now from types
} from "../../types";
import LeadsFilters from "../../components/leads/LeadsFilters";
import LeadsTable from "../../components/leads/LeadsTable";
import Pagination from "../../components/common/Pagination";
// import AnalysisModal from "../../components/leads/AnalysisModal";
// import MessageModal from "../../components/leads/MessageModal";
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

      {/* {isAnalysisModalOpen && grokAnalysis && selectedLead && (
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
      )} */}
    </div>
  );
};

export default LeadsPage;
