'use client';

import { useState, useEffect } from 'react';
import { LuSun, LuMoon } from 'react-icons/lu';

function Navbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [formattedDate, setFormattedDate] = useState<string>('Sunday, October 25');
  const [compactDate, setCompactDate] = useState<string>('Sun, Oct 25');

  useEffect(() => {
    // Read saved theme or fallback to system preference
    const saved = localStorage.getItem('taskmaster-theme') as 'light' | 'dark' | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    const today = new Date();
    setFormattedDate(
      today.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    );
    setCompactDate(
      today.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    );
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('taskmaster-theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <div className="navbar-logo-icon">
            {/* Custom Taskmaster Icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 7H14M4 12H11M4 17H8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 11.5L18.5 14L22 9.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="navbar-title">Taskmaster</span>
        </div>

        <div className="navbar-right-group">
          <button
            type="button"
            className="navbar-theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme mode"
          >
            {theme === 'dark' ? <LuSun size={15} /> : <LuMoon size={15} />}
            <span className="navbar-theme-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          <div className="navbar-date-pill">
            <LuSun size={15} className="navbar-date-icon" />
            <span className="navbar-date-full">{formattedDate}</span>
            <span className="navbar-date-compact">{compactDate}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
