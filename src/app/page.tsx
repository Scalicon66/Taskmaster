'use client';

import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import type { Task, Stats, FilterType } from '../types';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import StatsCards from '../components/StatsCards';
import TaskList from '../components/TaskList';
import Footer from '../components/Footer';
import TaskLoader from '../components/TaskLoader';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    due_today: 0,
  });
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(true);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key || url.includes('your-project-id')) {
      setIsConfigured(false);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [tasksData, statsData] = await Promise.all([
        taskService.getTasks(),
        taskService.getStats(),
      ]);
      setTasks(tasksData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch data from Supabase:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = async (data: {
    title: string;
    category?: string;
    priority?: string;
    due_date?: string;
  }) => {
    try {
      await taskService.createTask(data);
      await fetchData();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const target = tasks.find((t) => t.id === id);
      if (target) {
        await taskService.toggleTask(id, target.is_completed);
        await fetchData();
      }
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await taskService.deleteTask(id);
      await fetchData();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleUpdateDescription = async (id: number, description: string) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, description } : t))
    );

    try {
      await taskService.updateTaskDescription(id, description);
    } catch (error) {
      console.error('Failed to update task description:', error);
    }
  };

  return (
    <div className="page-layout">
      <Navbar />

      <div className="app">
        {!isConfigured && (
        <div
          style={{
            background: '#FEF3C7',
            border: '1px solid #F59E0B',
            color: '#92400E',
            padding: '14px 20px',
            borderRadius: '16px',
            marginBottom: '20px',
            fontSize: '0.9rem',
            lineHeight: 1.5,
          }}
        >
          <strong>⚠️ Connect your Supabase project:</strong> Add your{' '}
          <code>NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code>{' '}
          and run the SQL script in <code>supabase-schema.sql</code> inside your
          Supabase SQL Editor.
        </div>
      )}

      {loading ? (
        <TaskLoader />
      ) : (
        <main className="main-content">
          <HeroSection stats={stats} onAdd={handleAdd} />
          <StatsCards stats={stats} />
          <TaskList
            tasks={tasks}
            filter={filter}
            onFilterChange={setFilter}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onUpdateDescription={handleUpdateDescription}
          />
        </main>
      )}

      <Footer />
      </div>
    </div>
  );
}
