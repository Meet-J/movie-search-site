import React, { createContext, useContext, useState, useEffect } from 'react';

const WatchlistContext = createContext();
const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const BACKEND_URL = `${API_BASE}/api/watchlist`;

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);

  // Fetch user watchlist from MongoDB backend if logged in
  const fetchWatchlist = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setWatchlist([]);
      return;
    }

    try {
      const response = await fetch(BACKEND_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setWatchlist(data);
          localStorage.setItem('movie_watchlist', JSON.stringify(data));
        }
      } else {
        setWatchlist([]);
      }
    } catch (err) {
      console.error('Error fetching watchlist from backend:', err);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const toggleWatchlist = async (movie, navigate) => {
    const token = localStorage.getItem('auth_token');
    
    // REQUIRE LOGIN: If not logged in, prompt user and redirect to login page
    if (!token) {
      alert('Please log in to add movies to your Watchlist!');
      if (navigate) navigate('/login');
      return;
    }

    const exists = watchlist.some((m) => m.id === movie.id);
    const updated = exists
      ? watchlist.filter((m) => m.id !== movie.id)
      : [movie, ...watchlist];

    setWatchlist(updated);
    localStorage.setItem('movie_watchlist', JSON.stringify(updated));

    // Save to MongoDB backend for persistent storage
    try {
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(movie),
      });

      if (res.ok) {
        const serverWatchlist = await res.json();
        setWatchlist(serverWatchlist);
        localStorage.setItem('movie_watchlist', JSON.stringify(serverWatchlist));
      }
    } catch (err) {
      console.error('Failed to sync watchlist with MongoDB', err);
    }
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some((m) => m.id === movieId);
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        toggleWatchlist,
        isInWatchlist,
        fetchWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
