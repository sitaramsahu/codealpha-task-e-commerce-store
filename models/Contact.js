import mongoose from "mongoose";
import { email } from "zod";

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  message: { type: String },
  mobile: { type: Number, default: null },
  screenshot: { type: String },
});

export default mongoose.models.Contact ||
  mongoose.model("Contact", ContactSchema);
