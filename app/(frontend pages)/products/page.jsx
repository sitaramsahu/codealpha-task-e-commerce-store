"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PenBoxIcon, Plus } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  // ✅ Decode user from token safely
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ role: payload.role, name: payload.name });
      }
    } catch (err) {
      console.error("Invalid token:", err);
      setUser(null);
    }
  }, []);

  // ✅ Fetch products
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // ✅ Add to cart (backend)
  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");

    // 🚨 If user is NOT logged in → redirect
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Added to cart!");
      } else {
        alert(data.error || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Something went wrong while adding to cart");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Top Bar: Title + Admin Action */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-6">
        <h1 className="text-3xl font-semibold text-center md:text-left">
          🛍️ Our Products
        </h1>

        {user?.role === "admin" && (
          <Link href="/admin/products">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Product
            </Button>
          </Link>
        )}
      </div>

      {message && (
        <p className="text-center text-green-600 font-medium mb-4">{message}</p>
      )}

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          <p className="text-lg mb-2">No products available right now.</p>
          <p className="text-sm">
            Please check back later or explore other sections of ReadYatra.
          </p>
        </div>
      )}

      {/* 🛒 Products Grid */}
      {products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-xl p-4 shadow hover:shadow-lg transition bg-white"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-80 object-contain rounded mb-2"
              />

              <h2 className="text-lg font-bold mt-1 line-clamp-2">
                {product.title}
              </h2>
              <p className="text-gray-600 text-sm">{product.category}</p>

              {product.description && (
                <p className="text-gray-500 text-xs mt-1 line-clamp-3">
                  {product.description}
                </p>
              )}

              <p className="text-blue-600 font-semibold mt-2">
                ₹{product.price}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                <Link href={`/products/${product._id}`}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    View Details
                  </Button>
                </Link>

                <Button
                  onClick={() => handleAddToCart(product)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Add to Cart
                </Button>

                {/* ✅ Admin edit button */}
                {user?.role === "admin" && (
                  <Link href={`/admin/products/${product._id}`}>
                    <Button
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <PenBoxIcon className="w-4 h-4" />
                      Edit
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
