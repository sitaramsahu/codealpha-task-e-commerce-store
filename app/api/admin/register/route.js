import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { hash } from "bcryptjs";

export async function POST(req) {
  await connectDB();
  const { name, email, password } = await req.json();

  if (!name || !email || !password)
    return new Response(JSON.stringify({ error: "All fields required" }), {
      status: 400,
    });

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin)
    return new Response(JSON.stringify({ error: "Admin already exists" }), {
      status: 400,
    });

  const hashedPassword = await hash(password, 10);

  const newAdmin = await Admin.create({
    name,
    email,
    password: hashedPassword,
  });
  return new Response(
    JSON.stringify({ message: "Admin registered", adminId: newAdmin._id }),
    {
      status: 201,
    }
  );
}
