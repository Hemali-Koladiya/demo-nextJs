import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/router";
import Navbar from "../../Components/Navbar";
import AdminLayout from "./AdminLayout";

export default function AddMovie() {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle image file selection and conversion to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageBase64 || !title || !link) {
      alert("Please fill all fields");
      return;
    }

    // Check image size
    const base64Size = imageBase64.length * (3 / 4) - 2; // Approximate size in bytes
    if (base64Size > 900000) {
      // Leave some room for other fields
      alert(
        "Image size is too large. Please choose a smaller image (less than 900KB)."
      );
      return;
    }

    try {
      setLoading(true);

      // Add the new movie with base64 image and created_date
      await addDoc(collection(db, "movies"), {
        title,
        link,
        imageUrl: imageBase64, // Store base64 string directly
        created_date: serverTimestamp(), // Add timestamp
      });

      router.push("/admin");
    } catch (error) {
      console.error("Error adding movie:", error);
      alert("Error adding movie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Add New</h1>
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
              <label className="block mb-2">
                Image (Max size: 900KB)
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full p-2 border rounded"
                accept="image/*"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Please use compressed/optimized images to stay within size
                limits
              </p>
              {previewUrl && (
                <div className="mt-2">
                  <p className="mb-2 text-sm text-gray-600">Preview:</p>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-xs h-auto rounded shadow"
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Movie"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}