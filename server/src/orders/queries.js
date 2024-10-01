const getOrders = `SELECT * FROM lis_order`;
const getOrderById = `SELECT * FROM lis_order WHERE id = $1`;
const addOrder = `INSERT INTO lis_order 
                    (message_dt,order_control,site,pid,apid,name,address1,address2,address3,address4,ptype,birth_dt,sex,mobile_phone,email,ono,request_dt,source_cd,source_nm,room_no,clinician_cd,clinician_nm,priority,diagnose,pstatus,visitno,order_testid,comment)
                    values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29)`;

const removeOrder = `DELETE FROM lis_order WHERE id = $1`;

module.exports = {
  getOrders,
  getOrderById,
  addOrder,
  removeOrder,
};
