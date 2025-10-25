import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      {/* Hero Section */}
      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome to <span className="text-blue-600">ShopEase</span>
        </h1>
        <p className="text-gray-600">
          Your one-stop online store for all your shopping needs
        </p>
      </header>

      {/* Logo + Link */}
      <Link
        href="/"
        className="flex items-center gap-3 text-blue-600 hover:text-blue-500 transition-colors"
      >
        <ShoppingBag className="w-8 h-8" />
        <span className="text-xl font-semibold">ShopEase</span>
      </Link>

      {/* CTA Buttons */}
      <div className="mt-10 flex gap-4">
        <Link
          href="/products"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
        >
          Browse Products
        </Link>
        <Link
          href="/login"
          className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
