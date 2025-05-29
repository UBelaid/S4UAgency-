import { Router, Request, Response, NextFunction } from "express";
import pool from "../config/db";

const router = Router();

// Get all products
const getProductsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products");
    res.json(rows);
  } catch (error) {
    next(error);
  }
};
router.get("/", getProductsHandler);

// Add product
const addProductHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { product_name, description, price, stock_quantity, category } =
    req.body;
  try {
    await pool.query(
      "INSERT INTO products (product_name, description, price, stock_quantity, category) VALUES (?, ?, ?, ?, ?)",
      [product_name, description, price, stock_quantity, category]
    );
    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    next(error);
  }
};
router.post("/", addProductHandler);

// Update product
const updateProductHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { product_name, description, price, stock_quantity, category } =
    req.body;
  try {
    await pool.query(
      "UPDATE products SET product_name = ?, description = ?, price = ?, stock_quantity = ?, category = ? WHERE id = ?",
      [product_name, description, price, stock_quantity, category, id]
    );
    res.json({ message: "Product updated successfully" });
  } catch (error) {
    next(error);
  }
};
router.put("/:id", updateProductHandler);

// Delete product
const deleteProductHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM products WHERE id = ?", [id]);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};
router.delete("/:id", deleteProductHandler);

export default router;
