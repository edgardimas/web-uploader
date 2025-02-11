const pool = require("../../database");

const getErrData = async (req, res, next) => {
  try {
    const { ono } = req.params; // Get 'ono' from URL parameter

    if (!ono) {
      return res.status(400).json({ error: "ONO parameter is required" });
    }

    // Use parameterized query to prevent SQL Injection
    const result = await pool.query("SELECT * FROM ono_errors WHERE ono = $1", [
      ono,
    ]);

    res.render("hclaberror", { data: result.rows, ono });
  } catch (error) {
    console.error("Database error:", error);
    next(error);
  }
};

module.exports = getErrData;
