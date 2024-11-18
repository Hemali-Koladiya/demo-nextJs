import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import Link from "next/link";
import Navbar from "../../Components/Navbar";
import { useRouter } from "next/router";
import AdminLayout from "./AdminLayout";

export default function AdminDashboard() {
  const [movies, setMovies] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "movies"));
        const movieList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        movieList.sort((a, b) => a.position - b.position);
        setMovies(movieList);
      } catch (error) {
        console.error("Error fetching movies:", error);
        alert("Error fetching movies");
      }
    };
    fetchMovies();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "movies", id));
      setMovies(movies.filter((movie) => movie.id !== id));
    } catch (error) {
      console.error("Error deleting movie:", error);
      alert("Error deleting movie");
    }
  };

  const handleEdit = (movie) => {
    router.push(`/admin/edit/${movie.id}`);
  };

  return (
    <AdminLayout>
      <div>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <Link
              href="/admin/add"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left border-r">Image</th>
                  <th className="px-4 py-2 text-left border-r">Title</th>
                  <th className="px-4 py-2 text-left border-r">Position</th>
                  <th className="px-4 py-2 text-left border-r">Link</th>
                  <th className="px-4 py-2 text-left border-r">Edit</th>
                  <th className="px-4 py-2 text-left">Delete</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie) => (
                  <tr key={movie.id} className="border-b">
                    <td className="px-4 py-2 border-r">
                      <img
                        src={movie.imageUrl}
                        alt={movie.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-2 border-r">{movie.title}</td>
                    <td className="px-4 py-2 border-r">{movie.position}</td>
                    <td className="px-4 py-2 border-r ">{movie.link}</td>
                    <td className="px-4 py-2 border-r ">
                      <button
                        onClick={() => handleEdit(movie)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(movie.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
