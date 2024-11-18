import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useRouter } from "next/router";
import Navbar from "../../../Components/Navbar";
import { adjustPositions } from "../../../utils/positionManager";
import AdminLayout from "../AdminLayout";

export default function EditMovie() {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [position, setPosition] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageSize, setImageSize] = useState(0);
  const router = useRouter();
  const { id } = router.query;

  const MAX_SIZE = 900 * 1024; // 900KB in bytes

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;

      try {
        const movieDoc = await getDoc(doc(db, "movies", id));
        if (movieDoc.exists()) {
          const movieData = movieDoc.data();
          setTitle(movieData.title);
          setLink(movieData.link);
          setPosition(movieData.position);
          setImageBase64(movieData.imageUrl);
          setPreviewUrl(movieData.imageUrl);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie:", error);
        alert("Error fetching movie details");
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // Format file size to human-readable format
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle image file selection and conversion to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size immediately
      if (file.size > MAX_SIZE) {
        alert(`File is too large. Maximum size is ${formatFileSize(MAX_SIZE)}`);
        e.target.value = ''; // Reset input
        return;
      }

      setImageSize(file.size);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImageBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const getSizeColor = () => {
    const percentage = (imageSize / MAX_SIZE) * 100;
    if (percentage > 90) return 'text-red-500';
    if (percentage > 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageBase64 || !title || !link || !position) {
      alert("Please fill all fields");
      return;
    }

    if (imageSize > MAX_SIZE) {
      alert(`Image size (${formatFileSize(imageSize)}) exceeds the maximum allowed size of ${formatFileSize(MAX_SIZE)}`);
      return;
    }

    try {
      setLoading(true);

      // Get current movie data to check if position changed
      const movieDoc = await getDoc(doc(db, "movies", id));
      const currentData = movieDoc.data();

      if (currentData.position !== Number(position)) {
        // Only adjust positions if the position has changed
        await adjustPositions(Number(position), id);
      }

      // Update the movie
      const movieRef = doc(db, "movies", id);
      await updateDoc(movieRef, {
        title,
        link,
        position: Number(position),
        imageUrl: imageBase64,
      });

      router.push("/admin");
    } catch (error) {
      console.error("Error updating movie:", error);
      alert("Error updating movie");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Edit Movie</h1>
          <form onSubmit={handleSubmit} className="max-w-lg">
            <div className="mb-4">
              <label className="block mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter movie title"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Link</label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter movie link"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Position</label>
              <input
                type="number"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter position number (1, 2, 3...)"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Movie Image (Max size: 900KB)</label>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full p-2 border rounded"
                accept="image/*"
              />
              {imageSize > 0 && (
                <div className={`text-sm mt-1 ${getSizeColor()}`}>
                  Image size: {formatFileSize(imageSize)} / {formatFileSize(MAX_SIZE)}
                  {imageSize > MAX_SIZE && (
                    <p className="text-red-500 mt-1">
                      ⚠️ Image exceeds maximum size limit. Please choose a smaller image.
                    </p>
                  )}
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1">
                {/* Please use compressed/optimized images to stay within size limits */}
              </p>
              {previewUrl && (
                <div className="mt-2">
                  <p className="mb-2 text-sm text-gray-600">Current Image:</p>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-xs h-auto rounded shadow"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                disabled={loading || (imageSize > 0 && imageSize > MAX_SIZE)}
              >
                {loading ? "Updating..." : "Update"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin")}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}