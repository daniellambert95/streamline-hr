export interface JobListing {
  id: number;
  title: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  status: 'open' | 'closed' | 'on-hold';
  created_at: string;
  candidates_count: number;
  salary: string;
} 