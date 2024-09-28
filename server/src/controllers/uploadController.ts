import { Request, Response } from 'express';
import multer, { Multer, FileFilterCallback } from 'multer';
import path from 'path';

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadsDir = path.join(__dirname, '../uploads');
    cb(null, uploadsDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Create the multer instance
const upload: Multer = multer({ storage });

// Middleware for file upload
export const uploadFiles = upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'coverLetter', maxCount: 1 },
]);

// Define a custom interface for the request to include the files property
interface CustomRequest extends Request {
  files?: {
    [fieldname: string]: Express.Multer.File[];
  };
}

// Handle file upload request
export const handleUpload = (req: CustomRequest, res: Response) => {
  const files = req.files;

  const resume = files?.resume?.[0];
  const coverLetter = files?.coverLetter?.[0];

  if (resume) {
    console.log('Resume uploaded:', resume.filename);
  }

  if (coverLetter) {
    console.log('Cover letter uploaded:', coverLetter.filename);
  }

  res.status(200).json({ 
    message: 'Files uploaded successfully!', 
    resume: resume ? { filename: resume.filename } : null,
    coverLetter: coverLetter ? { filename: coverLetter.filename } : null
  });
};