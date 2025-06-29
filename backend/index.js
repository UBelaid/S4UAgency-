const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const clientRoutes = require("./routes/clients");
const supplierRoutes = require("./routes/suppliers");
const productRoutes = require("./routes/products");
const purchaseRoutes = require("./routes/purchases");
const saleRoutes = require("./routes/sales");

dotenv.config();
const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/products", productRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/sales", saleRoutes);

app.get("/", (req, res) => res.send("Backend API running"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
