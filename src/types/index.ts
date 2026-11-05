export interface Task {
  id: number;
  title: string;
  description?: string | null;
  category: string | null;
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Stats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  due_today: number;
}

export type FilterType = 'all' | 'pending' | 'completed';
