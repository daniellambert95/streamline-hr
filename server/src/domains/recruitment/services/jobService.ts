import { Pool } from 'pg';
import { Job, JobCreationDTO } from '../types/job.types';
import { DatabaseError } from '../../../shared/errors/application.errors';

export class JobService {
  constructor(private db: Pool) {}

  async createJob(jobData: JobCreationDTO, companyId: number): Promise<Job> {
    const query = `
      INSERT INTO job_listings (
        title, description, location, type, 
        salary, status, company_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    try {
      const { rows } = await this.db.query(query, [
        jobData.title,
        jobData.description,
        jobData.location,
        jobData.type,
        jobData.salary,
        jobData.status,
        companyId
      ]);
      return rows[0];
    } catch (error) {
      throw new DatabaseError('Failed to create job listing');
    }
  }

  async getJobs(companyId: number): Promise<Job[]> {
    const query = `
      SELECT j.*, COUNT(a.id) as candidates_count
      FROM job_listings j
      LEFT JOIN applicants a ON j.id = a.job_listing_id
      WHERE j.company_id = $1
      GROUP BY j.id
    `;

    try {
      const { rows } = await this.db.query(query, [companyId]);
      return rows;
    } catch (error) {
      throw new DatabaseError('Failed to fetch jobs');
    }
  }
} 