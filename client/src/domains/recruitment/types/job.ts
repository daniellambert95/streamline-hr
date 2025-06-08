export interface JobListing {
  id: string;
  company_id: number;
  title: string;
  description?: string;
  location?: string;
  department?: string;
  industry?: string;
  type?: 'full-time' | 'part-time' | 'contract';
  salary?: string;
  hours?: string;
  status: 'open' | 'closed' | '1st round' | '2nd round' | '3rd round' | 'offer sent' | 'pending approval';
  responsibilities?: string;
  educational_requirements?: string;
  experience_requirements?: string;
  desired_skills?: string;
  qualifications?: string;
  benefits?: string;
  incentives?: string;
  candidates_count?: number;
  created_at: string;
  updated_at: string;
  recruiter_id?: number;
  recruiter_name?: string;
} 