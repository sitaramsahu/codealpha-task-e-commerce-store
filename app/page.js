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

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/80 -z-10" />

      {/* Hero Section */}
      <header className="text-center text-white mb-10 px-4 max-w-3xl">
        {/* Logo & Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gray-900 border border-white/20 text-sm mb-4 backdrop-blur">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/readyatra-logo.png"
              width={60}
              height={40}
              alt="Readyatra Logo"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold text-gray-100">
                Read<span className="text-blue-600">Yatra</span>
              </span>

              <span className="text-sm text-gray-500 italic">
                Har Kitaab, Ek Nayi Yatra
              </span>
            </div>
          </Link>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg leading-tight">
          Welcome to <span className="text-green-400">ReadYatra</span>
        </h1>

        <p className="text-lg md:text-2xl text-gray-200 leading-relaxed">
          Discover a world of books that inspire, inform, and ignite
          imagination. Every page begins a new journey with ReadYatra — your
          trusted space for meaningful reads and smooth online shopping.
        </p>
      </header>

      {/* CTA Buttons */}
      <div className="mt-10 flex flex-wrap gap-4 justify-center">
        <Link
          href="/products"
          className="px-8 py-3 bg-green-500 text-white rounded-full hover:bg-green-400 transition shadow-lg shadow-green-500/30 text-sm md:text-base font-medium"
        >
          Browse Books
        </Link>
        <Link
          href="/login"
          className="px-8 py-3 border border-green-400 text-white rounded-full hover:bg-white hover:text-green-700 transition text-sm md:text-base font-medium bg-white/5"
        >
          Login / Register
        </Link>
      </div>
    </div>
  );
}
