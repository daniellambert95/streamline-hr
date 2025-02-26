import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';

export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  getEmployeeAnalytics = async (req: Request, res: Response): Promise<void> => {
    try {
      const analytics = await this.analyticsService.getEmployeeAnalytics(req.user.id);
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ 
        error: 'Failed to fetch analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}
