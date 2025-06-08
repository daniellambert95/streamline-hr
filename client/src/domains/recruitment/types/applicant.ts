export interface ApplicantNote {
  id: number;
  content: string;
  created_at: string;
}

export interface Applicant {
  id: number | string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  status: string;
  applied_date: string;
  job_listing_id: number | string;
  job_title?: string;
  resume_path?: string;
  cover_letter_path?: string;
  location?: string;
  skills?: string[];
  notes?: {
    id: string;
    content: string;
    created_at: string;
    created_by: string;
  }[];
  interviews?: {
    id: string;
    type: string;
    date: string;
    interviewer?: string;
    status: string;
    feedback?: string;
  }[];
}

export interface ApplicantActivity {
  id: number;
  applicant_id: number;
  activity_type: string;
  old_value: string;
  new_value: string;
  created_at: string;
  applicant_name: string;
  job_title: string;
} 