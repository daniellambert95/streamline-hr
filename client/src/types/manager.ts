export interface Manager {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  job_title: string;
  department_id?: number;
  can_approve_time_off: boolean;
  can_hire: boolean;
  can_edit_salary: boolean;
} 