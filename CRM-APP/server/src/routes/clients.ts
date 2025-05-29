import { Router, Request, Response, NextFunction } from "express";
import pool from "../config/db";

const router = Router();

// Get all clients
const getClientsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [rows] = await pool.query("SELECT * FROM clients");
    res.json(rows);
  } catch (error) {
    next(error);
  }
};
router.get("/", getClientsHandler);

// Add client
const addClientHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, phone, address } = req.body;
  try {
    await pool.query(
      "INSERT INTO clients (name, email, phone, address) VALUES (?, ?, ?, ?)",
      [name, email, phone, address]
    );
    res.status(201).json({ message: "Client added successfully" });
  } catch (error) {
    next(error);
  }
};
router.post("/", addClientHandler);

// Update client
const updateClientHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;
  try {
    await pool.query(
      "UPDATE clients SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?",
      [name, email, phone, address, id]
    );
    res.json({ message: "Client updated successfully" });
  } catch (error) {
    next(error);
  }
};
router.put("/:id", updateClientHandler);

// Delete client
const deleteClientHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM clients WHERE id = ?", [id]);
    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    next(error);
  }
};
router.delete("/:id", deleteClientHandler);

export default router;
