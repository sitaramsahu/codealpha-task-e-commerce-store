// app/api/orders/route.js
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";

// ✅ Create new order (POST)
export async function POST(req) {
  try {
    await connectDB();

    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token)
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { products, totalAmount } = await req.json();

    const order = await Order.create({
      userId: decoded.id,
      products,
      totalAmount,
      status: "Pending",
    });

    return new Response(JSON.stringify(order), { status: 201 });
  } catch (err) {
    console.error("ORDER CREATE ERROR:", err);
    return new Response(JSON.stringify({ error: "Failed to create order" }), {
      status: 500,
    });
  }
}

// ✅ Get all orders for the logged-in user (GET)
export async function GET(req) {
  try {
    await connectDB();

    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token)
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const orders = await Order.find({ userId: decoded.id }).populate({
      path: "products.productId",
      select: "title price image",
    });

    return new Response(JSON.stringify({ user: decoded, orders }), {
      status: 200,
    });
  } catch (err) {
    console.error("GET ORDERS ERROR:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
      status: 500,
    });
  }
}
