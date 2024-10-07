const pool = require("../../database");
const queries = require("./queries");

var fs = require("fs");

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
  function pad2(n) {
    return n < 10 ? "0" + n : n;
  }

  var date = new Date();

  const newDate =
    date.getFullYear().toString() +
    pad2(date.getMonth() + 1) +
    pad2(date.getDate()) +
    pad2(date.getHours()) +
    pad2(date.getMinutes()) +
    pad2(date.getSeconds());
  console.log(newDate);

  const content = `[MSH]
message_id = O01
message_dt = ${newDate}
[OBR]
order_control = ${order_control};
`;

  fs.writeFile(`/hcini/queue/HL7_in/O01_${ono}.txt`, content, (err) => {
    if (err) {
      console.error(err);
    } else {
      // file written successfully
    }
  });

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
    const data = req.body;
    const allowedColumns = ["order_control", "site", "pid", "apid"];
    const filteredEntries = Object.entries(data).filter(([key]) =>
      allowedColumns.includes(key)
    );
    const columns = filteredEntries.map(
      ([key], index) => `${key} = $${index + 1}`
    );
    const values = filteredEntries.map(([, value]) => value);
    values.push(id);
    const query = `UPDATE lis_order SET ${columns.join(", ")} WHERE id = $${
      values.length
    }`;
    pool.query(query, values, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error updating order");
      } else {
        res.status(200).send("Order updated successfully");
      }
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
