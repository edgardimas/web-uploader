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

const addOrders = (req, res) => {
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

  pool.query(queries.addStudent, [
    ONO,
    ID,
    MESSAGE_DT,
    ORDER_CONTROL,
    PID,
    APID,
    PREFIX,
    FIRST_NAME,
    LAST_NAME,
  ]);

  (errors, results) => {
    if (error) throw error;
    res.status(201).send("Student Created Successfully");
  };
};

module.exports = {
  getOrders,
  getOrdersById,
  addOrders,
};
