"use client";
import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const images = [
    "/selling-online.jpg",
    "/ecommerce-srs.png",
    "/shop-bg-1.webp",
    "/shop-bg-2.jpg",
    "/shop-bg-3.jpg",
  ];

  const [current, setCurrent] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Slider */}
      {images.map((src, index) => (
        <Image
          key={index}
          src={src}
          alt={`Slide ${index}`}
          fill
          priority={index === 0}
          className={`object-cover transition-opacity duration-1000 ease-in-out absolute inset-0 -z-10 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80 -z-10"></div>

      {/* Hero Section */}
      <header className="text-center text-white mb-10 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          Welcome to <span className="text-green-400">ReadYatra</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-200">
          Your one-stop shop for digital and daily essentials. Trusted quality,
          affordable prices.
        </p>
      </header>

      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-3 text-white hover:text-green-300 transition-colors"
      >
        <ShoppingBag className="w-8 h-8" />
        <span className="text-xl md:text-2xl font-semibold">Books</span>
      </Link>

      {/* CTA Buttons */}
      <div className="mt-10 flex gap-4">
        <Link
          href="/products"
          className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-400 transition"
        >
          Browse Books
        </Link>
        <Link
          href="/login"
          className="px-6 py-2 border border-green-400 text-white rounded-md hover:bg-green-50 hover:text-green-600 transition"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
