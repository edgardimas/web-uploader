const pool = require("../../database");
const queries = require("./queries");
const pino = require("pino");
const path = require("path");
const { orderLogger, errorLogger } = require("../helpers/logger");
const logDirPath = path.join(__dirname, "../../logs");
const ordersDirPath = path.join(logDirPath, "orders");
const fs = require("fs");

const getOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const rowsPerPage = 10; // Number of rows per page
    const offset = (page - 1) * rowsPerPage;

    // Get total count for pagination
    const countResult = await pool.query("SELECT COUNT(*) FROM lis_order");
    const totalRows = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    // Fetch paginated results
    const results = await pool.query(
      "SELECT * FROM lis_order ORDER BY updated_at DESC LIMIT $1 OFFSET $2;",
      [rowsPerPage, offset]
    );
    const rows = results.rows;

    res.render("onotracer", {
      data: rows,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (err) {
    next(err);
  }
};

const getOrderByOno = async (req, res, next) => {
  try {
    const id = req.params.id; // Use ONO instead of ID
    const results = await pool.query("SELECT * FROM lis_order WHERE ono = $1", [
      id,
    ]);

    if (results.rows.length === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json(results.rows);
  } catch (err) {
    next(err);
  }
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
      TestId.map((el) =>
        pool
          .query(queries.testMapping, [el])
          .then((result) => {
            if (result.rows.length === 0) {
              orderLogger.error(`No mapping match for ${el}`);
              return null; // Explicitly return null to avoid hanging
            }
            return result.rows[0].lis_code;
          })
          .catch((error) => {
            orderLogger.error(`Query failed for ${el}: ${error.message}`);
            return null; // Prevent breaking Promise.all
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
    orderLogger.info(`HL7 file has been created: O01_${ono}.txt`);
    const raw_data = JSON.stringify(req.body);
    const is_received = true;
    const is_ok = false;
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
          raw_data,
          is_received,
          is_ok,
        ],
        (error) => {
          if (error) {
            orderLogger.error(`Error inserting order with ono: ${ono}`);
            errorLogger.info(`Error inserting order with ono: ${ono}`);
            return reject(error);
          }
          orderLogger.info(
            `Order request with ono ${ono} has been inserted into uploader database`
          );
          resolve();
        }
      );
    });

    await new Promise((resolve, reject) => {
      fs.writeFile(filePath, content, (err) => {
        if (err) {
          console.error("Error writing HL7 file:", err);
          return reject(err);
        }
        resolve();
      });
    });

    res.status(201).send("Order Created Successfully");
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const ono = req.params.ono;
    const existingOrder = await pool.query(queries.getOrderById, [ono]);
    if (!existingOrder.rows.length) {
      errorLogger.info(
        `Purposed edited order with ono ${ono}  does not exist in uploader database`
      );
      return res.status(404).send("Order does not exist in database!");
    }

    const data = req.body;
    data.order_control = "RP";
    console.log(data, "<<<<<<");
    const allowedColumns = [
      "order_control",
      "site",
      "pid",
      "apid",
      "name",
      "address1",
      "address2",
      "address3",
      "address4",
      "ptype",
      "birth_dt",
      "sex",
      "mobile_phone",
      "email",
      "lno",
      "request_dt",
      "source_cd",
      "source_nm",
      "room_no",
      "clinician_cd",
      "clinician_nm",
      "priority",
      "diagnose",
      "pstatus",
      "visitno",
      "order_testid",
      "comment",
    ];

    const filteredEntries = Object.entries(data).filter(([key]) =>
      allowedColumns.includes(key)
    );

    if (filteredEntries.length === 0) {
      return res.status(400).send("No valid fields provided for update");
    }

    const columns = filteredEntries.map(
      ([key], index) => `${key} = $${index + 1}`
    );
    const values = filteredEntries.map(([, value]) => value);
    values.push(ono);

    const query = `UPDATE lis_order SET ${columns.join(", ")} WHERE ono = $${
      values.length
    } RETURNING *`;

    const result = await pool.query(query, values);
    const updatedOrder = result.rows[0];

    const {
      site = "",
      pid = "",
      apid = "",
      name = "",
      address1 = "",
      address2 = "",
      address3 = "",
      address4 = "",
      ptype = "",
      birth_dt = "",
      sex = "",
      lno = "",
      source_cd = "",
      source_nm = "",
      clinician_cd = "",
      clinician_nm = "",
      room_no = "",
      priority = "",
      pstatus = "",
      comment = "",
      visitno = "",
      order_testid = "",
    } = updatedOrder;

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

    const newDate = new Date()
      .toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" }) // Uses local time from system
      .replace(/[-:\s]/g, "")
      .slice(0, 14);
    const filePath = `/hcini/queue/HL7_in/O01_${ono}.txt`;

    const content = `[MSH]
message_id=O01
message_dt=${newDate}
version=2.9
[OBR]
order_control=RP
site_id=${site}
pid=${pid}
apid=${apid}
pname=${name}
address=${address1}^${address2}^${address3}^${address4}
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

    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return res.status(500).send("Error saving HL7 file");
      }
    });

    orderLogger.info(`order with ono: ${ono} has been edited`);

    res.status(200).json({
      message: "Order updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

const removeOrder = async (req, res, next) => {
  try {
    const ono = req.params.ono;

    // Check if order exists
    const existingOrder = await pool.query(queries.getOrderById, [ono]);
    if (!existingOrder.rows.length) {
      return res.status(404).send("Order does not exist in the database");
    }

    // Extract order details before deleting
    const order = existingOrder.rows[0];

    // Set fixed order_control to "CA"
    const order_control = "CA";

    // Delete order from the database
    await pool.query(queries.removeOrder, [ono]);

    // Get current timestamp in HL7 format (YYYYMMDDHHMMSS)
    const newDate = new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, "")
      .slice(0, 14);

    // Generate .txt file content with "CA" adjustment
    const filePath = `/hcini/queue/HL7_in/O01_${ono}.txt`;
    const content = `[MSH]
message_id=O01
message_dt=${newDate}
version=2.9
[OBR]
order_control=${order_control}
site_id=${order.site || ""}
pid=${order.pid || ""}
apid=${order.apid || ""}
pname=${order.name || ""}
address=${order.address1 || ""}^^${order.address2 || ""}^
ptype=${order.ptype || ""}
birth_dt=${order.birth_dt || ""}
sex=${order.sex || ""}
ono=${ono}
lno=${order.lno || ""}
request_dt=${newDate}
source=${order.source_cd || ""}^${order.source_nm || ""}
clinician=${order.clinician_cd || ""}^${order.clinician_nm || ""}
room_no=${order.room_no || ""}
priority=${order.priority || ""}
pstatus=${order.pstatus || ""}
comment=${order.comment || ""}
visitno=${order.visitno || ""}
order_testid=${""}`;

    // Write .txt file
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log(`Deletion log saved: ${filePath}`);
        orderLogger.info(`order with ono: ${ono} has been deleted`);
      }
    });

    res.status(200).send("Order removed successfully.");
  } catch (err) {
    next(err);
  }
};

const logOrders = (req, res, next) => {
  fs.readdir(ordersDirPath, (err, files) => {
    if (err) {
      return res.status(500).send("Error reading log directory.");
    }
    const logFiles = files.filter((file) => file.endsWith(".log"));
    res.render("orderlogs", { logFiles, logs: [], currentFile: null });
  });
};

function errorEdit(req, res, next) {
  try {
    const { text, ono } = req.body; // Extract text and ono from the request
    const filePath = path.join("C:/hcini/queue/HL7_in", `${ono}.txt`); // Define file path

    fs.writeFileSync(filePath, text, "utf8"); // Write text to the file

    res.json({ success: true, message: "File saved successfully!" });
  } catch (err) {
    next(err);
  }
}
module.exports = {
  getOrders,
  getOrderByOno,
  addOrder,
  removeOrder,
  updateOrder,
  logOrders,
  errorEdit,
};
