import { Router, Request, Response, NextFunction } from "express";
import pool from "../config/db";

const router = Router();

// Get all suppliers
const getSuppliersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [rows] = await pool.query("SELECT * FROM suppliers");
    res.json(rows);
  } catch (error) {
    next(error);
  }
};
router.get("/", getSuppliersHandler);

// Add supplier
const addSupplierHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { supplier_name, contact_name, company_address } = req.body;
  try {
    await pool.query(
      "INSERT INTO suppliers (supplier_name, contact_name, company_address) VALUES (?, ?, ?)",
      [supplier_name, contact_name, company_address]
    );
    res.status(201).json({ message: "Supplier added successfully" });
  } catch (error) {
    next(error);
  }
};
router.post("/", addSupplierHandler);

// Update supplier
const updateSupplierHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { supplier_name, contact_name, company_address } = req.body;
  try {
    await pool.query(
      "UPDATE suppliers SET supplier_name = ?, contact_name = ?, company_address = ? WHERE id = ?",
      [supplier_name, contact_name, company_address, id]
    );
    res.json({ message: "Supplier updated successfully" });
  } catch (error) {
    next(error);
  }
};
router.put("/:id", updateSupplierHandler);

// Delete supplier
const deleteSupplierHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM suppliers WHERE id = ?", [id]);
    res.json({ message: "Supplier deleted successfully" });
  } catch (error) {
    next(error);
  }
};
router.delete("/:id", deleteSupplierHandler);

export default router;
