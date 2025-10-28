"use client";

import React, { use, useEffect, useState } from "react";

export default function ProductDetail({ params }) {
  // ✅ Unwrap the params Promise
  const { id } = use(params);

  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then(setProduct)
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
  };

  const proceedToBuy = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ ...product, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "/checkout";
  };

  if (!product) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col md:flex-row gap-6">
      <img
        src={product.image}
        alt={product.title}
        className="w-full md:w-1/2 h-120 object-contain rounded"
      />
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
        <p className="text-gray-600 mb-2">{product.description}</p>
        <p className="text-blue-700 font-semibold text-lg mb-4">
          ₹{product.price}
        </p>
        <button
          onClick={addToCart}
          className="bg-blue-600 text-white py-2 px-4 rounded-2xl hover:bg-blue-700"
        >
          Add to Cart
        </button>
        <button
          onClick={proceedToBuy}
          className="bg-blue-600 text-white py-2 px-4 rounded-2xl ml-4 hover:bg-blue-700"
        >
          Proceed to Buy
        </button>
      </div>
    </div>
  );
}
