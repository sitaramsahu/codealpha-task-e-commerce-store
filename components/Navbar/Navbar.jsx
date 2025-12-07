"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { ShoppingBag, Menu, X, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("user");

  const router = useRouter();
  const accountRef = useRef(null);

  // 🟢 Decode user from JWT token
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({ name: payload.name, email: payload.email });
      setRole(payload.role || "user");
    } catch (error) {
      console.error("Invalid token", error);
    }
  }, []);

  // 🛒 Cart count from backend or fallback localStorage
  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };
    updateCount();
    window.addEventListener("storage", updateCount);
    return () => window.removeEventListener("storage", updateCount);
  }, []);

  // 🔒 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setRole("user");
    setAccountOpen(false);
    router.push("/login");
  };

  // 🧊 Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      {/* MAIN NAVBAR */}
      <nav className="bg-white shadow-md sticky top-0 z-50 text-black">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/readyatra-logo.png"
              width={55}
              height={40}
              alt="logo"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold text-gray-800">
                Read<span className="text-blue-600">Yatra</span>
              </span>
              <span className="text-sm text-gray-500 italic">
                Har Kitaab, Ek Nayi Yatra
              </span>
            </div>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex gap-6 items-center">
            <Link href="/about" className="hover:text-blue-600">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-blue-600">
              Contact Us
            </Link>
            <Link href="/products" className="hover:text-blue-600">
              Products
            </Link>
            <Link href="/orders" className="hover:text-blue-600">
              Orders
            </Link>

            {/* CART */}
            <Link href="/cart" className="relative hover:text-blue-600">
              <ShoppingBag className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full px-1.5">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* ACCOUNT MENU */}
            <div ref={accountRef} className="relative">
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center gap-2 hover:text-blue-600"
              >
                <User className="w-5 h-5" />
                {user ? user.name?.split(" ")[0] : "Account"}
              </button>

              {accountOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg border rounded-md w-40 z-50">
                  {user ? (
                    <>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setAccountOpen(false)}
                      >
                        My Orders
                      </Link>

                      {role === "admin" && (
                        <Link
                          href="/admin/profile"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setAccountOpen(false)}
                        >
                          Admin Profile
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-700"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="md:hidden bg-white border-t shadow-sm">
            <Link href="/about" className="hover:text-blue-600">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-blue-600">
              Contact Us
            </Link>
            <Link
              href="/products"
              className="block px-6 py-3 hover:bg-gray-100"
            >
              Products
            </Link>
            <Link href="/orders" className="block px-6 py-3 hover:bg-gray-100">
              Orders
            </Link>
            <Link href="/cart" className="block px-6 py-3 hover:bg-gray-100">
              Cart ({cartCount})
            </Link>

            {!user ? (
              <>
                <Link
                  href="/login"
                  className="block px-6 py-3 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-6 py-3 hover:bg-gray-100"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/orders"
                  className="block px-6 py-3 hover:bg-gray-100"
                >
                  My Orders
                </Link>

                {role === "admin" && (
                  <Link
                    href="/admin/profile"
                    className="block px-6 py-3 hover:bg-gray-100"
                  >
                    Admin Profile
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-6 py-3 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* ADMIN NAVBAR */}
      {user && role === "admin" && (
        <div className="bg-blue-50 border-t border-blue-200 py-2 shadow-sm">
          <div className="max-w-7xl mx-auto flex justify-center gap-8 text-blue-700 font-medium">
            <Link href="/admin/profile">Admin Profile</Link>
            <Link href="/admin/product">Admin Product</Link>
            <Link href="/admin/checkout">Admin Checkout</Link>
            <Link href="/contact">Contacts</Link>
          </div>
        </div>
      )}
    </>
  );
}
