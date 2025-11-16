export interface User {
  id: string;
  username: string;
  password_hash: string;
  email?: string;
  full_name?: string;
  organization?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email?: string;
  full_name?: string;
  organization?: string;
  role: string;
}

export interface FormSubmission {
  id: string;
  created_by_user_id: string;
  county?: string;
  district?: string;
  building_type?: 'leased' | 'owned';
  school_building?: string;
  completed_by?: string;
  completion_date?: string;
  section_a_items?: string;
  section_a_notes?: string;
  section_b_items?: string;
  section_b_notes?: string;
  section_a_no_count: number;
  section_a_compliant: boolean;
  section_b_yes_count: number;
  section_b_no_count: number;
  section_b_na_count: number;
  section_b_percentage: number;
  section_b_compliant: boolean;
  overall_compliant: boolean;
  signature_1_name?: string;
  signature_1_title?: string;
  signature_1_date?: string;
  signature_2_name?: string;
  signature_2_title?: string;
  signature_2_date?: string;
  signature_3_name?: string;
  signature_3_title?: string;
  signature_3_date?: string;
  status: 'draft' | 'submitted';
  created_at: string;
  updated_at: string;
  submitted_at?: string;
}

export interface JWTPayload {
  userId: string;
  username: string;
}
