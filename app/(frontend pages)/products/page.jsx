"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [productData, setProductData] = useState({
    title: "",
    category: "",
    price: "",
    image: "",
  });
  const [message, setMessage] = useState("");

  // Fetch products
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch((err) => console.log(err));
  }, []);

  // Admin add product
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
        setMessage("Product added successfully!");
      } else {
        setMessage(data.error || "Failed to add product");
      }
    } catch (err) {
      console.log(err);
      setMessage("Error adding product");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        🛍️ Our Products
      </h1>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-48 object-cover rounded"
            />
            <h2 className="text-lg font-bold mt-2">{product.title}</h2>
            <p className="text-gray-600 text-sm">{product.category}</p>
            <p className="text-blue-600 font-semibold mt-2">₹{product.price}</p>
            <Link
              href={`/products/${product._id}`}
              className="mt-3 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
