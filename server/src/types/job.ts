export interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  salary: string;
  status: 'open' | 'closed' | 'on-hold';
  created_at: Date;
  updated_at: Date;
  company_id: number;
}

export interface JobCreationDTO {
  title: string;
  description: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  salary: string;
  status: 'open' | 'closed' | 'on-hold';
} 