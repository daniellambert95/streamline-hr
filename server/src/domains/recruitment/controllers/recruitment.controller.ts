import { Request, Response } from 'express';
import { RecruitmentService } from '../services/recruitment.service';
import { ValidationError } from '../../../shared/errors/application.errors';

export class RecruitmentController {
  constructor(private recruitmentService: RecruitmentService) {}

  // Jobs methods
  createJob = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user?.company_id) {
        throw new ValidationError('User must belong to a company to create jobs');
      }
      const job = await this.recruitmentService.createJob(req.body, req.user.company_id);
      res.status(201).json(job);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to create job' });
      }
    }
  };

  getJobs = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user?.company_id) {
        throw new ValidationError('User must belong to a company to view jobs');
      }
      const jobs = await this.recruitmentService.getJobs(req.user.company_id);
      res.json(jobs);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to fetch jobs' });
      }
    }
  };

  // Applicants methods
  getApplicants = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user?.company_id) {
        throw new ValidationError('User must belong to a company to view applicants');
      }
      const applicants = await this.recruitmentService.getApplicants(req.user.company_id);
      res.json(applicants);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to fetch applicants' });
      }
    }
  };

  getRecruitmentStats = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user?.company_id) {
        throw new ValidationError('User must belong to a company to view stats');
      }
      const stats = await this.recruitmentService.getRecruitmentStats(req.user.company_id);
      res.json(stats);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to fetch recruitment stats' });
      }
    }
  };
}
