import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { adminAuth } from "@/lib/adminAuth";

export async function GET() {
  await connectDB();
  const products = await Product.find();
  return new Response(JSON.stringify(products), { status: 200 });
}

export async function POST(req) {
  try {
    await connectDB();

    const admin = adminAuth(req); // check admin

    const data = await req.json();
    const newProduct = await Product.create(data);

    return new Response(JSON.stringify(newProduct), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 401,
    });
  }
}
