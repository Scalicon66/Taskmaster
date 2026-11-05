'use client';

interface DonutChartProps {
  completed: number;
  total: number;
}

function DonutChart({ completed, total }: DonutChartProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const radius = 62;
  const strokeWidth = 13;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="donut-container">
      <svg width="165" height="165" viewBox="0 0 165 165">
        {/* Background track circle */}
        <circle
          cx="82.5"
          cy="82.5"
          r={radius}
          fill="none"
          className="donut-track"
          strokeWidth={strokeWidth}
        />
        {/* Active progress arc */}
        <circle
          cx="82.5"
          cy="82.5"
          r={radius}
          fill="none"
          className="donut-progress"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 82.5 82.5)"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="donut-label">
        <span className="donut-percentage">{percentage}%</span>
        <span className="donut-subtitle">{completed} of {total} done</span>
      </div>
    </div>
  );
}

export default DonutChart;
