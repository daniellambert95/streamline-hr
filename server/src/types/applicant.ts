export interface ApplicantNote {
  id: number;
  content: string;
  created_at: Date;
}

export interface Applicant {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  resume_path: string;
  cover_letter_path: string;
  linkedin_url: string;
  status: 'pending' | 'under_review' | 'interviewing' | 'accepted' | 'rejected';
  applied_date: Date;
  job_listing_id: number;
  job_title: string;
  company_id: number;
  notes?: ApplicantNote[];
}

export interface ApplicantActivity {
  id: number;
  applicant_id: number;
  activity_type: string;
  old_value: string;
  new_value: string;
  created_at: Date;
  applicant_name: string;
  job_title: string;
} 