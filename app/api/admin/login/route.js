import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  if (!email || !password)
    return new Response(JSON.stringify({ error: "All fields required" }), {
      status: 400,
    });

  const admin = await Admin.findOne({ email });
  if (!admin)
    return new Response(JSON.stringify({ error: "Admin not found" }), {
      status: 404,
    });

  const isMatch = await compare(password, admin.password);
  if (!isMatch)
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
    });

  const token = jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return new Response(
    JSON.stringify({ token, admin: { name: admin.name, email: admin.email } }),
    {
      status: 200,
    }
  );
}
