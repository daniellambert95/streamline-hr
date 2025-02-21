import { Request, Response, NextFunction } from 'express';
import { JobCreationDTO } from '../../types/job';

export const validateJobData = (req: Request, res: Response, next: NextFunction) => {
  const job: JobCreationDTO = req.body;
  
  if (!job.title || !job.description || !job.location || !job.type || !job.salary) {
    return res.status(400).json({ error: 'Missing required job fields' });
  }

  if (!['full-time', 'part-time', 'contract'].includes(job.type)) {
    return res.status(400).json({ error: 'Invalid job type' });
  }

  if (!['open', 'closed', 'on-hold'].includes(job.status)) {
    return res.status(400).json({ error: 'Invalid job status' });
  }

  next();
}; 