import { supabase } from '../lib/supabase';
import type { Task, Stats } from '../types';

const STORAGE_KEY = 'taskmaster_descriptions';

function getLocalDescriptions(): Record<number, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalDescription(id: number, desc: string): void {
  if (typeof window === 'undefined') return;
  try {
    const map = getLocalDescriptions();
    if (desc && desc.trim()) {
      map[id] = desc.trim();
    } else {
      delete map[id];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {}
}

function removeLocalDescription(id: number): void {
  if (typeof window === 'undefined') return;
  try {
    const map = getLocalDescriptions();
    delete map[id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {}
}

export const taskService = {
  getTasks: async (filter?: string): Promise<Task[]> => {
    try {
      let query = supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter === 'completed') {
        query = query.eq('is_completed', true);
      } else if (filter === 'pending') {
        query = query.eq('is_completed', false);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching tasks from Supabase:', error);
        return [];
      }

      const localMap = getLocalDescriptions();
      return ((data as Task[]) || []).map((t) => ({
        ...t,
        description: t.description ?? localMap[t.id] ?? null,
      }));
    } catch (err) {
      console.error('Unexpected error in getTasks:', err);
      return [];
    }
  },

  getStats: async (): Promise<Stats> => {
    try {
      const { data: allTasks, error } = await supabase
        .from('tasks')
        .select('*');

      if (error || !allTasks) {
        console.error('Error fetching stats from Supabase:', error);
        return { total: 0, completed: 0, pending: 0, overdue: 0, due_today: 0 };
      }

      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      const tasks = allTasks as Task[];
      const total = tasks.length;
      const completed = tasks.filter((t) => t.is_completed).length;
      const pending = tasks.filter((t) => !t.is_completed).length;
      const overdue = tasks.filter(
        (t) => !t.is_completed && t.due_date && t.due_date < todayStr
      ).length;
      const due_today = tasks.filter(
        (t) => !t.is_completed && t.due_date === todayStr
      ).length;

      return {
        total,
        completed,
        pending,
        overdue,
        due_today,
      };
    } catch (err) {
      console.error('Unexpected error in getStats:', err);
      return { total: 0, completed: 0, pending: 0, overdue: 0, due_today: 0 };
    }
  },

  createTask: async (data: {
    title: string;
    category?: string;
    priority?: string;
    due_date?: string;
    description?: string;
  }): Promise<Task | null> => {
    const basePayload = {
      title: data.title,
      category: data.category || null,
      priority: data.priority || 'medium',
      due_date: data.due_date || null,
      is_completed: false,
    };

    // Try inserting with description in case column exists in DB
    try {
      const { data: inserted, error } = await supabase
        .from('tasks')
        .insert([{ ...basePayload, description: data.description || null }])
        .select()
        .single();

      if (!error && inserted) {
        if (data.description) saveLocalDescription(inserted.id, data.description);
        return inserted as Task;
      }
    } catch {}

    // Fallback: insert without description column in DB, preserve locally
    const { data: inserted, error } = await supabase
      .from('tasks')
      .insert([basePayload])
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      throw error;
    }

    if (data.description && inserted) {
      saveLocalDescription(inserted.id, data.description);
    }
    return { ...(inserted as Task), description: data.description || null };
  },

  updateTaskDescription: async (id: number, description: string): Promise<Task | null> => {
    saveLocalDescription(id, description);

    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ description: description.trim() || null })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return data as Task;
      }
    } catch (err) {
      console.warn('Supabase description update skipped:', err);
    }

    return null;
  },

  toggleTask: async (id: number, currentStatus: boolean): Promise<Task | null> => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ is_completed: !currentStatus })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error toggling task:', error);
      throw error;
    }
    return data as Task;
  },

  deleteTask: async (id: number): Promise<void> => {
    removeLocalDescription(id);
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },
};
