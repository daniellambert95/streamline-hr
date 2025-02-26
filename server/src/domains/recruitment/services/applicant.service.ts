import { Pool } from 'pg';
import { Applicant, ApplicantActivity } from '../types/applicant.types';
import { DatabaseError } from '../../../shared/errors/application.errors';

export class ApplicantService {
  constructor(private db: Pool) {}

  async getApplicantsForJob(jobId: number, companyId: number): Promise<Applicant[]> {
    const query = `
      SELECT 
        a.*,
        j.title as job_title
      FROM applicants a
      JOIN job_listings j ON a.job_listing_id = j.id
      WHERE a.job_listing_id = $1 AND a.company_id = $2
    `;

    try {
      const { rows } = await this.db.query(query, [jobId, companyId]);
      return rows;
    } catch (error) {
      throw new DatabaseError('Failed to fetch applicants');
    }
  }

  async getAllApplicants(companyId: number): Promise<Applicant[]> {
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
      const { rows } = await this.db.query(query, [companyId]);
      return rows;
    } catch (error) {
      throw new DatabaseError('Failed to fetch applicants');
    }
  }

  async getRecentActivity(companyId: number): Promise<ApplicantActivity[]> {
    const query = `
      SELECT 
        aa.id,
        aa.applicant_id,
        aa.activity_type,
        aa.old_value,
        aa.new_value,
        aa.created_at,
        CONCAT(a.first_name, ' ', a.last_name) as applicant_name,
        j.title as job_title
      FROM applicant_activity aa
      JOIN applicants a ON aa.applicant_id = a.id
      JOIN job_listings j ON a.job_listing_id = j.id
      WHERE a.company_id = $1
      ORDER BY aa.created_at DESC
      LIMIT 20
    `;

    try {
      const { rows } = await this.db.query(query, [companyId]);
      return rows;
    } catch (error) {
      throw new DatabaseError('Failed to fetch applicant activity');
    }
  }
} 