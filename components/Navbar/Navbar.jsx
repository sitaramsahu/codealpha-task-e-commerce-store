"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag, Menu, X, User } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false); // mobile menu
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [accountOpen, setAccountOpen] = useState(false); // account dropdown

  // Update cart badge
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setUser(token ? true : false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setAccountOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <ShoppingBag className="text-blue-600 w-6 h-6" />
          <span className="text-xl font-semibold text-gray-800">
            Shop<span className="text-blue-600">Ease</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/products" className="hover:text-blue-600">
            Products
          </Link>
          <Link href="/orders" className="hover:text-blue-600">
            Orders
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative">
            <ShoppingBag className="w-5 h-5 text-gray-700 hover:text-blue-600" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full px-1.5">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Dropdown (onclick) */}
          <div className="relative">
            <button
              onClick={() => setAccountOpen(!accountOpen)}
              className="flex items-center gap-2 hover:text-blue-600"
            >
              <User className="w-5 h-5" />
              <span>{user ? "Account" : "Login"}</span>
            </button>

            {accountOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg border rounded-md w-36 z-50">
                {user ? (
                  <>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setAccountOpen(false)}
                    >
                      My Orders
                    </Link>
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
                      onClick={() => setAccountOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setAccountOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-700"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <Link
            href="/products"
            className="block px-6 py-2 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Products
          </Link>
          <Link
            href="/orders"
            className="block px-6 py-2 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Orders
          </Link>
          <Link
            href="/cart"
            className="block px-6 py-2 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Cart ({cartCount})
          </Link>

          {user ? (
            <>
              <Link
                href="/orders"
                className="block px-6 py-2 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                My Orders
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="block w-full text-left px-6 py-2 text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block px-6 py-2 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block px-6 py-2 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
