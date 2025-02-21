const pool = require("../../../database");
const queries = require("../queries/queries");

async function resDtUp(obx, ono, file, client) {
  console.log(ono, "<<< ono dt up");
  for (const [key, value] of Object.entries(obx)) {
    const values = value.split("|");
    let details = {};
    if (values[2] === "FT") {
      details = {
        test_cd: values[0],
        test_nm: values[1],
        data_type: values[2],
        result_value: null,
        unit: values[4],
        flag: values[5],
        ref_range: values[6],
        status: values[7],
        test_comment: values[8],
        authorized_by: values[9],
        authorized_date: values[10],
        department: values[11],
        method: values[13],
        result_ft: values[3],
      };
    } else {
      details = {
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
        result_ft: null,
      };
    }

    try {
      const checkResult = await client.query(
        "SELECT COUNT(*) FROM result_details WHERE ono = $1 AND test_cd = $2",
        [ono, details.test_cd]
      );

      const exists = parseInt(checkResult.rows[0].count) > 0;

      if (exists) {
        // Update existing record
        await client.query(queries.updateResultDetail, [
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
          details.result_ft,
        ]);
        console.log(
          `Database update successful for ONO ${ono}, test_cd ${details.test_cd} in file ${file}`
        );
      } else {
        // Insert new record
        await client.query(queries.addResultDetail, [
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
          details.result_ft,
        ]);
        console.log(
          `Database insert successful for ONO ${ono}, test_cd ${details.test_cd} in file ${file}`
        );
      }
    } catch (error) {
      console.error(
        `Database error for file ${file} with ONO ${ono}:`,
        error.message
      );
      throw error; // Propagate the error so the transaction can be rolled back
    }
  }
}

module.exports = resDtUp;
