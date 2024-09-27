const pool = require("../../database");
const queries = require("./queries");

const getOrders = (req, res) => {
  pool.query(queries.getOrders, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const getOrdersById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getOrdersById, [id], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

module.exports = {
  getOrders,
  getOrdersById,
};
