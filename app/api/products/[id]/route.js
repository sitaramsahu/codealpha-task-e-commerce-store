import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

// ✅ GET single product by ID
export async function GET(req, context) {
  try {
    const { id } = context.params;
    await connectDB();
    const product = await Product.findById(id);
    if (!product) {
      return Response.json({ message: "Product not found" }, { status: 404 });
    }
    return Response.json(product);
  } catch (error) {
    return Response.json(
      { message: "Error fetching product", error },
      { status: 500 }
    );
  }
}

// ✅ PUT - Edit product by ID
export async function PUT(req, context) {
  try {
    const { id } = context.params;
    const data = await req.json();
    await connectDB();
    const updated = await Product.findByIdAndUpdate(id, data, { new: true });
    if (!updated) {
      return Response.json({ message: "Product not found" }, { status: 404 });
    }
    return Response.json({
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error) {
    return Response.json(
      { message: "Error updating product", error },
      { status: 500 }
    );
  }
}

// ✅ DELETE - Remove product by ID
export async function DELETE(req, context) {
  try {
    const { id } = context.params;
    await connectDB();
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return Response.json({ message: "Product not found" }, { status: 404 });
    }
    return Response.json({ message: "Product deleted successfully" });
  } catch (error) {
    return Response.json(
      { message: "Error deleting product", error },
      { status: 500 }
    );
  }
}
