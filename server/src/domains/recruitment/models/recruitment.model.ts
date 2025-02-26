import { Pool } from 'pg';
import { Job, JobCreationDTO, Applicant } from '../types/recruitment.types';
import { DatabaseError } from '../../../shared/errors/application.errors';

export class RecruitmentModel {
  constructor(private pool: Pool) {}

  async createJob(jobData: JobCreationDTO, companyId: number): Promise<Job> {
    const query = `
      INSERT INTO job_listings (
        title, description, location, type, 
        salary, status, company_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    try {
      const { rows } = await this.pool.query(query, [
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

  async getJobsByCompany(companyId: number): Promise<Job[]> {
    const query = `
      SELECT j.*, COUNT(a.id) as candidates_count
      FROM job_listings j
      LEFT JOIN applicants a ON j.id = a.job_listing_id
      WHERE j.company_id = $1
      GROUP BY j.id
    `;

    try {
      const { rows } = await this.pool.query(query, [companyId]);
      return rows;
    } catch (error) {
      throw new DatabaseError('Failed to fetch jobs');
    }
  }

  async getApplicantsByCompany(companyId: number): Promise<Applicant[]> {
    const query = `
      SELECT 
        a.*,
        j.title as job_title,
        COALESCE(
          (
            SELECT json_agg(json_build_object(
              'id', an.id,
              'content', an.content,
              'created_at', an.created_at
            ))
            FROM applicant_notes an
            WHERE an.applicant_id = a.id
          ),
          '[]'::json
        ) as notes
      FROM applicants a
      JOIN job_listings j ON a.job_listing_id = j.id
      WHERE a.company_id = $1
      ORDER BY a.applied_date DESC
    `;

    try {
      const { rows } = await this.pool.query(query, [companyId]);
      return rows;
    } catch (error) {
      throw new DatabaseError('Failed to fetch applicants');
    }
  }
} 