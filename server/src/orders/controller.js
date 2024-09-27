const pool = require("../../database");

const getOrders = (req, res) => {
  pool.query("SELECT * FROM orders", (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

module.exports = {
  getOrders,
};
