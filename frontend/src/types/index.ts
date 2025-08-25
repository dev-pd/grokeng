// frontend/src/types/index.ts

export interface Lead {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  company?: string;
  title?: string;
  phone?: string;
  industry?: string;
  company_size?: string;
  budget_range?: string;
  status: string;
  score: number;
  lead_source?: string;
  notes?: string;
  linkedin_url?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadCreate {
  first_name: string;
  last_name: string;
  email: string;
  company?: string;
  title?: string;
  phone?: string;
  industry?: string;
  company_size?: string;
  budget_range?: string;
  lead_source?: string;
  notes?: string;
  linkedin_url?: string;
  website?: string;
}

export interface Message {
  id: number;
  lead_id: number;
  message_type: "email" | "linkedin" | "call" | "meeting";
  subject?: string;
  content: string;
  sent_at?: string;
  response_received: boolean;
  response_content?: string;
  response_at?: string;
  grok_generated: boolean;
  template_used?: string;
  created_at: string;
  updated_at: string;
}

export interface PipelineStage {
  id: number;
  name: string;
  description?: string;
  stage_order: number;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: number;
  lead_id: number;
  activity_type: string;
  description?: string;
  performed_by?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  leads: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface DashboardStats {
  total_leads: number;
  qualified_leads: number;
  contacted_leads: number;
  converted_leads: number;
  average_score: number;
  pipeline_summary: Array<{
    stage_name: string;
    stage_color: string;
    lead_count: number;
    avg_score: number;
  }>;
}
