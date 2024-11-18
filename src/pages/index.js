import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from '../Components/Navbar';
import MovieCard from '../Components/MovieCard';

export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const querySnapshot = await getDocs(collection(db, 'movies'));
      const movieList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort by position
      movieList.sort((a, b) => a.position - b.position);
      setMovies(movieList);
    };
    fetchMovies();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto xl:px-12 lg:px-6 px-5 py-8 pt-12 bg-[#171717] overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}