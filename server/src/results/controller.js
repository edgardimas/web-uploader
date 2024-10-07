const pool = require("../../database");
const queries = require("./queries");

var fs = require("fs");

const getResults = (req, res) => {
  pool.query(queries.getResults, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const getResultById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getResultById, [id], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

module.exports = {
  getResults,
  getResultById,
};
