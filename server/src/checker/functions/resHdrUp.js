const pool = require("../../../database");
const queries = require("../queries/queries");

function resHdrUp(parsed, file) {
  pool.query(
    "SELECT COUNT(*) FROM result_headers WHERE ono = $1",
    [parsed.ono],
    (error, results) => {
      if (error) {
        console.error(
          `Database error checking ONO ${parsed.ono} for file ${file}:`,
          error.message
        );
        return;
      }

      const exists = parseInt(results.rows[0].count) > 0;

      if (exists) {
        // Update existing record
        pool.query(
          queries.updateResultHeader, // You need to define this in your queries file
          [
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
          ],
          (updateError) => {
            if (updateError) {
              console.error(
                `Database update error for ONO ${parsed.ono} in file ${file}:`,
                updateError.message
              );
            } else {
              console.log(
                `Database update successful for ONO ${parsed.ono} in file ${file}`
              );
            }
          }
        );
      } else {
        // Insert new record
        pool.query(
          queries.addResultHeader,
          [
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
          ],
          (insertError) => {
            if (insertError) {
              console.error(
                `Database insert error for file ${file}:`,
                insertError.message
              );
            } else {
              console.log(
                `Database insert successful for ONO ${parsed.ono} in file ${file}`
              );
            }
          }
        );
      }
    }
  );
}

module.exports = resHdrUp;
