"use client";
import Link from "next/link";
import { User } from "lucide-react";
import Image from "next/image";

export default function AdminNavbar({ onLogout }) {
  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50 text-black">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/readyatra-logo.png"
              alt="ReadYatra Logo"
              width={60}
              height={40}
            />
            <div>
              <span className="text-xl font-bold text-gray-800">
                Read<span className="text-blue-600">Yatra</span>
              </span>
              <p className="text-sm text-gray-500 italic">Admin Dashboard</p>
            </div>
          </Link>

          <div className="flex gap-6 items-center">
            <Link href="/admin/profile" className="hover:text-blue-600">
              Profile
            </Link>
            <Link href="/admin/products" className="hover:text-blue-600">
              Products
            </Link>

            <Link href="/admin/users" className="hover:text-blue-600">
              Users
            </Link>
            <button
              onClick={onLogout}
              className="flex items-center gap-1 text-red-600 hover:text-red-800"
            >
              <User className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
