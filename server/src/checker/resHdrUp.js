const pool = require("../../database");
const queries = require("./queries");

function resHdrUp(parsed, file) {
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
    (error) => {
      if (error) {
        console.error(`Database error for file ${file}:`, error.message);
        return;
      }

      console.log(`Database insert successful for file ${file}`);
    }
  );
}

module.exports = resHdrUp;
