import { useParams } from 'react-router-dom';
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
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const { trailer, allVideos } = useMovieTrailer(id);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE_URL}/movie/${id}?language=en-US`, API_OPTIONS);
        if (!response.ok) throw new Error('Failed to fetch movie details');
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!movie) return null;

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
        {/* Top Summary Row */}
        <div className="flex flex-col sm:flex-row items-start justify-between px-4 sm:px-8 pt-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-white">{movie.title}</h1>
            <div className="flex items-center text-[#D6C7FF] text-base sm:text-lg font-medium space-x-1 mb-2">
              <span>{new Date(movie.release_date).getFullYear()}</span>
              <span className="mx-2">•</span>
              <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
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