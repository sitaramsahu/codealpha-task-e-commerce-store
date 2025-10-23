"use client";
import { useEffect, useState } from "react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [productData, setProductData] = useState({
    title: "",
    category: "",
    price: "",
    image: "",
  });
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  // Decode JWT to check role
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({ role: payload.role, name: payload.name });
    }
  }, []);

  // Fetch products
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch((err) => console.log(err));
  }, []);

  // Add product
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

  if (!user || user.role !== "admin")
    return <p className="text-center mt-10">🚫 Access Denied</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        🛍️ Admin Panel
      </h1>

      {/* Add Product Form */}
      <div className="max-w-md mx-auto mb-10 p-4 border rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Add New Product
        </h2>
        <form onSubmit={handleAddProduct} className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            className="w-full border p-2 rounded"
            value={productData.title}
            onChange={(e) =>
              setProductData({ ...productData, title: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Category"
            className="w-full border p-2 rounded"
            value={productData.category}
            onChange={(e) =>
              setProductData({ ...productData, category: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Price"
            className="w-full border p-2 rounded"
            value={productData.price}
            onChange={(e) =>
              setProductData({ ...productData, price: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            className="w-full border p-2 rounded"
            value={productData.image}
            onChange={(e) =>
              setProductData({ ...productData, image: e.target.value })
            }
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Add Product
          </button>
        </form>
        {message && (
          <p className="mt-2 text-center text-green-600">{message}</p>
        )}
      </div>

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
          </div>
        ))}
      </div>
    </div>
  );
}
