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
      "SELECT s.*, c.name AS client_name, p.name AS product_name FROM sales s " +
        "JOIN clients c ON s.client_id = c.id " +
        "JOIN products p ON s.product_id = p.id"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ error: "Failed to fetch sales" });
  } finally {
    if (connection) connection.release();
  }
});

router.post("/", async (req, res) => {
  let connection;
  try {
    const { client_id, product_id, quantity, total_price, sale_date } =
      req.body;
    if (!client_id || !product_id || !quantity || !total_price || !sale_date) {
      return res.status(400).json({ error: "All fields are required" });
    }
    connection = await pool.getConnection();
    await connection.query(
      "INSERT INTO sales (client_id, product_id, quantity, total_price, sale_date) VALUES (?, ?, ?, ?, ?)",
      [client_id, product_id, quantity, total_price, sale_date]
    );
    res.status(201).json({ message: "Sale added successfully" });
  } catch (error) {
    console.error("Error adding sale:", error);
    res.status(500).json({ error: "Failed to add sale" });
  } finally {
    if (connection) connection.release();
  }
});

router.put("/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { client_id, product_id, quantity, total_price, sale_date } =
      req.body;
    if (!client_id || !product_id || !quantity || !total_price || !sale_date) {
      return res.status(400).json({ error: "All fields are required" });
    }
    connection = await pool.getConnection();
    await connection.query(
      "UPDATE sales SET client_id = ?, product_id = ?, quantity = ?, total_price = ?, sale_date = ? WHERE id = ?",
      [client_id, product_id, quantity, total_price, sale_date, id]
    );
    res.json({ message: "Sale updated successfully" });
  } catch (error) {
    console.error("Error updating sale:", error);
    res.status(500).json({ error: "Failed to update sale" });
  } finally {
    if (connection) connection.release();
  }
});

router.delete("/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await pool.getConnection();
    await connection.query("DELETE FROM sales WHERE id = ?", [id]);
    res.json({ message: "Sale deleted successfully" });
  } catch (error) {
    console.error("Error deleting sale:", error);
    res.status(500).json({ error: "Failed to delete sale" });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
