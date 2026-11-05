'use client';

import type { Task, FilterType } from '../types';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdateDescription: (id: number, description: string) => void;
}

function TaskList({
  tasks,
  filter,
  onFilterChange,
  onToggle,
  onDelete,
  onUpdateDescription,
}: TaskListProps) {
  const filters: FilterType[] = ['all', 'pending', 'completed'];

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.is_completed;
    if (filter === 'pending') return !task.is_completed;
    return true;
  });

  return (
    <section className="tasks-section">
      <div className="tasks-section-header">
        <div className="tasks-section-title-wrap">
          <h2 className="tasks-section-title">Your tasks</h2>
          <span className="tasks-section-counter">{filteredTasks.length}</span>
        </div>

        <div className="tasks-filter-pills">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              className={`tasks-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => onFilterChange(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="tasks-empty-state">
          <p>No {filter !== 'all' ? filter : ''} tasks found.</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdateDescription={onUpdateDescription}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default TaskList;
