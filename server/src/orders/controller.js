const pool = require("../../database");
const queries = require("./queries");
const pino = require("pino");
const { orderLogger } = require("../helper/logger");

var fs = require("fs");

const getOrders = (req, res) => {
  console.log(req.order_testid);
  pool.query(queries.getOrders, (error, results) => {
    if (error) throw error;
    logger.info(`Order request with ONO:${req.ono} has been processed`);
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

const addOrder = async (req, res, next) => {
  try {
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
      lno,
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

    const date = new Date();
    const newDate =
      date.getFullYear().toString() +
      pad2(date.getMonth() + 1) +
      pad2(date.getDate()) +
      pad2(date.getHours()) +
      pad2(date.getMinutes()) +
      pad2(date.getSeconds());

    const TestId = order_testid.split("~");

    // Process Test IDs and map to lis_codes
    const processedHT = await Promise.all(
      TestId.map(
        (el) =>
          new Promise((resolve, reject) => {
            pool.query(queries.testMapping, [el], (error, result) => {
              if (error) {
                return reject(error);
              }
              resolve(result.rows[0].lis_code);
            });
          })
      )
    );

    const joinedHT = processedHT.join("~");

    const content = `[MSH]
message_id=O01
message_dt=${newDate}
version=2.9
[OBR]
order_control=${order_control}
site_id=${site}
pid=${pid}
apid=${apid}
pname=${name}
address=${address1}^^${address2}^
ptype=${ptype}
birth_dt=${birth_dt}
sex=${sex}
ono=${ono}
lno=${lno}
request_dt=${newDate}
source=${source_cd}^${source_nm}
clinician=${clinician_cd}^${clinician_nm}
room_no=${room_no}
priority=${priority}
pstatus=${pstatus}
comment=${comment}
visitno=${visitno}
order_testid=${joinedHT}`;

    const filePath = `/hcini/queue/HL7_in/O01_${ono}.txt`;

    // Write HL7 content to file
    await new Promise((resolve, reject) => {
      fs.writeFile(filePath, content, (err) => {
        if (err) {
          console.error("Error writing HL7 file:", err);
          return reject(err);
        }
        orderLogger.info(`Order request with ono ${ono} has been processed.`);
        resolve();
      });
    });

    // Insert order into database
    await new Promise((resolve, reject) => {
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
          joinedHT,
          comment,
        ],
        (error) => {
          if (error) {
            console.error("Error inserting order:", error);
            return reject(error);
          }
          resolve();
        }
      );
    });

    res.status(201).send("Order Created Successfully");
  } catch (error) {
    next(error);
  }
};

const updateOrder = (req, res) => {
  const id = parseInt(req.params.id);

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
