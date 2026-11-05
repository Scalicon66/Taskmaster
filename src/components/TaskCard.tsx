'use client';

import { useState, useRef, useEffect } from 'react';
import { LuCalendar, LuTrash2, LuCheck, LuAlignLeft, LuPlus } from 'react-icons/lu';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdateDescription: (id: number, description: string) => void;
}

function formatDueDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const parts = dateStr.split('T')[0].split('-').map(Number);
  if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
    const fallback = new Date(dateStr);
    return isNaN(fallback.getTime()) ? '' : fallback.toLocaleDateString();
  }
  const [year, month, day] = parts;
  const taskDate = new Date(year, month - 1, day);
  taskDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const formatted = taskDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  if (diffDays === 0) {
    return `Due today · ${formatted}`;
  }
  if (diffDays === 1) {
    return `Due tomorrow · ${formatted}`;
  }
  if (diffDays === -1) {
    return `Yesterday · ${formatted}`;
  }
  return formatted;
}

function getPriorityDotColor(priority: string): string {
  switch (priority?.toLowerCase()) {
    case 'high':
      return '#B55345';
    case 'medium':
      return '#966A33';
    case 'low':
      return '#466D43';
    default:
      return '#966A33';
  }
}

function TaskCard({ task, onToggle, onDelete, onUpdateDescription }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftDesc, setDraftDesc] = useState(task.description || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setDraftDesc(task.description || '');
    }
  }, [task.description, isEditing]);

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus();
      const len = textareaRef.current?.value.length || 0;
      textareaRef.current?.setSelectionRange(len, len);
    }
  }, [isEditing]);

  const priorityCapitalized =
    task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Medium';

  const handleSave = (e?: React.MouseEvent | React.FormEvent) => {
    e?.stopPropagation();
    onUpdateDescription(task.id, draftDesc);
    setIsEditing(false);
  };

  const handleCancel = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDraftDesc(task.description || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  return (
    <div
      className={`task-item-card ${task.is_completed ? 'is-done' : ''} ${isEditing ? 'is-editing' : ''}`}
      onClick={() => {
        if (!isEditing) setIsEditing(true);
      }}
      title={!isEditing ? 'Click task to view or edit description' : undefined}
    >
      <div className="task-item-top">
        <button
          type="button"
          className={`task-checkbox-btn ${task.is_completed ? 'checked' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(task.id);
          }}
          aria-label={task.is_completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.is_completed && <LuCheck size={14} color="#FFFFFF" strokeWidth={3} />}
        </button>

        <div className="task-item-tags">
          {task.category && (
            <span className="task-category-chip">{task.category}</span>
          )}
          <span className="task-priority-indicator">
            <span
              className="priority-color-dot"
              style={{ backgroundColor: getPriorityDotColor(task.priority) }}
            />
            {priorityCapitalized}
          </span>
        </div>

        <button
          type="button"
          className="task-delete-action"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          aria-label="Delete task"
        >
          <LuTrash2 size={16} />
        </button>
      </div>

      <h3 className="task-item-title">{task.title}</h3>

      {isEditing ? (
        <div
          className="task-desc-editor"
          onClick={(e) => e.stopPropagation()}
        >
          <textarea
            ref={textareaRef}
            value={draftDesc}
            onChange={(e) => setDraftDesc(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add details, notes, or instructions..."
            rows={3}
            className="task-desc-textarea"
          />
          <div className="task-desc-actions">
            <span className="task-desc-hint">Ctrl+Enter to save</span>
            <div className="task-desc-btn-group">
              <button
                type="button"
                className="task-desc-btn task-desc-btn-cancel"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="task-desc-btn task-desc-btn-save"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : task.description ? (
        <div
          className="task-item-desc"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
        >
          <LuAlignLeft size={13} className="task-desc-icon" />
          <p className="task-desc-text">{task.description}</p>
        </div>
      ) : (
        <div
          className="task-item-desc-placeholder"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
        >
          <LuPlus size={12} />
          <span>Add description...</span>
        </div>
      )}

      {task.due_date && (
        <div className="task-item-due">
          <LuCalendar size={14} />
          <span>{formatDueDate(task.due_date)}</span>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
