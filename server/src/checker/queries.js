const addResultHeader = `INSERT INTO result_headers 
                        (ono,lno,site,pid,apid,name,address1,address2,address3,address4,ptype,birth_dt,sex,mobile_phone,email,source_cd,source_nm,room_no,clinician_cd,clinician_nm,priority,diagnose,pstatus,visitno,comment)
                        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)`;
const addResultDetail = `INSERT INTO result_details 
                        (test_cd,test_nm,data_type,result_value,unit,flag,ref_range,status,test_comment,method,specimen_cd,specimen_nm,specimen_by_cd,specimen_by_nm,specimen_dt,release_by_cd,release_by_nm,release_on,authorise_by_cd,authorise_by_nm,authorise_on,phoned_by_cd,phoned_by_nm,phoned_on,disp_seq,order_testid,order_testnm,test_group,item_parent,ono) 
                        values 
                        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30)`;

module.exports = { addResultHeader };
