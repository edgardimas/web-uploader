const addResult = `INSERT INTO results (ono,lno,site,pid,apid,name,address1,address2,address3,address4,ptype,birth_dt,sex,mobile_phone,email,source_cd,source_nm,room_no,clinician_cd,clinician_nm,priority,diagnose,pstatus,visitno,comment)
                    values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)`;

module.exports = { addResult };
