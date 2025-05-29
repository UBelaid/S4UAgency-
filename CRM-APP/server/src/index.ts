import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import clientRoutes from "./routes/clients";
import supplierRoutes from "./routes/suppliers";
import productRoutes from "./routes/products";
import salesRoutes from "./routes/sales";
import purchaseRoutes from "./routes/purchases";
import { authenticateToken } from "./middleware/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes); // Unprotected
app.use("/api/clients", authenticateToken, clientRoutes);
app.use("/api/suppliers", authenticateToken, supplierRoutes);
app.use("/api/products", authenticateToken, productRoutes);
app.use("/api/sales", authenticateToken, salesRoutes);
app.use("/api/purchases", authenticateToken, purchaseRoutes);

// Error handling middleware
app.use(((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error Details:", err.message, err.stack); // Log the full error

  if (err.message === "Access token required") {
    return res.status(401).json({ error: err.message });
  }
  if (err.message === "Invalid or expired token") {
    return res.status(403).json({ error: err.message });
  }
  if (err.message === "Server configuration error: JWT_SECRET not set") {
    return res.status(500).json({ error: err.message });
  }
  if (err.message.includes("ER_NO_SUCH_TABLE")) {
    return res.status(500).json({ error: "Database table does not exist" });
  }
  if (err.message.includes("ER_ACCESS_DENIED_ERROR")) {
    return res
      .status(500)
      .json({ error: "Database access denied. Check credentials" });
  }
  if (err.message.includes("ER_BAD_FIELD_ERROR")) {
    return res
      .status(500)
      .json({ error: "Database query error: Invalid column name" });
  }

  res.status(500).json({ error: "Something went wrong!" });
}) as express.ErrorRequestHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
