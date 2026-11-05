'use client';

function TaskLoader() {
  return (
    <div className="coffee-loader-wrapper">
      <div className="coffee-loader-art">
        <svg
          viewBox="0 0 120 120"
          className="coffee-loader-svg"
          width="110"
          height="110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="coffee-liquid-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C99A6E" />
              <stop offset="30%" stopColor="#7B4E32" />
              <stop offset="100%" stopColor="#3A2214" />
            </linearGradient>

            <linearGradient id="mug-body-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#EDE5D8" />
            </linearGradient>

            <clipPath id="mug-interior-clip">
              <path d="M36 41 H84 C84 75 79 83 60 83 C41 83 36 75 36 41 Z" />
            </clipPath>
          </defs>

          {/* Saucer */}
          <ellipse cx="60" cy="95" rx="46" ry="6" className="coffee-saucer" />

          {/* Mug Handle */}
          <path
            d="M83 47 C96 47 101 56 101 64 C101 72 95 78 83 78"
            className="coffee-handle"
            strokeWidth="6.5"
            strokeLinecap="round"
          />

          {/* Mug Outer Body */}
          <path
            d="M33 39 H87 C87 78 81 87 60 87 C39 87 33 78 33 39 Z"
            className="coffee-mug-body"
          />

          {/* Liquid inside the mug (clipped) */}
          <g clipPath="url(#mug-interior-clip)">
            {/* Deep coffee base */}
            <rect x="30" y="44" width="60" height="46" fill="url(#coffee-liquid-grad)" />

            {/* Oscillating wave */}
            <path
              className="coffee-wave"
              d="M10 45 Q 25 41, 40 45 T 70 45 T 100 45 T 130 45 V 90 H 10 Z"
              fill="url(#coffee-liquid-grad)"
            />

            {/* Crema foam top */}
            <ellipse cx="60" cy="45" rx="22" ry="3.5" className="coffee-foam" />
          </g>

          {/* Mug Rim highlight */}
          <ellipse cx="60" cy="39" rx="27" ry="4.5" className="coffee-rim" strokeWidth="1.8" />

          {/* Verified Task Emblem on Mug */}
          <g className="coffee-emblem">
            <circle cx="60" cy="67" r="9.5" className="coffee-emblem-bg" />
            <path
              d="M56 67 L59 70 L64.5 64"
              fill="none"
              className="coffee-emblem-check"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Rising Steam Ribbons */}
          <g className="coffee-steam-group">
            <path
              className="coffee-steam steam-1"
              d="M49 32 C45 23 53 15 49 7 C45 0 51 -6 47 -14"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              className="coffee-steam steam-2"
              d="M60 30 C65 21 57 13 62 5 C66 -1 59 -8 63 -16"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              className="coffee-steam steam-3"
              d="M71 32 C75 23 67 15 72 7 C76 0 70 -6 74 -14"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>

      <div className="coffee-loader-text-wrap">
        <h3 className="coffee-loader-title">Taskmaster</h3>
        <p className="coffee-loader-subtitle">Brewing your workspace...</p>
      </div>

      <div className="coffee-progress-track">
        <div className="coffee-progress-bar" />
      </div>
    </div>
  );
}

export default TaskLoader;
