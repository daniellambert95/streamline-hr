export interface ApplicantNote {
  id: number;
  content: string;
  created_at: string;
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
  applied_date: string;
  job_listing_id: number;
  job_title: string;
  notes: ApplicantNote[];
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