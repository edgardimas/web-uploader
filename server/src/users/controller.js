const { request } = require("express");
const pool = require("../../database"); // Import the database pool
const { generateToken } = require("../helpers/jwt");
// Find user by ID
const findUserById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0]; // Return the user if found, or undefined if not
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw error; // Propagate the error to the calling function
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "username and password are required" });
    }
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const user = result.rows[0];
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "invalid credentials" });
    }
    const accessToken = generateToken({ id: user.id, username: user.username });
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
};

module.exports = { findUserById, login };
