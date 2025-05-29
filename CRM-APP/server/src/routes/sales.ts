import { Router, Request, Response, NextFunction } from "express";
import pool from "../config/db";

const router = Router();

// Get all sales
const getSalesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [rows] = await pool.query("SELECT * FROM sales");
    res.json(rows);
  } catch (error) {
    next(error);
  }
};
router.get("/", getSalesHandler);

// Add sale
const addSaleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { client_id, product_id, quantity, total_price, sale_date } = req.body;
  try {
    await pool.query(
      "INSERT INTO sales (client_id, product_id, quantity, total_price, sale_date) VALUES (?, ?, ?, ?, ?)",
      [client_id, product_id, quantity, total_price, sale_date]
    );
    res.status(201).json({ message: "Sale added successfully" });
  } catch (error) {
    next(error);
  }
};
router.post("/", addSaleHandler);

// Update sale
const updateSaleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { client_id, product_id, quantity, total_price, sale_date } = req.body;
  try {
    await pool.query(
      "UPDATE sales SET client_id = ?, product_id = ?, quantity = ?, total_price = ?, sale_date = ? WHERE id = ?",
      [client_id, product_id, quantity, total_price, sale_date, id]
    );
    res.json({ message: "Sale updated successfully" });
  } catch (error) {
    next(error);
  }
};
router.put("/:id", updateSaleHandler);

// Delete sale
const deleteSaleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM sales WHERE id = ?", [id]);
    res.json({ message: "Sale deleted successfully" });
  } catch (error) {
    next(error);
  }
};
router.delete("/:id", deleteSaleHandler);

export default router;
