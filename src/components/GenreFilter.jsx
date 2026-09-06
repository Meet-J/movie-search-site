import React, { useEffect, useState } from 'react';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

const GenreFilter = ({ selectedGenre, onSelectGenre }) => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/genre/movie/list?language=en-US`, API_OPTIONS);
        if (!response.ok) throw new Error('Failed to fetch genres');
        const data = await response.json();
        setGenres(data.genres || []);
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  if (loading) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 px-1 hide-scrollbar">
        <button
          onClick={() => onSelectGenre({ id: null, name: '' })}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
            selectedGenre.id === null
              ? 'text-black shadow-lg scale-105 font-bold'
              : 'bg-[#1a1124] text-[#A8B5DB] hover:bg-[#2a1a3a] hover:text-white border border-white/5'
          }`}
          style={
            selectedGenre.id === null
              ? { background: 'linear-gradient(90deg, #D6C7FF 0%, #AB8BFF 100%)' }
              : {}
          }
        >
          All Genres
        </button>
        {genres.map((genre) => {
          const isSelected = selectedGenre.id === genre.id;
          return (
            <button
              key={genre.id}
              onClick={() => onSelectGenre(genre)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'text-black shadow-lg scale-105 font-bold'
                  : 'bg-[#1a1124] text-[#A8B5DB] hover:bg-[#2a1a3a] hover:text-white border border-white/5'
              }`}
              style={
                isSelected
                  ? { background: 'linear-gradient(90deg, #D6C7FF 0%, #AB8BFF 100%)' }
                  : {}
              }
            >
              {genre.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GenreFilter;
