const pool = require("../../../database");
const queries = require("../queries/queries");

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
      "SELECT COUNT(*) FROM result_details WHERE ono = $1 AND test_cd = $2",
      [ono, details.test_cd],
      (error, results) => {
        if (error) {
          console.error(
            `Database error checking test_cd ${details.test_cd} for ONO ${ono} in file ${file}:`,
            error.message
          );
          return;
        }

        const exists = parseInt(results.rows[0].count) > 0;

        if (exists) {
          // Update existing record
          pool.query(
            queries.updateResultDetail, // Define this query in your queries file
            [
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
              details.test_cd, // WHERE condition
            ],
            (updateError) => {
              if (updateError) {
                console.error(
                  `Database update error for ONO ${ono}, test_cd ${details.test_cd} in file ${file}:`,
                  updateError.message
                );
              } else {
                console.log(
                  `Database update successful for ONO ${ono}, test_cd ${details.test_cd} in file ${file}`
                );
              }
            }
          );
        } else {
          // Insert new record
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
            (insertError) => {
              if (insertError) {
                console.error(
                  `Database insert error for file ${file}:`,
                  insertError.message
                );
              } else {
                console.log(
                  `Database insert successful for ONO ${ono}, test_cd ${details.test_cd} in file ${file}`
                );
              }
            }
          );
        }
      }
    );
  }
}

module.exports = resDtUp;
