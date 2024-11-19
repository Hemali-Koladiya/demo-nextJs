import { useState, useEffect, useRef } from "react";
import {
  collection,
  getDocs,
  query,
  limit,
  startAfter,
  where,
  orderBy
} from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../Components/Navbar";
import MovieCard from "../Components/MovieCard";
import { Oval } from "react-loader-spinner";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const scrollContainerRef = useRef(null);

  // Function to fetch movies with infinite scroll
  const fetchMovies = async (searchTerm = "") => {
    setLoading(true);
    let movieQuery;
  
    if (searchTerm) {
      // Normalize the search term
      const normalizedSearchTerm = searchTerm.toLowerCase();
  
      // Order by title to fetch and filter client-side
      movieQuery = query(
        collection(db, "movies"),
        orderBy("title"),
      );
  
      const querySnapshot = await getDocs(movieQuery);
  
      // Filter client-side based on the normalized search term
      const movieList = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((movie) =>
          movie.title.toLowerCase().includes(normalizedSearchTerm)
        );
  
      setMovies(movieList); // Update movies with filtered results
      setLastVisible(null); // Reset pagination as this is filtered data
      setHasMore(movieList.length > 0);
    } else {
      // For normal pagination when no search term is provided
      movieQuery = query(
        collection(db, "movies"),
        orderBy("created_date", "desc"),
        limit(13)
      );
  
      // If there is a lastVisible document, add startAfter for pagination
      if (lastVisible) {
        movieQuery = query(
          collection(db, "movies"),
          orderBy("created_date", "desc"),
          startAfter(lastVisible),
          limit(13)
        );
      }
  
      const querySnapshot = await getDocs(movieQuery);
  
      const movieList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      setMovies((prevMovies) => {
        const newMovies = [...prevMovies, ...movieList];
        const uniqueMovies = [
          ...new Map(newMovies.map((movie) => [movie.id, movie])).values(),
        ]; // Remove duplicates based on movie.id
        return uniqueMovies;
      });
  
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length > 0);
    }
  
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies(); // Fetch movies on initial load
  }, []);

  // Handle scroll event for infinite scrolling
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const bottom =
      scrollContainerRef.current.scrollHeight ===
      scrollContainerRef.current.scrollTop +
        scrollContainerRef.current.clientHeight;
    if (bottom && !loading && hasMore) {
      fetchMovies(searchTerm); // Fetch more movies based on the current search term
    }
  };

  // Handle search term change
  const handleSearch = (value) => {
    setSearchTerm(value);
    setMovies([]); // Clear current movies list on new search
    setLastVisible(null); // Reset pagination on new search
    fetchMovies(value); // Fetch movies based on the search term
    setHasMore(true);
  };

  return (
    <div>
      <Navbar onSearch={handleSearch} />
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="container mx-auto xl:px-12 lg:px-6 px-5 py-8 pt-12 bg-[#171717] overflow-y-auto"
        style={{ height: "80vh", overflowY: "auto" }}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Show skeleton loader while fetching */}
        {/* {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {[1, 2, 3, 4, 5, 6].map((value) => (
              <div key={value} className="w-full bg-white rounded-lg p-4">
                <div className="animate-pulse">
                  <div className="bg-gray-200 h-56 rounded-lg mb-4"></div>

                  <div className="h-6 bg-gray-200 rounded mb-2"></div>

                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>

                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                </div>
              </div>
            ))}
          </div>
        )} */}

        {loading && (
          <div className="flex justify-center">
            <Oval
              height={50}
              width={50}
              color="#ffffff"
              visible={true}
              ariaLabel="loading"
              secondaryColor="#4b5563"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          </div>
        )}

        {/* Show message when no more data */}
        {!hasMore && <p className="text-white text-center">No more movies</p>}
      </div>
    </div>
  );
}
