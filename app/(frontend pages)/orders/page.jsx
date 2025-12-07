"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }

    fetch("/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
          setUser(null);
          setOrders([]);
          return;
        }
        setOrders(data.orders || []);
        setUser(data.user || null);
        console.log("user", data.user);
      })
      .catch((err) => console.error("Error fetching orders:", err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusClasses = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-8">Loading your orders...</p>
    );
  }

  // ❌ Not logged in
  if (!user) {
    return (
      <div className="text-center p-8 max-w-md mx-auto">
        <h1 className="text-3xl font-semibold mb-3">📦 My Orders</h1>
        <p className="text-gray-600 mb-4">
          Please login to view your ReadyAtra order history.
        </p>
        <button
          onClick={() => router.push("/login?redirect=/orders")}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-2 text-center">📦 My Orders</h1>
      <p className="text-center text-gray-600 mb-8">
        Welcome, <span className="font-semibold text-black">{user.name}</span>.
        Here&apos;s your ReadyAtra journey summary.
      </p>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          <p className="text-lg mb-2 font-medium">No orders found yet.</p>
          <p className="text-sm mb-4">
            Start your first reading yatra by exploring our collection.
          </p>
          <button
            onClick={() => router.push("/products")}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Browse Books
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const orderDate = order.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : null;

            return (
              <div
                key={order._id}
                className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
              >
                <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID: {order._id}
                    </p>
                    {orderDate && (
                      <p className="text-xs text-gray-400">
                        Placed on: {orderDate}
                      </p>
                    )}
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(
                      order.status
                    )}`}
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
            );
          })}
        </div>
      )}
    </div>
  );
}
