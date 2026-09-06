import React, { useEffect, useState, useRef } from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
  const [history, setHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Load search history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('recent_searches');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load search history', e);
    }
  }, []);

  // Save current query to history when valid
  useEffect(() => {
    const trimmed = searchTerm.trim();
    if (trimmed.length >= 2) {
      setHistory((prev) => {
        const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
        const updated = [trimmed, ...filtered].slice(0, 5);
        try {
          localStorage.setItem('recent_searches', JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
    }
  }, [searchTerm]);

  // Click outside listener to auto-close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const removeHistoryItem = (e, itemToRemove) => {
    e.stopPropagation();
    const updated = history.filter((item) => item !== itemToRemove);
    setHistory(updated);
    try {
      localStorage.setItem('recent_searches', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const clearAllHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('recent_searches');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="search relative w-full" ref={containerRef}>
      <div>
        <img src="search.svg" alt="search" />
        <input
          type="text"
          placeholder="Search through thousands of movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {/* History Dropdown */}
      {isOpen && history.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-[#0F0D23] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-30">
          <div className="flex items-center justify-between px-4 py-2 bg-[#1a1124] border-b border-white/5">
            <span className="text-xs font-semibold text-[#A8B5DB]">Recent Searches</span>
            <button
              onClick={clearAllHistory}
              className="text-xs text-[#AB8BFF] hover:underline cursor-pointer"
            >
              Clear All
            </button>
          </div>
          <ul>
            {history.map((item, idx) => (
              <li
                key={idx}
                onClick={() => {
                  setSearchTerm(item);
                  setIsOpen(false);
                }}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-[#2a1a3a] cursor-pointer transition border-b border-white/5 last:border-0 group"
              >
                <div className="flex items-center gap-3 text-sm text-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 text-[#A8B5DB]"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{item}</span>
                </div>
                <button
                  onClick={(e) => removeHistoryItem(e, item)}
                  className="text-gray-400 hover:text-red-400 text-xs px-1.5 py-0.5 rounded transition"
                  title="Remove from history"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;