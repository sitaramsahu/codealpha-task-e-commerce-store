"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PenBoxIcon, Plus } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [productData, setProductData] = useState({
    title: "",
    category: "",
    price: "",
    image: "",
  });
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

  // ✅ Add product (admin only)
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json();
      if (res.ok) {
        setProducts([...products, data]);
        setProductData({ title: "", category: "", price: "", image: "" });
        setMessage("✅ Product added successfully!");
      } else {
        setMessage(data.error || "Failed to add product");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error adding product");
    }
  };

  // ✅ Add to cart (backend)
  const handleAddToCart = async (product) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
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
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        🛍️ Our Products
      </h1>

      {message && (
        <p className="text-center text-green-600 font-medium mb-4">{message}</p>
      )}

      {/* 🛒 Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-80 object-contain rounded"
            />
            <h2 className="text-lg font-bold mt-2">{product.title}</h2>
            <p className="text-gray-600 text-sm">{product.category}</p>
            <p className="text-blue-600 font-semibold mt-2">₹{product.price}</p>

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
                <div className="flex gap-2">
                  <Link href={"/admin/products"}>
                    <Button
                      variant="secondary"
                      className="bg-white hover:bg-gray-200"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add New Product
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
