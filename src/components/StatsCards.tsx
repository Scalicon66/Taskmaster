'use client';

import { LuListTodo, LuCircleCheck, LuClock, LuClockAlert } from 'react-icons/lu';
import type { Stats } from '../types';

interface StatsCardsProps {
  stats: Stats;
}

function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'Total tasks',
      value: stats.total,
      icon: <LuListTodo size={19} strokeWidth={2.2} />,
      variantClass: 'stat-variant-total',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: <LuCircleCheck size={19} strokeWidth={2.2} />,
      variantClass: 'stat-variant-completed',
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: <LuClock size={19} strokeWidth={2.2} />,
      variantClass: 'stat-variant-pending',
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      icon: <LuClockAlert size={19} strokeWidth={2.2} />,
      variantClass: 'stat-variant-overdue',
    },
  ];

  return (
    <div className="stats-cards-row">
      {cards.map((card) => (
        <div key={card.label} className={`stats-card-item ${card.variantClass}`}>
          <div className="stats-card-header">
            <span className="stats-card-label">{card.label}</span>
            <div className="stats-card-icon-pill" aria-hidden="true">{card.icon}</div>
          </div>
          <span className="stats-card-number">{card.value}</span>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
