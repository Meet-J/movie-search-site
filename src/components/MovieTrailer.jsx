import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

// Function to fetch movie videos (trailers, teasers, etc.)
export const fetchMovieVideos = async (movieId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/movie/${movieId}/videos?language=en-US`,
      API_OPTIONS
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching movie videos:', error);
    return [];
  }
};

// Function to filter and get the main trailer
export const getMainTrailer = (videos) => {
  // Priority order: Official Trailer > Trailer > Teaser > Clip
  const priorities = ['Trailer', 'Teaser', 'Clip', 'Featurette'];
  
  // First, try to find an official trailer
  const officialTrailer = videos.find(video => 
    video.type === 'Trailer' && 
    video.site === 'YouTube' && 
    video.official === true
  );
  
  if (officialTrailer) return officialTrailer;
  
  // If no official trailer, find the first trailer by priority
  for (const type of priorities) {
    const video = videos.find(v => 
      v.type === type && 
      v.site === 'YouTube'
    );
    if (video) return video;
  }
  
  // Return the first YouTube video if no specific type found
  return videos.find(video => video.site === 'YouTube') || null;
};

// React Hook for fetching and managing trailer data
export const useMovieTrailer = (movieId) => {
  const [trailer, setTrailer] = useState(null);
  const [allVideos, setAllVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) return;

    const fetchTrailer = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const videos = await fetchMovieVideos(movieId);
        setAllVideos(videos);
        
        const mainTrailer = getMainTrailer(videos);
        setTrailer(mainTrailer);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrailer();
  }, [movieId]);

  return { trailer, allVideos, loading, error };
};

// Component to display the trailer
export const TrailerPlayer = ({ movieId, autoplay = false }) => {
  const { trailer, loading, error } = useMovieTrailer(movieId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-900 rounded-lg">
        <div className="text-white">Loading trailer...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-900 rounded-lg">
        <div className="text-red-500">Error loading trailer: {error}</div>
      </div>
    );
  }

  if (!trailer) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-900 rounded-lg">
        <div className="text-gray-400">No trailer available</div>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${trailer.key}?${
    autoplay ? 'autoplay=1&' : ''
  }rel=0&showinfo=0&modestbranding=1`;

  return (
    <div className="relative w-full h-0 pb-[56.25%] bg-black rounded-lg overflow-hidden">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={embedUrl}
        title={trailer.name}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

// Modal component for trailer popup
export const TrailerModal = ({ isOpen, onClose, movieId, movieTitle }) => {
  const { trailer } = useMovieTrailer(movieId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="relative w-full max-w-4xl mx-4">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300 z-10"
        >
          ✕
        </button>
        
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-white text-xl font-semibold">
              {movieTitle} - Trailer
            </h3>
          </div>
          
          <div className="p-4">
            <TrailerPlayer movieId={movieId} autoplay={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Component to display all videos
export const VideoGallery = ({ videos }) => {
  if (!videos || videos.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.slice(0, 6).map((video) => (
        <div key={video.id} className="bg-gray-800 rounded-lg p-4">
          <h4 className="text-white font-medium mb-2 truncate">
            {video.name}
          </h4>
          <p className="text-gray-400 text-sm mb-2">{video.type}</p>
          <a
            href={`https://www.youtube.com/watch?v=${video.key}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Watch on YouTube →
          </a>
        </div>
      ))}
    </div>
  );
}; 