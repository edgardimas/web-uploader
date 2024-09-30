const pool = require("../../database");
const queries = require("./queries");

const getOrderHeaders = (req, res) => {
  pool.query(queries.getOrderHeaders, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const getOrderHeaderById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getOrderHeaderById, [id], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const addOrderHeader = (req, res) => {
  const {
    ONO,
    ID,
    MESSAGE_DT,
    ORDER_CONTROL,
    PID,
    APID,
    PREFIX,
    FIRST_NAME,
    LAST_NAME,
  } = req.body;

  pool.query(
    queries.addOrderHeader,
    [
      ONO,
      ID,
      MESSAGE_DT,
      ORDER_CONTROL,
      PID,
      APID,
      PREFIX,
      FIRST_NAME,
      LAST_NAME,
    ],
    (error, results) => {
      if (error) throw error;
      res.status(201).send("Student Created Successfully");
    }
  );
};

const removeOrder = (req, res) => {};

module.exports = {
  getOrderHeaders,
  getOrderHeaderById,
  addOrderHeader,
  removeOrder,
};
