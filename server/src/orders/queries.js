const getOrders = "SELECT * FROM orders";
const getOrdersById = "SELECT * FROM orders WHERE id = $1";
const addOrders = `INSERT INTO orders ("ONO", "ID", "MESSAGE_DT", "ORDER_CONTROL", "PID", "APID", "PREFIX", "FIRST_NAME", "LAST_NAME") 
                    values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;

module.exports = {
  getOrders,
  getOrdersById,
  addOrders,
};
