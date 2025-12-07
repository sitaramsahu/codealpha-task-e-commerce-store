"use client";
import { useEffect, useState } from "react";

export default function ContactPage() {
  const [contacts, setContacts] = useState([]);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("user");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    mobile: "",
    screenshot: "", // File object
  });
  const [loading, setLoading] = useState(false);

  // 🟢 Decode user from JWT token
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({ name: payload.name, email: payload.email });
      setRole(payload.role || "user");
    } catch (error) {
      console.error("Invalid token", error);
    }
  }, []);

  // Fetch all contacts
  async function fetchContacts() {
    try {
      const res = await fetch("/api/contact");
      if (!res.ok) throw new Error(`Network response not OK: ${res.status}`);
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
      setContacts([]);
    }
  }

  useEffect(() => {
    fetchContacts();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let screenshotBase64 = "";
      if (formData.screenshot) {
        const arrayBuffer = await formData.screenshot.arrayBuffer();
        screenshotBase64 = Buffer.from(arrayBuffer).toString("base64");
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        mobile: formData.mobile,
        screenshot: screenshotBase64,
        filename: formData.screenshot?.name || "",
      };

      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setFormData({
        name: "",
        email: "",
        message: "",
        mobile: "",
        screenshot: "",
      });
      fetchContacts();
    } catch (err) {
      console.error("Failed to save contact:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete contact
  const handleDelete = async (id) => {
    try {
      await fetch("/api/contact", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchContacts();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

      {/* Contact Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-4 border rounded-lg shadow"
      >
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Mobile"
          value={formData.mobile}
          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          required
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Message"
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf,.zip"
          onChange={(e) =>
            setFormData({ ...formData, screenshot: e.target.files[0] })
          }
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {/* Contact List */}
      {user && role === "admin" && (
        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Saved Contacts</h2>
          <ul className="space-y-3">
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <li
                  key={contact._id}
                  className="p-4 border rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.email}</p>
                    <p>{contact.message}</p>
                    {contact.screenshot && (
                      <p className="text-xs text-gray-400">
                        File: {contact.screenshot}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      {new Date(contact.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(contact._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </li>
              ))
            ) : (
              <p className="text-gray-600">No contacts yet.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
