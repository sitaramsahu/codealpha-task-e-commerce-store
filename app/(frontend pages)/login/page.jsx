"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const redirectTo = search.get("redirect") || "/products";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // ✅ Proper headers
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);

      // Redirect to previous page or product page
      router.push(redirectTo);
      window.location.reload();
    } else {
      setError(data.error || "Invalid login, please try again");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-12 border rounded-xl shadow bg-white">
      <h1 className="text-3xl font-semibold mb-2 text-center text-green-700">
        Welcome Back
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Login to continue your ReadYatra 📚
      </p>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* EMAIL */}
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* PASSWORD + TOGGLE */}
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {/* SHOW / HIDE ICON */}
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

        {/* LOGIN BUTTON */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition"
        >
          Login
        </button>

        {/* GO TO REGISTER */}
        <p className="text-center text-gray-600 text-sm mt-2">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-green-700 font-semibold cursor-pointer hover:underline"
          >
            Create one
          </span>
        </p>
      </form>
    </div>
  );
}
