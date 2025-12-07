"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // correct headers
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/login");
    } else {
      setError(data.error || "Registration failed, please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-12 border rounded-xl shadow bg-white">
      <h1 className="text-3xl font-semibold mb-2 text-center text-green-700">
        Create Account
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Join ReadyAtra and start your reading journey 📚
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NAME */}
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          required
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email Address"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* PASSWORD */}
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Create Password"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {/* Show / Hide Password */}
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-3 text-gray-500 hover:text-black"
          >
            {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* ERROR MESSAGE */}
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        {/* SIGN UP BUTTON */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition"
        >
          Sign Up
        </button>

        {/* ALREADY HAVE ACCOUNT */}
        <p className="text-center text-gray-600 text-sm mt-2">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-green-700 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
