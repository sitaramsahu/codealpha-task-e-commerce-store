import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
