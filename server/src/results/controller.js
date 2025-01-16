const pool = require("../../database");
const queries = require("./queries");

var fs = require("fs");

const getResults = (req, res) => {
  pool.query(queries.getResults, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const getResultByOno = (req, res) => {
  const ono = req.params.ono;
  console.log(ono, "<<<<<<<<<<<");
  pool.query(queries.getResultByOno, [ono], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

module.exports = {
  getResults,
  getResultByOno,
};
