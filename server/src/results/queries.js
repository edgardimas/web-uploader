const getResults = `Select * From result_headers`;

const getResultByOno = `
  SELECT 
    result_headers.*, 
    jsonb_agg(
      result_details
    ) AS result_details_data
  FROM result_headers
  LEFT JOIN result_details 
    ON result_headers.ono = result_details.ono
  WHERE result_headers.ono = $1
  GROUP BY result_headers.ono
`;

module.exports = {
  getResults,
  getResultByOno,
};
