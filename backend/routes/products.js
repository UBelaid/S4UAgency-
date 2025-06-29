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
    const [rows] = await connection.query("SELECT * FROM products");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  } finally {
    if (connection) connection.release();
  }
});

router.post("/", async (req, res) => {
  let connection;
  try {
    const { name, description, price, stock } = req.body;
    if (!name || !price || !stock) {
      return res
        .status(400)
        .json({ error: "Name, price, and stock are required" });
    }
    connection = await pool.getConnection();
    await connection.query(
      "INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)",
      [name, description || null, price, stock]
    );
    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Failed to add product" });
  } finally {
    if (connection) connection.release();
  }
});

router.put("/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    if (!name || !price || !stock) {
      return res
        .status(400)
        .json({ error: "Name, price, and stock are required" });
    }
    connection = await pool.getConnection();
    await connection.query(
      "UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?",
      [name, description || null, price, stock, id]
    );
    res.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  } finally {
    if (connection) connection.release();
  }
});

router.delete("/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await pool.getConnection();
    await connection.query("DELETE FROM products WHERE id = ?", [id]);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
