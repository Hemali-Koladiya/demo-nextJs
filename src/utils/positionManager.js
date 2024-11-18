import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export const adjustPositions = async (newPosition, currentId = null) => {
  try {
    // Get all movies
    const querySnapshot = await getDocs(collection(db, 'movies'));
    let movies = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Sort by position
    movies.sort((a, b) => a.position - b.position);

    // If this is an edit and the movie already exists, remove it from consideration
    if (currentId) {
      movies = movies.filter(movie => movie.id !== currentId);
    }

    // Find movies that need to be shifted
    const affectedMovies = movies.filter(movie => movie.position >= newPosition);

    // Update positions of affected movies
    for (const movie of affectedMovies) {
      const movieRef = doc(db, 'movies', movie.id);
      await updateDoc(movieRef, {
        position: movie.position + 1
      });
    }

    return true;
  } catch (error) {
    console.error("Error adjusting positions:", error);
    throw error;
  }
};