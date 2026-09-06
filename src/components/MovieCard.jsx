import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const { title, vote_average, poster_path, release_date, original_language, id } = movie;
  const saved = isInWatchlist(id);

  const handleBookmark = (e) => {
    e.stopPropagation();
    toggleWatchlist(movie);
  };

  return (
    <div className='movie-card relative group' style={{ cursor: 'pointer' }} onClick={() => navigate(`/movie/${id}`)}>
      <div className="relative">
        <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}`: '/no-movie.png'} alt={title} />
        <button
          onClick={handleBookmark}
          title={saved ? 'Remove from Watchlist' : 'Add to Watchlist'}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
            saved
              ? 'bg-[#AB8BFF] text-black shadow-lg scale-110'
              : 'bg-black/60 text-white hover:bg-black/80 hover:scale-110'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={saved ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={saved ? '0' : '2'}
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
          </svg>
        </button>
      </div>
      <div className="mt-4">
        <h3>{title}</h3>
        <div className='content'>
          <div className="rating">
            <img src="/Star.svg" alt="Star Icon" />
            <p>{vote_average ? vote_average.toFixed(1): 'N/A'}</p>
          </div>
          <span>•</span>
          <p className='lang'>{original_language}</p>
          <span>•</span>
          <p className="year">
            {release_date ? release_date.split('-')[0] : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MovieCard    