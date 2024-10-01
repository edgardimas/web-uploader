const pool = require("../../database");
const queries = require("./queries");

const getOrders = (req, res) => {
  pool.query(queries.getOrders, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const getOrderById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getOrderById, [id], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const addOrder = (req, res) => {
  const {
    message_dt,
    order_control,
    site,
    pid,
    apid,
    name,
    address1,
    address2,
    address3,
    address4,
    ptype,
    birth_dt,
    sex,
    mobile_phone,
    email,
    ono,
    request_dt,
    source_cd,
    source_nm,
    room_no,
    clinician_cd,
    clinician_nm,
    priority,
    diagnose,
    pstatus,
    visitno,
    order_testid,
    comment,
  } = req.body;

  pool.query(
    queries.addOrder,
    [
      message_dt,
      order_control,
      site,
      pid,
      apid,
      name,
      address1,
      address2,
      address3,
      address4,
      ptype,
      birth_dt,
      sex,
      mobile_phone,
      email,
      ono,
      request_dt,
      source_cd,
      source_nm,
      room_no,
      clinician_cd,
      clinician_nm,
      priority,
      diagnose,
      pstatus,
      visitno,
      order_testid,
      comment,
    ],
    (error, results) => {
      if (error) throw error;
      res.status(201).send("Order Created Successfully");
    }
  );
};

const updateOrder = (req, res) => {
  const id = parseInt(req.params.id);
  const { order_control } = req.body;
  const data = req.body;

  pool.query(queries.getOrderById, [id], (error, results) => {
    const noOrderFound = !results.rows.length;
    if (noOrderFound) {
      res.send("Order does not exist in database");
    }

    const updatePromises = Object.entries(data).map(([key, value]) => {
      const columnName = key;
      const query = `UPDATE lis_order SET ${columnName} = $1 WHERE id = $2`;
      return pool.query(query, [value, id]);
    });

    Promise.all(updatePromises)
      .then(() => {
        res.status(200).send("Order updated successfully");
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error updating order");
      });
  });
};

const removeOrder = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query(queries.getOrderById, [id], (error, results) => {
    const noOrderFound = !results.rows.length;
    if (noOrderFound) {
      res.send("Order does not exist in the database");
    }

    pool.query(queries.removeOrder, [id], (error, result) => {
      res.status(200).send("Order removed successfully.");
    });
  });
};

module.exports = {
  getOrders,
  getOrderById,
  addOrder,
  removeOrder,
  updateOrder,
};
