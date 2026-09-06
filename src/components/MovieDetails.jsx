import { useParams, useNavigate } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';

import { useEffect, useState } from 'react';
import { TrailerPlayer, TrailerModal, VideoGallery, useMovieTrailer } from './MovieTrailer';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

const style = `
.movie-details-wrapper {
  position: relative;
  min-height: 130vh;
  width: 100%;
  background: #0F0D23;
  box-shadow: 0px 12px 32px 0px #CECEFB05 inset;
  box-shadow: 0px 0px 100px 0px #AB8BFF4D;
}
.movie-details-wrapper > .absolute {
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
}
.movie-info {
  font-family: 'DM Sans', sans-serif;
  font-weight: 400;
}

@media (max-width: 768px) {
  .movie-details-wrapper {
    min-height: 100vh;
  }
}
`;

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const { trailer, allVideos } = useMovieTrailer(id);

  useEffect(() => {
    const fetchMovieAndCredits = async () => {
      setLoading(true);
      setError('');
      try {
        const [movieRes, creditsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/movie/${id}?language=en-US`, API_OPTIONS),
          fetch(`${API_BASE_URL}/movie/${id}/credits?language=en-US`, API_OPTIONS),
        ]);

        if (!movieRes.ok) throw new Error('Failed to fetch movie details');
        const movieData = await movieRes.json();
        setMovie(movieData);

        if (creditsRes.ok) {
          const creditsData = await creditsRes.json();
          setCredits(creditsData);
        }
      } catch (err) {
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };
    fetchMovieAndCredits();
  }, [id]);

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!movie) return null;

  const saved = isInWatchlist(movie.id);

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <style>{style}</style>
      <div className="relative movie-details-wrapper rounded-2xl">
        {/* Back button */}
        <div className="px-4 sm:px-8 pt-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-sm font-semibold text-[#D6C7FF] hover:text-white transition cursor-pointer"
          >
            &larr; Back to Home
          </button>
        </div>

        {/* Top Summary Row */}
        <div className="flex flex-col sm:flex-row items-start justify-between px-4 sm:px-8 pt-4 gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-white">{movie.title}</h1>
            <div className="flex items-center text-[#D6C7FF] text-base sm:text-lg font-medium space-x-1 mb-2">
              <span>{new Date(movie.release_date).getFullYear()}</span>
              <span className="mx-2">•</span>
              <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Watchlist Toggle Button */}
            <button
              onClick={() => toggleWatchlist(movie)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer shadow-md ${
                saved
                  ? 'bg-[#AB8BFF] text-black hover:bg-[#bfa3ff]'
                  : 'bg-[#23132b] text-[#D6C7FF] hover:bg-[#321c3d] hover:text-white'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={saved ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={saved ? '0' : '2'}
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
              <span>{saved ? 'In Watchlist' : 'Add to Watchlist'}</span>
            </button>

            {/* Rating Pill */}
            <div className="flex items-center bg-[#23132b] px-3 sm:px-4 py-2 rounded-xl shadow gap-2">
              <img src="/Star.svg" alt="Star" className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-bold text-base sm:text-lg text-[#FFD700]">{movie.vote_average?.toFixed(1)}</span>
              <span className="text-[#D6C7FF] text-xs sm:text-sm">/10</span>
              <span className="text-[#D6C7FF] text-xs sm:text-sm">({movie.vote_count ? (movie.vote_count/1000).toFixed(0) + 'K' : 0})</span>
            </div>
          </div>
        </div>

        {/* Poster and Trailer Section */}
        <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-7 bg-[#0F0D23] rounded-2xl p-4 sm:p-8 shadow-xl mt-6">
          {/* Poster */}
          <div className="flex-shrink-0 flex justify-center items-center w-full sm:w-[300px] h-[300px] sm:h-[441px] bg-[#23132b] rounded-2xl overflow-hidden shadow-lg">
            <img
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '/no-movie.png'}
              alt={movie.title}
              className="rounded-2xl w-full h-full object-cover"
            />
          </div>
          {/* Trailer */}
          <div className="flex-1 flex justify-center items-center w-full min-h-[220px]">
            {trailer ? (
              <div className="w-full lg:w-[750px] h-[220px] sm:h-[441px] bg-black rounded-2xl overflow-hidden flex items-center justify-center shadow-lg">
                <TrailerPlayer movieId={id} />
              </div>
            ) : (
              <div className="w-full lg:w-[772px] h-[220px] sm:h-[441px] flex items-center justify-center bg-gray-900 rounded-2xl">
                <div className="text-gray-400">No trailer available</div>
              </div>
            )}
          </div>
        </div>

        {/* Details section below */}
        <div className="bg-[#0F0D23] rounded-2xl p-4 sm:p-5">
          {/* Release Date Section */}
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 text-[#A8B5DB]">
              {movie.release_date ? (
                (() => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const releaseDate = new Date(movie.release_date);
                  releaseDate.setHours(0, 0, 0, 0);
                  return releaseDate <= today ? 'Released' : 'Release Date'; // this id if movie is released or not logic
                })()
              ) : 'Release Date'}
            </h2>
            <p className="text-[#D6C7FF] text-sm sm:text-base">
              {new Date(movie.release_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2 text-[#A8B5DB]">Overview</h2>
              <p className="text-[#FFFFFF] text-sm sm:text-base">{movie.overview}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-2 sm:gap-0">
              <h2 className="text-lg sm:text-xl font-semibold text-[#A8B5DB] min-w-[100px]">Genres</h2>
              <div className="flex flex-wrap gap-2 sm:gap-4 sm:ml-4">
                {movie.genres?.map((genre) => (
                  <span key={genre.id} className="bg-[#22123A] px-4 sm:px-6 py-2 rounded-xl text-sm sm:text-base font-bold text-white text-center">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-2 text-[#A8B5DB]">Budget</h2>
                <p className="text-[#D6C7FF] text-sm sm:text-base">{formatCurrency(movie.budget)}</p>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-2 text-[#A8B5DB]">Revenue</h2>
                <p className="text-[#D6C7FF] text-sm sm:text-base">{formatCurrency(movie.revenue)}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2 text-[#A8B5DB]">Production Companies</h2>
              <div className="flex flex-wrap gap-2">
                {movie.production_companies?.map((company) => (
                  <span key={company.id} className="bg-light-100/10 px-2 py-1 rounded text-xs font-medium text-[#D6C7FF]">
                    {company.name}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2 text-[#A8B5DB]">Production Countries</h2>
              <div className="flex flex-wrap gap-2">
                {movie.production_countries?.map((country) => (
                  <span key={country.iso_3166_1} className="bg-light-100/10 px-2 py-1 rounded text-xs font-medium text-[#D6C7FF]">
                    {country.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Top Cast Section */}
            {credits?.cast && credits.cast.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-[#A8B5DB]">Top Cast</h2>
                <div className="flex flex-row overflow-x-auto gap-4 pb-4 hide-scrollbar">
                  {credits.cast.slice(0, 16).map((actor) => (
                    <div key={actor.id} className="min-w-[120px] max-w-[130px] flex flex-col items-center text-center bg-[#1a1124] p-3 rounded-xl border border-white/5 hover:border-[#AB8BFF]/40 transition duration-200">
                      <div className="w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] rounded-full overflow-hidden mb-2.5 bg-[#23132b] flex items-center justify-center border-2 border-[#AB8BFF]/30 shadow-md">
                        {actor.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                            alt={actor.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[#D6C7FF] text-xl font-bold">
                            {actor.name ? actor.name.charAt(0) : '?'}
                          </span>
                        )}
                      </div>
                      <p className="text-white text-xs font-bold line-clamp-1 w-full">{actor.name}</p>
                      <p className="text-[#A8B5DB] text-[11px] line-clamp-1 w-full mt-0.5">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Crew Section */}
            {credits?.crew && credits.crew.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-[#A8B5DB]">Featured Crew</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(
                    credits.crew.reduce((acc, person) => {
                      if (['Director', 'Screenplay', 'Writer', 'Producer', 'Executive Producer'].includes(person.job)) {
                        if (!acc[person.id]) {
                          acc[person.id] = { name: person.name, jobs: [person.job] };
                        } else if (!acc[person.id].jobs.includes(person.job)) {
                          acc[person.id].jobs.push(person.job);
                        }
                      }
                      return acc;
                    }, {})
                  ).slice(0, 8).map(([id, crewPerson]) => (
                    <div key={id} className="bg-[#1a1124] p-3.5 rounded-xl border border-white/5 hover:border-[#AB8BFF]/30 transition duration-200">
                      <p className="text-white font-bold text-sm">{crewPerson.name}</p>
                      <p className="text-[#D6C7FF] text-xs mt-0.5">{crewPerson.jobs.join(', ')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trailer Modal for fullscreen */}
      <TrailerModal
        isOpen={showTrailerModal}
        onClose={() => setShowTrailerModal(false)}
        movieId={id}
        movieTitle={movie.title}
      />
    </>
  );
};

export default MovieDetails; 