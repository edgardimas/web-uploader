const getOrderHeaders = `SELECT * FROM "order-headers"`;
const getOrderHeaderById = `SELECT * FROM "order-headers" WHERE id = $1`;
const addOrderHeader = `INSERT INTO order-headers ("ONO", "ID", "MESSAGE_DT", "ORDER_CONTROL", "PID", "APID", "PREFIX", "FIRST_NAME", "LAST_NAME") 
                    values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;

module.exports = {
  getOrderHeaders,
  getOrderHeaderById,
  addOrderHeader,
};
