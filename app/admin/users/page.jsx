"use client";
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  User,
  Mail,
  Loader2,
  Edit,
  Trash2,
  Save,
  X,
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editedRole, setEditedRole] = useState("");

  // ✅ Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No admin token found!");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/users", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch users");
        }

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ✅ Handle delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setUsers(users.filter((user) => user._id !== id));
        alert("User deleted successfully!");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete user");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  // ✅ Handle role edit
  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditedRole(user.role);
  };

  // ✅ Save role update
  const handleSave = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: editedRole }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUsers(users.map((u) => (u._id === id ? updatedUser : u)));
        setEditingUser(null);
        alert("User updated successfully!");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update user");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating user");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
        <span className="ml-2 text-gray-600">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-600 font-medium mt-10">⚠️ {error}</p>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center flex justify-center items-center gap-2">
        <ShieldCheck className="w-7 h-7 text-blue-600" />
        Admin — Manage Users
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">👤 Name</th>
              <th className="p-3 text-left">📧 Email</th>
              <th className="p-3 text-left">🎭 Role</th>
              <th className="p-3 text-left">🕒 Registered</th>
              <th className="p-3 text-center">⚙️ Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="p-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" /> {user.name}
                  </td>
                  <td className="p-3 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" /> {user.email}
                  </td>
                  <td className="p-3 capitalize font-semibold">
                    {editingUser === user._id ? (
                      <select
                        value={editedRole}
                        onChange={(e) => setEditedRole(e.target.value)}
                        className="border p-1 rounded"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : user.role === "admin" ? (
                      <span className="text-green-600">Admin</span>
                    ) : (
                      <span className="text-gray-700">User</span>
                    )}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-center flex justify-center gap-3">
                    {editingUser === user._id ? (
                      <>
                        <button
                          onClick={() => handleSave(user._id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Save className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-4 text-gray-600 italic"
                >
                  No registered users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
