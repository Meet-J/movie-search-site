import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

const MovieSearchInput = ({ placeholder, onSelectMovie, initialMovie }) => {
  const [query, setQuery] = useState(initialMovie ? initialMovie.title : '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (initialMovie) setQuery(initialMovie.title);
  }, [initialMovie]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1`,
          API_OPTIONS
        );
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.results ? data.results.slice(0, 5) : []);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-[#1a1124] text-white placeholder-gray-400 rounded-xl border border-white/10 focus:border-[#AB8BFF] outline-none transition"
      />
      {loading && (
        <div className="absolute right-3 top-3 text-xs text-[#AB8BFF] animate-pulse">
          Searching...
        </div>
      )}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-20 w-full mt-2 bg-[#1a1124] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          {suggestions.map((movie) => (
            <div
              key={movie.id}
              onClick={() => {
                onSelectMovie(movie.id);
                setQuery(movie.title);
                setShowDropdown(false);
              }}
              className="flex items-center gap-3 p-3 hover:bg-[#2a1a3a] cursor-pointer transition border-b border-white/5 last:border-0"
            >
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : '/no-movie.png'}
                alt={movie.title}
                className="w-10 h-14 object-cover rounded"
              />
              <div>
                <p className="text-white font-bold text-sm">{movie.title}</p>
                <p className="text-gray-400 text-xs">
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'} • ⭐ {movie.vote_average?.toFixed(1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MovieCompare = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const movie1IdParam = searchParams.get('movie1');
  const movie2IdParam = searchParams.get('movie2');

  const [movie1, setMovie1] = useState(null);
  const [movie2, setMovie2] = useState(null);

  const fetchMovieDetails = async (id, setMovieState) => {
    try {
      const response = await fetch(`${API_BASE_URL}/movie/${id}?language=en-US`, API_OPTIONS);
      if (response.ok) {
        const data = await response.json();
        setMovieState(data);
      }
    } catch (err) {
      console.error('Error fetching movie details:', err);
    }
  };

  useEffect(() => {
    if (movie1IdParam) fetchMovieDetails(movie1IdParam, setMovie1);
    if (movie2IdParam) fetchMovieDetails(movie2IdParam, setMovie2);
  }, [movie1IdParam, movie2IdParam]);

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 text-white font-sans">
      {/* Header Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-sm font-semibold text-[#D6C7FF] hover:text-white transition cursor-pointer"
        >
          &larr; Back to Home
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gradient">Movie Comparison Tool</h1>
      </div>

      {/* Dual Search Input Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0F0D23] p-6 rounded-2xl border border-white/10 shadow-xl mb-8">
        <div>
          <label className="block text-sm font-semibold text-[#D6C7FF] mb-2">Movie 1</label>
          <MovieSearchInput
            placeholder="Type to search Movie 1 (e.g. Inception)..."
            initialMovie={movie1}
            onSelectMovie={(id) => fetchMovieDetails(id, setMovie1)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#D6C7FF] mb-2">Movie 2</label>
          <MovieSearchInput
            placeholder="Type to search Movie 2 (e.g. Interstellar)..."
            initialMovie={movie2}
            onSelectMovie={(id) => fetchMovieDetails(id, setMovie2)}
          />
        </div>
      </div>

      {/* Comparison Display */}
      {movie1 || movie2 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[movie1, movie2].map((movie, idx) => (
            <div key={idx} className="bg-[#0F0D23] p-6 rounded-2xl border border-white/10 shadow-xl flex flex-col justify-between">
              {movie ? (
                <div>
                  {/* Poster & Title */}
                  <div className="flex flex-col items-center text-center mb-6">
                    <img
                      src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/no-movie.png'}
                      alt={movie.title}
                      className="w-48 h-72 object-cover rounded-xl shadow-lg border border-white/10 mb-4"
                    />
                    <h2 className="text-2xl font-bold text-white">{movie.title}</h2>
                    <p className="text-[#D6C7FF] text-sm mt-1">
                      {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'} • {movie.tagline ? `"${movie.tagline}"` : ''}
                    </p>
                  </div>

                  {/* Comparison Stats Table */}
                  <div className="space-y-4 text-sm border-t border-white/10 pt-4">
                    {/* Rating */}
                    <div className="flex justify-between items-center bg-[#1a1124] p-3 rounded-lg">
                      <span className="text-[#A8B5DB]">TMDB Rating</span>
                      <span className="font-extrabold text-[#FFD700] text-base">
                        ⭐ {movie.vote_average?.toFixed(1)} <span className="text-xs text-gray-400">({movie.vote_count} votes)</span>
                      </span>
                    </div>

                    {/* Runtime */}
                    <div className="flex justify-between items-center bg-[#1a1124] p-3 rounded-lg">
                      <span className="text-[#A8B5DB]">Runtime</span>
                      <span className="font-semibold text-white">
                        {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                      </span>
                    </div>

                    {/* Budget */}
                    <div className="flex justify-between items-center bg-[#1a1124] p-3 rounded-lg">
                      <span className="text-[#A8B5DB]">Budget</span>
                      <span className="font-semibold text-white">{formatCurrency(movie.budget)}</span>
                    </div>

                    {/* Revenue */}
                    <div className="flex justify-between items-center bg-[#1a1124] p-3 rounded-lg">
                      <span className="text-[#A8B5DB]">Box Office Revenue</span>
                      <span className="font-semibold text-green-400">{formatCurrency(movie.revenue)}</span>
                    </div>

                    {/* Genres */}
                    <div className="bg-[#1a1124] p-3 rounded-lg">
                      <span className="block text-[#A8B5DB] mb-2">Genres</span>
                      <div className="flex flex-wrap gap-1.5">
                        {movie.genres?.map((g) => (
                          <span key={g.id} className="bg-[#AB8BFF]/20 text-[#D6C7FF] text-xs px-2.5 py-1 rounded-full font-medium">
                            {g.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Overview */}
                    <div className="bg-[#1a1124] p-3 rounded-lg">
                      <span className="block text-[#A8B5DB] mb-1">Overview</span>
                      <p className="text-xs text-gray-300 leading-relaxed line-clamp-4">{movie.overview}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-96 flex flex-col items-center justify-center text-center p-6 text-gray-400 border-2 border-dashed border-white/10 rounded-xl">
                  <span className="text-4xl mb-2">🔍</span>
                  <p>Search and select Movie {idx + 1} above to compare metrics.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#0F0D23] rounded-2xl border border-white/10 p-8">
          <span className="text-5xl mb-4 block">⚔️</span>
          <h3 className="text-xl font-bold text-white mb-2">Select Two Movies to Compare</h3>
          <p className="text-gray-400 max-w-md mx-auto text-sm">
            Search for movies in both inputs above to view a detailed side-by-side comparison of box office revenues, ratings, runtimes, and genres.
          </p>
        </div>
      )}
    </div>
  );
};

export default MovieCompare;
