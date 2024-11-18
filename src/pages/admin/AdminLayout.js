import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { LayoutDashboard, Plus, LogOut } from "lucide-react";
import Image from "next/image";
import logo from "../../../public/images/logo.png";

const AdminLayout = ({ children }) => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white border-r">
        <div className="p-4">
          <div className="flex items-center justify-center mb-8">
            <Link href="/" className="lg:w-44 w-36">
              <h1 className="text-4xl font-semibold">Demo</h1>
            </Link>
          </div>

          <nav className="space-y-2">
            <Link
              href="/admin"
              className={`flex items-center space-x-3 p-3 rounded-lg bg-blue-700  ${
                router.pathname === "/admin"
                  ? "bg-blue-700"
                  : "hover:bg-blue-700"
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Navbar */}
        <div className="bg-black text-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-xl font-semibold">Admin Panel</h1>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/add"
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus size={20} />
                <span>Add</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
