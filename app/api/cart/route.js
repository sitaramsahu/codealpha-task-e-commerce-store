import { connectDB } from "@/lib/mongodb";
import Cart from "@/models/Cart";
import jwt from "jsonwebtoken";

// ✅ Get user cart
export async function GET(req) {
  try {
    await connectDB();

    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token)
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const cart = await Cart.findOne({ userId: decoded.id }).populate(
      "items.productId"
    );

    return new Response(JSON.stringify(cart || { items: [] }), { status: 200 });
  } catch (err) {
    console.error("GET CART ERROR:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch cart" }), {
      status: 500,
    });
  }
}

// ✅ Add to cart
export async function POST(req) {
  try {
    await connectDB();

    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token)
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { productId, quantity } = await req.json();

    if (!productId) {
      return new Response(JSON.stringify({ error: "Product ID required" }), {
        status: 400,
      });
    }

    let cart = await Cart.findOne({ userId: decoded.id });
    if (!cart) {
      cart = new Cart({ userId: decoded.id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({ productId, quantity: quantity || 1 });
    }

    await cart.save();
    return new Response(JSON.stringify(cart), { status: 201 });
  } catch (err) {
    console.error("ADD CART ERROR:", err);
    return new Response(JSON.stringify({ error: "Failed to add to cart" }), {
      status: 500,
    });
  }
}

// ✅ Remove item or clear cart
export async function DELETE(req) {
  try {
    await connectDB();

    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token)
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { productId } = await req.json();

    let cart = await Cart.findOne({ userId: decoded.id });
    if (!cart)
      return new Response(JSON.stringify({ error: "Cart not found" }), {
        status: 404,
      });

    if (productId) {
      // remove specific product
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
      );
    } else {
      // clear cart
      cart.items = [];
    }

    await cart.save();
    return new Response(JSON.stringify(cart), { status: 200 });
  } catch (err) {
    console.error("DELETE CART ERROR:", err);
    return new Response(JSON.stringify({ error: "Failed to update cart" }), {
      status: 500,
    });
  }
}
