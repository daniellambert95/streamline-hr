// Review Status Type
export type ReviewStatus = 'Completed' | 'In Progress' | 'Pending';

// Review Type
export type ReviewType = 'Quarterly Review' | 'Annual Review' | 'Peer Review' | '360 Review';

// Performance Review Entry
export interface PerformanceReview {
  id: string;
  employeeName: string;
  employeeId: string;
  reviewType: ReviewType;
  reviewer: string;
  reviewerId: string;
  date: string;
  rating: number;
  status: ReviewStatus;
  comments?: string;
  goals?: PerformanceGoal[];
  skillAssessments?: SkillAssessment[];
}

// Performance Goal
export interface PerformanceGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  progress: number;
}

// Skill Assessment
export interface SkillAssessment {
  skill: string;
  score: number;
  fullMark: number;
  comments?: string;
}

// Performance Stats
export interface PerformanceStats {
  averageRating: number;
  reviewsCompleted: number;
  totalReviews: number;
  highPerformers: number;
  needsImprovement: number;
  previousQuarterComparison: {
    averageRating: number;
    reviewsCompleted: number;
    highPerformers: number;
    needsImprovement: number;
  };
}

// Performance Trend Data Point
export interface PerformanceTrendPoint {
  month: string;
  avgRating: number;
  reviews: number;
}

// Skills Matrix Data Point
export interface SkillMatrixPoint {
  skill: string;
  score: number;
  fullMark: number;
}

// Review Period
export interface ReviewPeriod {
  id: string;
  name: string;  // e.g., "Q1 2024"
  startDate: string;
  endDate: string;
  status: 'Upcoming' | 'Active' | 'Completed';
}

// Review Template
export interface ReviewTemplate {
  id: string;
  name: string;
  type: ReviewType;
  sections: ReviewSection[];
}

// Review Section
export interface ReviewSection {
  id: string;
  title: string;
  type: 'rating' | 'text' | 'skills' | 'goals';
  required: boolean;
  questions?: ReviewQuestion[];
}

// Review Question
export interface ReviewQuestion {
  id: string;
  question: string;
  type: 'rating' | 'text' | 'multiple-choice';
  required: boolean;
  options?: string[];  // For multiple-choice questions
} 