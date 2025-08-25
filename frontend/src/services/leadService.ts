// frontend/src/services/leadService.ts
import { api } from "./api";
import type {
  Lead,
  LeadCreate,
  PaginatedResponse,
  DashboardStats,
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
