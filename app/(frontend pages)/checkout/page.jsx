"use client";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    payment: "cod",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ✅ Load cart from backend or localStorage (fallback)
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
        return;
      }

      try {
        const res = await fetch("/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCart(data.items || []);
      } catch (err) {
        console.error("Cart fetch failed:", err);
      }
    };

    fetchCart();
  }, []);

  // ✅ Calculate total
  const total = cart.reduce(
    (sum, item) =>
      sum + (item.productId?.price || item.price || 0) * (item.quantity || 1),
    0
  );

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Handle order submission
  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.address || !formData.phone) {
      alert("Please fill all fields before proceeding.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login before placing an order.");
      return;
    }

    const products = cart.map((item) => ({
      productId: item.productId?._id || item._id,
      quantity: item.quantity,
    }));

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: "decoded-from-token", // ✅ your backend can decode userId from token if needed
          products,
          totalAmount: total,
        }),
      });

      if (!res.ok) throw new Error("Order failed");
      setSuccess(true);

      // ✅ Clear cart
      localStorage.removeItem("cart");
      setCart([]);

      alert(
        `✅ Order placed successfully!\n\nCustomer: ${
          formData.name
        }\nTotal: ₹${total}\nPayment: ${
          formData.payment === "cod" ? "Cash on Delivery" : "Online Payment"
        }`
      );
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ If empty cart
  if (cart.length === 0 && !success)
    return (
      <div className="p-6 text-center text-gray-600">
        <h1 className="text-2xl font-semibold mb-4">🛍️ Checkout</h1>
        <p>Your cart is empty. Add some products first!</p>
      </div>
    );

  // ✅ Success message
  if (success)
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-semibold text-green-600 mb-4">
          🎉 Order Placed Successfully!
        </h1>
        <p className="text-gray-700">Thank you for shopping with us!</p>
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">🛍️ Checkout</h1>

      {/* Order Summary */}
      <div className="border rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
        <ul className="divide-y divide-gray-200">
          {cart.map((item) => (
            <li key={item._id} className="py-2 flex justify-between">
              <span>
                {item.productId?.title || item.title} × {item.quantity}
              </span>
              <span>
                ₹{(item.productId?.price || item.price) * (item.quantity || 1)}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-right mt-3 font-bold text-lg">Total: ₹{total}</p>
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleCheckout} className="space-y-4">
        <div>
          <label className="block font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded p-2 mt-1"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block font-medium">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border rounded p-2 mt-1"
            placeholder="Enter your delivery address"
          ></textarea>
        </div>

        <div>
          <label className="block font-medium">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded p-2 mt-1"
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label className="block font-medium">Payment Method</label>
          <select
            name="payment"
            value={formData.payment}
            onChange={handleChange}
            className="w-full border rounded p-2 mt-1"
          >
            <option value="cod">Cash on Delivery (COD)</option>
            <option value="online">Online Payment</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          } text-white py-2 rounded`}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
