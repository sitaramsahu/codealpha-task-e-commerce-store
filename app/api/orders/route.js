import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req) {
  const { userId, products, totalAmount } = await req.json();
  await connectDB();
  const order = await Order.create({ userId, products, totalAmount });
  return Response.json(order);
}
