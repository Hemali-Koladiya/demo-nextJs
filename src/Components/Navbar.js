import Link from "next/link";
import logo from "../../public/images/logo.png"
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-[#171717] py-4 border-b">
      <div className="container mx-auto flex justify-between items-center xl:px-12 lg:px-6 px-5 text-white">
        <Link href="/" className="lg:w-44 w-36">
           <h1 className="text-4xl font-semibold">Demo</h1>
        </Link>
        {/* <Link href="/admin" className="text-white">
          Admin
        </Link> */}
      </div>
    </nav>
  );
}
