
import { AppData } from './types';

export const INITIAL_DATA: AppData = {
  themes: [],
  quizzes: [],
  questions: [],
  results: [],
  users: [
    {
      id: 'admin-default',
      name: 'Administrador',
      role: 'admin',
      password: 'admin' // Simple default password
    }
  ]
};

export const COLORS = {
  primary: '#2563eb', // Blue-600
  secondary: '#22c55e', // Green-500
  background: '#f3f4f6', // Gray-100
  text: '#1f2937', // Gray-800
};
