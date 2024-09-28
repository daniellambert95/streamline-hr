import { Router } from 'express';
import { handleUpload, uploadFiles } from '../controllers/uploadController';
import { Request, Response, NextFunction } from 'express';

const router = Router();

// Define the upload route with type assertions
router.post('/upload', uploadFiles, (req: Request, res: Response, next: NextFunction) => {
  handleUpload(req as any, res);
});

export default router;