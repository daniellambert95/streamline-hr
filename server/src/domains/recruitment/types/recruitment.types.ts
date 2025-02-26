import { Job, JobCreationDTO } from './job.types';
import { Applicant, ApplicantNote, ApplicantActivity } from './applicant.types';

export {
  Job,
  JobCreationDTO,
  Applicant,
  ApplicantNote,
  ApplicantActivity
};

// Additional shared types if needed
export interface RecruitmentStats {
  totalJobs: number;
  activeJobs: number;
  totalApplicants: number;
  applicantsByStatus: {
    [key: string]: number;
  };
} 