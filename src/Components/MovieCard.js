import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function MovieCard({ movie }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setIsZoomed(true);
    setTimeout(() => {
      setIsZoomed(false);
      // router.push(movie.link);
      // window.open(movie.link, "_blank", "noopener,noreferrer");
    }, 1000);
  };

  return (
    <div className={"relative"}>
      <div
        className={`transform transition-transform duration-500 cursor-pointer ${
          isZoomed
            ? "md:scale-[1.8] scale-[1.7] z-20 fixed lg:top-[35%] top-[40%] lg:left-[40%] md:left-[38%] left-[28%] md:w-52 md:h-52 w-40 h-40"
            : "scale-100 z-10 hover:scale-105 relative"
        }`}
        // style={{
        //   position: isZoomed ? "" : "",
        //   top: isZoomed ? "40%" : "auto",
        //   left: isZoomed ? "40%" : "auto",
        // }} // Ensure z-index works
        onClick={handleClick}
      >
        <div className="bg-[#171717] text-white rounded-lg shadow-lg overflow-hidden">
          <img
            src={movie.imageUrl}
            alt={movie.title}
            className="w-full xl:h-48 md:h-40 h-28 object-cover"
          />
          <div className="p-4">
            <p className="lg:text-lg text-base font-semibold">{movie.title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
