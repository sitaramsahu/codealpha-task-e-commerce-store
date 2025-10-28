"use client";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch user token from localStorage (you must have saved it during login)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ✅ Fetch cart items from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        // backend returns { items: [...] }
        setCart(data.items || []);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchCart();
  }, [token]);

  // ✅ Remove item from backend
  const removeItem = async (productId) => {
    try {
      await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
      setCart(cart.filter((item) => item.productId._id !== productId));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // ✅ Calculate total
  const total = cart.reduce(
    (sum, item) => sum + (item.productId.price || 0) * item.quantity,
    0
  );

  if (loading)
    return <p className="text-center mt-8 text-gray-600">Loading cart...</p>;

  if (cart.length === 0)
    return <p className="text-center text-gray-600">Your cart is empty.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">🛒 Your Cart</h1>

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex justify-between border-b pb-2 items-center"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.productId.image}
                alt={item.productId.title}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h2 className="font-semibold">{item.productId.title}</h2>
                <p>₹{item.productId.price}</p>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold">
                ₹{item.productId.price * item.quantity}
              </p>
              <button
                onClick={() => removeItem(item.productId._id)}
                className="text-red-500 text-sm hover:underline mt-1"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right">
        <p className="text-lg font-bold">Total: ₹{total}</p>
        <button
          onClick={() => (window.location.href = "/checkout")}
          className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
