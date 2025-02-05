const pool = require("../../database");
const queries = require("./queries");

function resDtUp(obx, ono, file) {
  for (const [key, value] of Object.entries(obx)) {
    const values = value.split("|");
    const details = {
      test_cd: values[0],
      test_nm: values[1],
      data_type: values[2],
      result_value: values[3],
      unit: values[4],
      flag: values[5],
      ref_range: values[6],
      status: values[7],
      test_comment: values[8],
      authorized_by: values[9],
      authorized_date: values[10],
      department: values[11],
      method: values[13],
    };
    pool.query(
      queries.addResultDetail,
      [
        details.test_cd,
        details.test_nm,
        details.data_type,
        details.result_value,
        details.unit,
        details.flag,
        details.ref_range,
        details.status,
        details.test_comment,
        details.authorized_by,
        details.authorized_date,
        details.department,
        details.method,
        ono,
      ],
      (error) => {
        if (error) {
          // console.error(`Database error for file ${file}:`, error.message);
          return;
        }
        // console.log(`Database insert successful for file ${file}`);
      }
    );
  }
}

module.exports = resDtUp;
