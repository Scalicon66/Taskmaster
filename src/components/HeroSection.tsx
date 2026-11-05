'use client';

import { useState, useEffect } from 'react';
import type { Stats } from '../types';
import AddTaskForm from './AddTaskForm';
import DonutChart from './DonutChart';

interface HeroSectionProps {
  stats: Stats;
  onAdd: (data: {
    title: string;
    category?: string;
    priority?: string;
    due_date?: string;
  }) => void;
}

function HeroSection({ stats, onAdd }: HeroSectionProps) {
  const [greeting, setGreeting] = useState<string>('GOOD EVENING');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting('GOOD MORNING');
    else if (hour >= 12 && hour < 17) setGreeting('GOOD AFTERNOON');
    else setGreeting('GOOD EVENING');
  }, []);

  return (
    <section className="hero-card">
      <div className="hero-layout">
        <div className="hero-left">
          <span className="hero-greeting">{greeting}</span>
          <h1 className="hero-heading">
            {stats.pending} task{stats.pending !== 1 ? 's' : ''} on your plate, {stats.due_today}
            <span className="due-line">due today.</span>
          </h1>
          <AddTaskForm onAdd={onAdd} />
        </div>

        <div className="hero-right">
          <div className="hero-donut-card">
            <DonutChart completed={stats.completed} total={stats.total} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
