// frontend/src/services/leadService.ts
import { api } from "./api";
import type {
  Lead,
  LeadCreate,
  PaginatedResponse,
  DashboardStats,
  GrokAnalysisResponse, // Imported from types
  GrokMessageResponse, // Imported from types
  GrokQualificationResponse, // Imported from types
} from "../types";

export class LeadService {
  static async getLeads(params?: {
    page?: number;
    per_page?: number;
    status?: string;
    industry?: string;
    company_size?: string;
    search?: string;
  }) {
    try {
      const response = await api.get("/leads/", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching leads:", error);
      throw error;
    }
  }

  // Updated method to use Grok API for lead analysis and scoring
  static async generateLeadScore(leadId: number): Promise<Lead> {
    try {
      // Call the Grok analyze endpoint
      const grokResponse = await api.post<GrokAnalysisResponse>(
        `/grok/analyze-lead/${leadId}`
      );

      if (grokResponse.data.success && !grokResponse.data.analysis.error) {
        // The lead score should already be updated in the backend
        // Fetch the updated lead to return it
        const updatedLead = await this.getLead(leadId);
        return updatedLead;
      } else {
        throw new Error(grokResponse.data.message || "Grok analysis failed");
      }
    } catch (error: any) {
      console.error("Error generating lead score with Grok:", error);
      throw error;
    }
  }

  // New method for getting detailed Grok analysis
  static async analyzeLeadWithGrok(
    leadId: number
  ): Promise<GrokAnalysisResponse> {
    try {
      const response = await api.post<GrokAnalysisResponse>(
        `/grok/analyze-lead/${leadId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error analyzing lead with Grok:", error);
      throw error;
    }
  }

  // New method for generating personalized messages
  static async generatePersonalizedMessage(
    leadId: number,
    messageType: "email" | "linkedin" | "call" | "meeting" = "email"
  ): Promise<GrokMessageResponse> {
    try {
      const response = await api.post<GrokMessageResponse>(
        `/grok/generate-message/${leadId}`,
        null,
        {
          params: { message_type: messageType },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error generating personalized message:", error);
      throw error;
    }
  }

  // New method for auto-qualifying leads
  static async autoQualifyLead(
    leadId: number
  ): Promise<GrokQualificationResponse> {
    try {
      const response = await api.post<GrokQualificationResponse>(
        `/grok/qualify-lead/${leadId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error auto-qualifying lead:", error);
      throw error;
    }
  }

  // New method to test Grok connection
  static async testGrokConnection(): Promise<any> {
    try {
      const response = await api.get("/grok/test-connection");
      return response.data;
    } catch (error) {
      console.error("Error testing Grok connection:", error);
      throw error;
    }
  }

  static async createLead(leadData: LeadCreate): Promise<Lead> {
    try {
      const response = await api.post("/leads/", leadData);
      return response.data;
    } catch (error) {
      console.error("Error creating lead:", error);
      throw error;
    }
  }

  static async getLead(id: number): Promise<Lead> {
    try {
      const response = await api.get(`/leads/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching lead:", error);
      throw error;
    }
  }

  static async updateLead(id: number, leadData: Partial<Lead>): Promise<Lead> {
    try {
      const response = await api.put(`/leads/${id}`, leadData);
      return response.data;
    } catch (error) {
      console.error("Error updating lead:", error);
      throw error;
    }
  }

  static async deleteLead(id: number): Promise<void> {
    try {
      await api.delete(`/leads/${id}`);
    } catch (error) {
      console.error("Error deleting lead:", error);
      throw error;
    }
  }

  static async getLeadStats() {
    try {
      const response = await api.get("/leads/stats/summary");
      return response.data;
    } catch (error) {
      console.error("Error fetching lead stats:", error);
      throw error;
    }
  }

  static async checkApiHealth() {
    try {
      const response = await api.get("/health", {
        baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
      });
      return response.data;
    } catch (error) {
      console.error("API health check failed:", error);
      return { status: "unhealthy", database: "disconnected" };
    }
  }
}
