import { useEffect, useState } from 'react';
import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { Routes, Route, useNavigate } from 'react-router-dom';
import MovieDetails from './components/MovieDetails';
import Login from './components/Login';
import SignUp from './components/SignUp';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method:'GET',
  headers:{
    accept:'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

const App = ()=> {
  let index=1;
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [trendingMovies, setTrendingMovies]= useState([]);
  const [inTheaterMovies, setInTheaterMovies] = useState([]);
  const [inTheaterPage, setInTheaterPage] = useState(1);
  const [inTheaterTotalPages, setInTheaterTotalPages] = useState(1);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [upcomingTotalPages, setUpcomingTotalPages] = useState(1);

  const [IsLoading, setIsLoading] = useState(false);
  const [debounceSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useDebounce(()=>setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  useEffect(()=>{
    const fetchTrending = async()=>{
      setIsLoading(true);
      try{
        const response = await fetch(`${API_BASE_URL}/trending/movie/day?language=en-US&region=IN`, API_OPTIONS);
        if(!response.ok) throw new Error('Failed to fetch trending Movies');
        const data = await response.json();
        const tenResponses = (data.results || []).slice(0,10);
        setTrendingMovies(tenResponses);
      }catch(error){
        console.error(error);
      }finally{
        setIsLoading(false);
      }
    };
    fetchTrending();
  }, []);

  useEffect(()=>{
    const fetchInTheater = async()=>{
      setIsLoading(true);
      try{
        const response = await fetch(`${API_BASE_URL}/movie/now_playing?language=en-US&page=${inTheaterPage}&region=IN`, API_OPTIONS);
        if(!response.ok) throw new Error('Failed to fetch In Theater Movies');
        const data = await response.json();
        const eightResponses = (data.results || []).slice(0,8);
        setInTheaterMovies(eightResponses);
        setInTheaterTotalPages(data.total_pages || 1);
      }catch(error){
        console.error(error);
      }finally{
        setIsLoading(false);
      }
    };
    fetchInTheater();
  }, [inTheaterPage]);

  useEffect(()=>{
  const fetchUpcoming = async()=>{
    setIsLoading(true);
    try{
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`${API_BASE_URL}/discover/movie?primary_release_date.gte=${today}&page=${upcomingPage}&region=IN`, API_OPTIONS);
      if(!response.ok) throw new Error('Failed to fetch Upcoming Movies');
      const data = await response.json();
      const eightResponses = (data.results || []).slice(0,8);
      setUpcomingMovies(eightResponses);
      setUpcomingTotalPages(data.total_pages || 1);
    }catch(error){
      console.error(error);
    }finally{
      setIsLoading(false);
    }
  };
  fetchUpcoming();
}, [upcomingPage]);

  useEffect(()=>{

    if(!debounceSearchTerm){
      setSearchResults([]);
      return
    }

    const fetchSearch = async ()=>{
      setIsLoading(true);
      try {
        
        const response = await fetch(`${API_BASE_URL}/search/movie?query=${encodeURIComponent(debounceSearchTerm)}`,API_OPTIONS);
        if(!response.ok){
          throw new Error('Failed to search movies');
        }
        const data = await response.json();
        setSearchResults(data.results || []);
      } catch (error) {
        console.error(`Error fetching movies: ${error}`);  
      }finally{
        setIsLoading(false);
      }
  }

    fetchSearch();

  },[debounceSearchTerm]);

  return (
    <main>
      <div className='wrapper'>
        <Routes>
          <Route path="/" element={
            <>
              <header className="relative flex flex-col items-center">
                <div className="absolute right-0 top-0 flex gap-5" style={{ marginTop: '0px' }}>
                  {isLoggedIn ? (
                    <button
                      className="px-6 py-2 rounded-lg font-semibold text-black bg-white bg-opacity-80 hover:bg-opacity-100 transition transition-transform duration-200 hover:scale-105 hover:shadow-xl"
                      onClick={() => setIsLoggedIn(false)}
                    >
                      Logout
                    </button>
                  ) : (
                    <>
                      <button
                        className="px-6 py-2 rounded-lg font-semibold text-black bg-white bg-opacity-80 hover:bg-opacity-100 transition transition-transform duration-200 hover:scale-105 hover:shadow-xl"
                        onClick={() => navigate('/login')}
                      >
                        Login
                      </button>
                      <button
                        className="px-6 py-2 rounded-lg font-semibold text-black shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-xl"
                        style={{ background: 'linear-gradient(90deg, #D6C7FF 0%, #AB8BFF 100%)' }}
                        onClick={() => navigate('/signup')}
                      >
                        Sign Up
                      </button>
                    </>
                  )}
                </div>
                <img src="./hero-img.png" alt="Hero Banner" />
                <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy without the hassle</h1>
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              </header>

              {/* Search Results section */}
              {debounceSearchTerm && (
                <section className='all-movies'>
                  <h2 className='mt-[40px]'>Search Results for "{debounceSearchTerm}"</h2>
                  {IsLoading ? (
                    <Spinner />
                  ) : searchResults.length === 0 ? (
                    <p className='text-red-500'>Error loading movies</p>
                  ) : (
                    <ul>
                      {searchResults.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                      ))}
                    </ul>
                  )}
                </section>
              )}

              {/* Trending Movies section */}
              {!debounceSearchTerm && (<section className='trending'>
                <h2>Trending Movies</h2>
                {IsLoading ? (
                  <Spinner />
                ) : (
                  <>
                    <button 
                      className="nav-button left"
                      onClick={() => {
                        const container = document.querySelector('.trending ul');
                        container.scrollBy({ left: -300, behavior: 'smooth' });
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                    <ul>
                      {trendingMovies.map((movie)=>(
                        <li key={movie.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/movie/${movie.id}`)}>
                          <p>{index++}</p>
                          <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                          />
                        </li>
                      ))}
                    </ul>
                    <button 
                      className="nav-button right"
                      onClick={() => {
                        const container = document.querySelector('.trending ul');
                        container.scrollBy({ left: 300, behavior: 'smooth' });
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </>
                )}
              </section>) }

              {/* In Theater Movies section */}
              {!debounceSearchTerm && (
                <section className='all-movies'>
                  <h2 className='mt-[40px]'>In Theater Now</h2>
                  <>
                    {IsLoading ? (
                      <div className="flex justify-center py-8"><Spinner /></div>
                    ) : (
                      <>
                        <ul>
                          {inTheaterMovies.map(movie => (
                            <MovieCard key={movie.id} movie={movie} />
                          ))}
                        </ul>
                        {/* Pagination UI */}
                        <div className="flex items-center justify-center mt-6 gap-10">
                          <button
                            className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#1a1124] hover:bg-[#2a1a3a] transition disabled:opacity-40"
                            onClick={() => setInTheaterPage(p => Math.max(1, p - 1))}
                            disabled={inTheaterPage === 1}
                          >
                            <span style={{ color: '#b48cff', fontSize: 24 }}>&larr;</span>
                          </button>
                          <span className="text-gray-400 text-lg font-semibold">{inTheaterPage} / {inTheaterTotalPages}</span>
                          <button
                            className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#1a1124] hover:bg-[#2a1a3a] transition disabled:opacity-40"
                            onClick={() => setInTheaterPage(p => Math.min(inTheaterTotalPages, p + 1))}
                            disabled={inTheaterPage === inTheaterTotalPages}
                          >
                            <span style={{ color: '#b48cff', fontSize: 24 }}>&rarr;</span>
                          </button>
                        </div>
                      </>
                    )}
                  </>
                </section>
              )}

              {/* Upcoming Movies section */}
              {!debounceSearchTerm && (
                <section className='all-movies'>
                  <h2 className='mt-[40px]'>Upcoming Movies</h2>
                  <>
                    {IsLoading ? (
                      <div className="flex justify-center py-8"><Spinner /></div>
                    ) : (
                      <>
                        <ul>
                          {upcomingMovies.map(movie => (
                            <MovieCard key={movie.id} movie={movie} />
                          ))}
                        </ul>
                        {/* Pagination UI */}
                        <div className="flex items-center justify-center mt-6 gap-10">
                          <button
                            className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#1a1124] hover:bg-[#2a1a3a] transition disabled:opacity-40"
                            onClick={() => setUpcomingPage(p => Math.max(1, p - 1))}
                            disabled={upcomingPage === 1}
                          >
                            <span style={{ color: '#b48cff', fontSize: 24 }}>&larr;</span>
                          </button>
                          <span className="text-gray-400 text-lg font-semibold">{upcomingPage} / {upcomingTotalPages}</span>
                          <button
                            className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#1a1124] hover:bg-[#2a1a3a] transition disabled:opacity-40"
                            onClick={() => setUpcomingPage(p => Math.min(upcomingTotalPages, p + 1))}
                            disabled={upcomingPage === upcomingTotalPages}
                          >
                            <span style={{ color: '#b48cff', fontSize: 24 }}>&rarr;</span>
                          </button>
                        </div>
                      </>
                    )}
                  </>
                </section>
              )}
            </>
          } />
          
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </main>
  )
}
export default App