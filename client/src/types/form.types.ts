export interface ChecklistItem {
  response: 'yes' | 'no' | 'na' | '';
  location?: string;
}

export interface FormData {
  id?: string;
  county?: string;
  district?: string;
  building_type?: 'leased' | 'owned';
  school_building?: string;
  completed_by?: string;
  completion_date?: string;
  section_a_items?: Record<string, ChecklistItem>;
  section_a_notes?: string;
  section_b_items?: Record<string, ChecklistItem>;
  section_b_notes?: string;
  signature_1_name?: string;
  signature_1_title?: string;
  signature_1_date?: string;
  signature_2_name?: string;
  signature_2_title?: string;
  signature_2_date?: string;
  signature_3_name?: string;
  signature_3_title?: string;
  signature_3_date?: string;
  status?: 'draft' | 'submitted';
  submitted_at?: string;
}

export interface FormListItem {
  id: string;
  school_building?: string;
  status: 'draft' | 'submitted';
  completion_percentage: number;
  updated_at: string;
  submitted_at?: string;
}

export interface Signature {
  name: string;
  title: string;
  date: string;
}
