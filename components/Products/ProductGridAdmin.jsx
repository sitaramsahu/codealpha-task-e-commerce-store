"use client";
import { useState } from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";

export default function ProductsGrid({ products, refreshProducts }) {
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Open edit dialog
  const handleEdit = (product) => {
    setSelected(product);
    setOpen(true);
  };

  // ✅ Delete product
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Product deleted successfully!");
        refreshProducts?.();
      } else {
        alert("Failed to delete product.");
      }
    } catch (error) {
      console.error("Delete error", error);
      alert("Error deleting product.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update product (PUT)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${selected._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selected),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Product updated!");
        setOpen(false);
        refreshProducts?.();
      } else {
        alert(data.message || "Failed to update product.");
      }
    } catch (error) {
      console.error("Update error", error);
      alert("Error updating product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition relative"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-48 object-contain rounded"
            />
            <h2 className="text-lg font-bold mt-2">{product.title}</h2>
            <p className="text-gray-600 text-sm line-clamp-2">
              {product.description}
            </p>
            <p className="text-gray-500 text-sm mt-1">{product.category}</p>
            <p className="text-blue-600 font-semibold mt-2">₹{product.price}</p>

            {/* Edit / Delete buttons */}
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => handleEdit(product)}
                className="p-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      {open && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>

            <form onSubmit={handleUpdate} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  value={selected.title}
                  onChange={(e) =>
                    setSelected({ ...selected, title: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="number"
                  value={selected.price}
                  onChange={(e) =>
                    setSelected({ ...selected, price: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Category</label>
                <input
                  type="text"
                  value={selected.category}
                  onChange={(e) =>
                    setSelected({ ...selected, category: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  value={selected.description}
                  onChange={(e) =>
                    setSelected({ ...selected, description: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                  rows="3"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium">Image URL</label>
                <input
                  type="text"
                  value={selected.image}
                  onChange={(e) =>
                    setSelected({ ...selected, image: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
