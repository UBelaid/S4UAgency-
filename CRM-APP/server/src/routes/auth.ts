import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db";
import { RowDataPacket } from "mysql2";

const router = Router();

interface User extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  password: string;
  pin: string;
  role: "employee" | "admin";
}

// Register endpoint
const registerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password, pin, role = "employee" } = req.body;

    // Input validation
    if (!username || !email || !password || !pin) {
      res.status(400).json({
        error: "All fields (username, email, password, pin) are required",
      });
      return;
    }
    if (!["employee", "admin"].includes(role)) {
      res
        .status(400)
        .json({ error: 'Role must be either "employee" or "admin"' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const [result] = await pool.execute(
      "INSERT INTO users (username, email, password, pin, role) VALUES (?, ?, ?, ?, ?)",
      [username, email, hashedPassword, pin, role]
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: (result as any).insertId,
    });
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "Username or email already exists" });
    } else {
      next(error);
    }
  }
};

// Login endpoint
const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required" });
      return;
    }

    // Find user
    const [rows] = await pool.query<User[]>(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const user = rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Ensure JWT_SECRET is defined
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res
        .status(500)
        .json({ error: "Server configuration error: JWT_SECRET not set" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

router.post("/register", registerHandler);
router.post("/login", loginHandler);

export default router;
