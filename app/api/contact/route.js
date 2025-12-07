import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import fs from "fs";
import path from "path";

export async function POST(req) {
  await connectDB();
  try {
    const data = await req.json();
    const { name, email, message, mobile, screenshot, filename } = data;

    if (!name) throw new Error("Name is required");

    let savedFileName = "";
    if (screenshot && filename) {
      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

      savedFileName = `${Date.now()}-${filename}`;
      const filePath = path.join(uploadDir, savedFileName);

      const buffer = Buffer.from(screenshot, "base64");
      fs.writeFileSync(filePath, buffer);
    }

    const newContact = await Contact.create({
      name,
      email,
      message,
      mobile: mobile ? Number(mobile) : null,
      screenshot: savedFileName,
    });

    return new Response(JSON.stringify(newContact), { status: 201 });
  } catch (err) {
    console.error("POST /api/contact error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

export async function GET() {
  await connectDB();
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(contacts || []), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  await connectDB();
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) throw new Error("ID is required");

    const deleted = await Contact.findByIdAndDelete(id);
    if (!deleted) throw new Error("Contact not found");

    return new Response(JSON.stringify({ message: "Deleted successfully" }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
