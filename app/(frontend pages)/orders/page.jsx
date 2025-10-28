"use client";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) return console.error(data.error);
        setOrders(data.orders || []);
        setUser(data.user || null);
        console.log("user", user);
      })
      .catch((err) => console.error("Error fetching orders:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="text-center text-gray-500 mt-8">Loading orders...</p>;

  if (!user)
    return (
      <div className="text-center p-6">
        <h1 className="text-2xl font-semibold mb-4">📦 My Orders</h1>
        <p className="text-gray-500">
          Please{" "}
          <a href="/login" className="text-blue-600 underline">
            login
          </a>{" "}
          to view your orders.
        </p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-2 text-center">📦 My Orders</h1>
      <p className="text-center text-gray-600 mb-8">
        Welcome, <span className="font-semibold text-black">{user.name}</span>
      </p>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="divide-y divide-gray-200">
                {order.products.map((item, idx) => (
                  <div
                    key={idx}
                    className="py-2 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.productId?.image}
                        alt={item.productId?.title}
                        className="w-14 h-14 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">
                          {item.productId?.title || "Unknown Product"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-800">
                      ₹{(item.productId?.price || 0) * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-right mt-3 font-bold text-lg">
                Total: ₹{order.totalAmount}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
