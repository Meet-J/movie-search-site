import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import MovieCard from './MovieCard';

const Watchlist = () => {
  const { watchlist } = useWatchlist();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-sm font-semibold text-[#D6C7FF] hover:text-white transition mb-3 cursor-pointer"
          >
            &larr; Back to Home
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-white text-left">
            My <span className="text-gradient">Watchlist</span> ({watchlist.length})
          </h1>
        </div>
      </div>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#0F0D23] rounded-2xl p-8 text-center mt-6 shadow-xl">
          <div className="w-20 h-20 bg-[#23132b] rounded-full flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#D6C7FF"
              className="w-10 h-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Your watchlist is empty</h2>
          <p className="text-[#A8B5DB] max-w-md mb-6">
            Explore movies and click the bookmark icon on any movie card or details page to add them to your saved collection.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-xl font-semibold text-black shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-xl cursor-pointer"
            style={{ background: 'linear-gradient(90deg, #D6C7FF 0%, #AB8BFF 100%)' }}
          >
            Explore Movies
          </button>
        </div>
      ) : (
        <div className="all-movies">
          <ul>
            {watchlist.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
