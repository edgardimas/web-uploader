const addResultHeader = `INSERT INTO result_headers 
                        (ono,lno,site,pid,apid,name,address1,address2,address3,address4,ptype,birth_dt,sex,mobile_phone,email,source_cd,source_nm,room_no,clinician_cd,clinician_nm,priority,diagnose,pstatus,visitno,comment)
                        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)`;
const addResultDetail = `INSERT INTO result_details 
                        (test_cd,test_nm,data_type,result_value,unit,flag,ref_range,status,test_comment,authorized_by,authorized_date,department,method,ono) 
                        values 
                        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`;

const updateResultHeader = `UPDATE result_headers
                            SET lno = $1, site = $2, pid = $3, apid = $4, name = $5, address1 = $6, address2 = $7, 
                            address3 = $8, address4 = $9, ptype = $10, birth_dt = $11, sex = $12, mobile_phone = $13, 
                            email = $14, source_cd = $15, source_nm = $16, room_no = $17, clinician_cd = $18, 
                            clinician_nm = $19, priority = $20, diagnose = $21, pstatus = $22, visitno = $23, comment = $24
                            WHERE ono = $25;`;

const updateResultDetail = `UPDATE result_details
                            SET test_nm = $1, data_type = $2, result_value = $3, unit = $4, flag = $5, 
                            ref_range = $6, status = $7, test_comment = $8, authorized_by = $9, 
                            authorized_date = $10, department = $11, method = $12
                            WHERE ono = $13 AND test_cd = $14;`;
module.exports = {
  addResultHeader,
  addResultDetail,
  updateResultHeader,
  updateResultDetail,
};
