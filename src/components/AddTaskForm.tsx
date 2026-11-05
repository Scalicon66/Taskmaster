'use client';

import { useState, useRef } from 'react';
import { LuPlus, LuCalendar, LuX } from 'react-icons/lu';

interface AddTaskFormProps {
  onAdd: (data: {
    title: string;
    category?: string;
    priority?: string;
    due_date?: string;
  }) => void;
}

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('T')[0].split('-').map(Number);
    if (parts.length < 3) return dateStr;
    const [year, month, day] = parts;
    const target = new Date(year, month - 1, day);
    target.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';

    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
    };
    if (target.getFullYear() !== today.getFullYear()) {
      options.year = 'numeric';
    }
    return target.toLocaleDateString('en-US', options);
  } catch {
    return dateStr;
  }
}

function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      category: category.trim() || undefined,
      priority,
      due_date: dueDate || undefined,
    });

    setTitle('');
    setCategory('');
    setPriority('medium');
    setDueDate('');
  };

  const handleOpenPicker = () => {
    if (dateInputRef.current) {
      try {
        dateInputRef.current.showPicker?.();
      } catch {
        dateInputRef.current.focus();
      }
    }
  };

  return (
    <form className="add-task-card" onSubmit={handleSubmit}>
      <div className="add-task-fields">
        <input
          type="text"
          placeholder="What needs doing?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="add-task-input add-task-input-title"
          required
        />
        <input
          type="text"
          placeholder="Category"
          list="category-options"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="add-task-input add-task-input-category"
        />
        <datalist id="category-options">
          <option value="Work" />
          <option value="Personal" />
          <option value="Home" />
          <option value="Health" />
        </datalist>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="add-task-select-pill"
          aria-label="Priority"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <div
          className={`add-task-date-pill-wrapper ${dueDate ? 'has-date' : ''}`}
          onClick={handleOpenPicker}
          title={dueDate ? 'Click to change due date' : 'Click to pick due date'}
        >
          <div className="add-task-date-pill-display">
            <LuCalendar size={15} className="add-task-date-icon" />
            <span className="add-task-date-text">
              {dueDate ? formatDisplayDate(dueDate) : 'Due date'}
            </span>
          </div>

          <input
            ref={dateInputRef}
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            onClick={(e) => {
              try {
                e.currentTarget.showPicker?.();
              } catch {}
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                try {
                  e.currentTarget.showPicker?.();
                } catch {}
              }
            }}
            className="add-task-hidden-date-input"
            aria-label="Due date picker"
          />

          {dueDate && (
            <button
              type="button"
              className="add-task-date-clear-btn"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setDueDate('');
              }}
              title="Clear date"
              aria-label="Clear date"
            >
              <LuX size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="add-task-action-row">
        <button type="submit" className="add-task-submit-btn">
          <LuPlus size={16} />
          <span>Add task</span>
        </button>
      </div>
    </form>
  );
}

export default AddTaskForm;
