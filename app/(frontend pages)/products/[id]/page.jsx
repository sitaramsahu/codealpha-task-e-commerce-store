"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function ProductDetail() {
  const router = useRouter();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
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

      if (res.ok) alert("Added to cart!");
    } catch (err) {
      console.error(err);
    }
  };

  const proceedToBuy = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    await addToCart();
    router.push("/checkout");
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!product) return <div className="p-6">Product not found.</div>;

  return (
    <div className="relative max-w-4xl mx-auto p-6 flex flex-col md:flex-row gap-6">
      {/* 🔙 BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="absolute -left-2 -top-2 md:left-0 md:top-0 bg-white shadow px-3 py-2 rounded-full flex items-center gap-1 hover:bg-gray-100 transition"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* PRODUCT IMAGE + DETAILS */}
      <img
        src={product.image}
        alt={product.title}
        className="w-full md:w-1/2 h-96 object-contain rounded bg-white"
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
          className="bg-green-600 text-white py-2 px-4 rounded-2xl ml-3 hover:bg-green-700"
        >
          Proceed to Buy
        </button>
      </div>
    </div>
  );
}
