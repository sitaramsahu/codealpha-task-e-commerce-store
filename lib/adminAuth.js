import jwt from "jsonwebtoken";

export function adminAuth(req) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) throw new Error("Unauthorized");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded.role !== "admin") throw new Error("Not admin");
  return decoded;
}
