const pool = require("../../../database");
const queries = require("../queries/queries");

async function resHdrUp(parsed, file, client) {
  console.log(parsed.ono, "<<< ono hdr up");

  try {
    const checkResult = await client.query(
      "SELECT COUNT(*) FROM result_headers WHERE ono = $1",
      [parsed.ono]
    );

    const exists = parseInt(checkResult.rows[0].count) > 0;

    if (exists) {
      // Update existing record
      await client.query(queries.updateResultHeader, [
        parsed.lno,
        parsed.site,
        parsed.pid,
        parsed.apid,
        parsed.name,
        parsed.address1,
        parsed.address2,
        parsed.address3,
        parsed.address4,
        parsed.ptype,
        parsed.birth_dt,
        parsed.sex,
        parsed.mobile_phone,
        parsed.email,
        parsed.source_cd,
        parsed.source_nm,
        parsed.room_no,
        parsed.clinician_cd,
        parsed.clinician_nm,
        parsed.priority,
        parsed.diagnose,
        parsed.pstatus,
        parsed.visitno,
        parsed.comment,
        parsed.ono, // WHERE condition
      ]);
      console.log(
        `Database update successful for ONO ${parsed.ono} in file ${file}`
      );
    } else {
      // Insert new record
      await client.query(queries.addResultHeader, [
        parsed.ono,
        parsed.lno,
        parsed.site,
        parsed.pid,
        parsed.apid,
        parsed.name,
        parsed.address1,
        parsed.address2,
        parsed.address3,
        parsed.address4,
        parsed.ptype,
        parsed.birth_dt,
        parsed.sex,
        parsed.mobile_phone,
        parsed.email,
        parsed.source_cd,
        parsed.source_nm,
        parsed.room_no,
        parsed.clinician_cd,
        parsed.clinician_nm,
        parsed.priority,
        parsed.diagnose,
        parsed.pstatus,
        parsed.visitno,
        parsed.comment,
      ]);
      console.log(
        `Database insert for result header successful for ONO ${parsed.ono} in file ${file}`
      );
    }
  } catch (error) {
    console.error(
      `Database error for ONO ${parsed.ono} in file ${file}:`,
      error.message
    );
    throw error; // Ensure the error is thrown so that the transaction can be rolled back
  }
}

module.exports = resHdrUp;
