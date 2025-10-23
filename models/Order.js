import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: String,
  products: [
    {
      productId: String,
      quantity: Number,
    },
  ],
  totalAmount: Number,
  status: { type: String, default: "pending" },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
