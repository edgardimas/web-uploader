const getOrderHeaders = `SELECT * FROM "orderHeaders"`;
const getOrderHeaderById = `SELECT * FROM "orderHeaders" WHERE id = $1`;
const addOrderHeader = `INSERT INTO "orderHeaders" ("ONO", "ID", "MESSAGE_DT", "ORDER_CONTROL", "PID", "APID", "PREFIX", "FIRST_NAME", "LAST_NAME") 
                    values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
const updateOrderHeader = `UPDATE "orderHeaders" SET "LAST_NAME" = $1 WHERE id = $2`;
const removeOrderHeader = `DELETE FROM "orderHeaders" WHERE id = $1`;

module.exports = {
  getOrderHeaders,
  getOrderHeaderById,
  addOrderHeader,
  updateOrderHeader,
  removeOrderHeader,
};
