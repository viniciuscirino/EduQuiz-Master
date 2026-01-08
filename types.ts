
export type QuestionType = 'multiple' | 'boolean' | 'short_answer' | 'ordering';
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  password?: string; // Only for admin
}

export interface Question {
  id: string;
  quizId: string;
  type: QuestionType;
  text: string;
  options: string[]; // For 'multiple', 'boolean' (Verdadeiro/Falso) and 'ordering' (items to sort)
  correctAnswerIndex?: number; // For 'multiple' and 'boolean'
  correctAnswerText?: string; // For 'short_answer'
  correctOrder?: number[]; // For 'ordering' (e.g. [2, 0, 1, 3])
  explanation: string;
  timeLimit: number; // in seconds
}

export interface Quiz {
  id: string;
  themeId: string;
  title: string;
  description: string;
}

export interface Theme {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface UserResult {
  id: string;
  userName: string;
  quizId: string;
  themeId: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  averageResponseTime: number;
  date: string;
}

export interface AppData {
  themes: Theme[];
  quizzes: Quiz[];
  questions: Question[];
  results: UserResult[];
  users: User[];
}
