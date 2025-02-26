import { Pool } from 'pg';
import { RecruitmentModel } from '../models/recruitment.model';
import { Job, JobCreationDTO, Applicant, RecruitmentStats } from '../types/recruitment.types';
import { ValidationError } from '../../../shared/errors/application.errors';

export class RecruitmentService {
  private recruitmentModel: RecruitmentModel;

  constructor(pool: Pool) {
    this.recruitmentModel = new RecruitmentModel(pool);
  }

  async createJob(jobData: JobCreationDTO, companyId: number): Promise<Job> {
    // Validate required fields
    const requiredFields = ['title', 'description', 'location', 'type', 'salary'] as const;
    const missingFields = requiredFields.filter(field => !jobData[field]);
    
    if (missingFields.length > 0) {
      throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return this.recruitmentModel.createJob(jobData, companyId);
  }

  async getJobs(companyId: number): Promise<Job[]> {
    return this.recruitmentModel.getJobsByCompany(companyId);
  }

  async getApplicants(companyId: number): Promise<Applicant[]> {
    return this.recruitmentModel.getApplicantsByCompany(companyId);
  }

  async getRecruitmentStats(companyId: number): Promise<RecruitmentStats> {
    const [jobs, applicants] = await Promise.all([
      this.getJobs(companyId),
      this.getApplicants(companyId)
    ]);

    return {
      totalJobs: jobs.length,
      activeJobs: jobs.filter(job => job.status === 'open').length,
      totalApplicants: applicants.length,
      applicantsByStatus: applicants.reduce((acc, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}
