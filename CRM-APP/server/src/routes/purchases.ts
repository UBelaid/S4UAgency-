import { Router, Request, Response, NextFunction } from "express";
import pool from "../config/db";

const router = Router();

// Get all purchases
const getPurchasesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [rows] = await pool.query("SELECT * FROM purchases");
    res.json(rows);
  } catch (error) {
    next(error);
  }
};
router.get("/", getPurchasesHandler);

// Add purchase
const addPurchaseHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { supplier_id, product_id, quantity, total_cost, purchase_date } =
    req.body;
  try {
    await pool.query(
      "INSERT INTO purchases (supplier_id, product_id, quantity, total_cost, purchase_date) VALUES (?, ?, ?, ?, ?)",
      [supplier_id, product_id, quantity, total_cost, purchase_date]
    );
    res.status(201).json({ message: "Purchase added successfully" });
  } catch (error) {
    next(error);
  }
};
router.post("/", addPurchaseHandler);

// Update purchase
const updatePurchaseHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { supplier_id, product_id, quantity, total_cost, purchase_date } =
    req.body;
  try {
    await pool.query(
      "UPDATE purchases SET supplier_id = ?, product_id = ?, quantity = ?, total_cost = ?, purchase_date = ? WHERE id = ?",
      [supplier_id, product_id, quantity, total_cost, purchase_date, id]
    );
    res.json({ message: "Purchase updated successfully" });
  } catch (error) {
    next(error);
  }
};
router.put("/:id", updatePurchaseHandler);

// Delete purchase
const deletePurchaseHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM purchases WHERE id = ?", [id]);
    res.json({ message: "Purchase deleted successfully" });
  } catch (error) {
    next(error);
  }
};
router.delete("/:id", deletePurchaseHandler);

export default router;
