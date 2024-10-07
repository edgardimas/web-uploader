const getResults = `SELECT 
  r.name,
  JSON_AGG(
    JSON_BUILD_OBJECT(
      'test_cd', rd.test_cd,
      'result_value', rd.result_value,
      'unit', rd.unit,
      'flag', rd.flag,
      'ref_range', rd.ref_range,
      'status', rd.status
    )
  ) AS tests
FROM 
  results r
LEFT JOIN 
  result_details rd
ON 
  r.ono = rd.ono
WHERE 
  r.ono = '68516'  -- You can adjust this condition based on your needs
GROUP BY 
  r.name;`;
const getResultById = `SELECT * FROM results WHERE id = $1`;

module.exports = {
  getResults,
  getResultById,
};
