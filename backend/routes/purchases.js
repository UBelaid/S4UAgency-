const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT p.*, s.name AS supplier_name, pr.name AS product_name FROM purchases p " +
        "JOIN suppliers s ON p.supplier_id = s.id " +
        "JOIN products pr ON p.product_id = pr.id"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res.status(500).json({ error: "Failed to fetch purchases" });
  } finally {
    if (connection) connection.release();
  }
});

router.post("/", async (req, res) => {
  let connection;
  try {
    const { supplier_id, product_id, quantity, total_price, purchase_date } =
      req.body;
    if (
      !supplier_id ||
      !product_id ||
      !quantity ||
      !total_price ||
      !purchase_date
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    connection = await pool.getConnection();
    await connection.query(
      "INSERT INTO purchases (supplier_id, product_id, quantity, total_price, purchase_date) VALUES (?, ?, ?, ?, ?)",
      [supplier_id, product_id, quantity, total_price, purchase_date]
    );
    res.status(201).json({ message: "Purchase added successfully" });
  } catch (error) {
    console.error("Error adding purchase:", error);
    res.status(500).json({ error: "Failed to add purchase" });
  } finally {
    if (connection) connection.release();
  }
});

router.put("/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { supplier_id, product_id, quantity, total_price, purchase_date } =
      req.body;
    if (
      !supplier_id ||
      !product_id ||
      !quantity ||
      !total_price ||
      !purchase_date
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    connection = await pool.getConnection();
    await connection.query(
      "UPDATE purchases SET supplier_id = ?, product_id = ?, quantity = ?, total_price = ?, purchase_date = ? WHERE id = ?",
      [supplier_id, product_id, quantity, total_price, purchase_date, id]
    );
    res.json({ message: "Purchase updated successfully" });
  } catch (error) {
    console.error("Error updating purchase:", error);
    res.status(500).json({ error: "Failed to update purchase" });
  } finally {
    if (connection) connection.release();
  }
});

router.delete("/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await pool.getConnection();
    await connection.query("DELETE FROM purchases WHERE id = ?", [id]);
    res.json({ message: "Purchase deleted successfully" });
  } catch (error) {
    console.error("Error deleting purchase:", error);
    res.status(500).json({ error: "Failed to delete purchase" });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
