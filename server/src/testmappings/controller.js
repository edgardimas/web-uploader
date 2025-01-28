const pool = require("../../database");

const getTMData = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM test_mapping");
    const rows = result.rows;
    // const accessToken = req.headers.access_token;
    res.render("testmappings", { data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving data");
  }
};

const addTMData = async (req, res, next) => {
  console.log(req.user, "<<<<<< requeser");
  try {
    const { his_code, lis_code } = req.body;
    const updated_by = req.user.username;
    if (!his_code || !lis_code || !updated_by) {
      return res.status(400).send("All fields are required.");
    }
    const query = `
        INSERT INTO test_mapping (his_code, lis_code, updated_by) 
        VALUES($1, $2, $3)
    `;
    const values = [his_code, lis_code, updated_by];
    const result = await pool.query(query, values);
    res.status(201).send({
      message: "Test mapping data added successfully.",
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

const editTMData = async (req, res, next) => {
  try {
    const { his_code } = req.params;
    const { lis_code, updated_by } = req.body;
    if (!lis_code || !updated_by) {
      return res
        .status(400)
        .send("Both 'lis_code' and 'updated_by' fields are required.");
    }
    const findQuery = "SELECT * FROM test_mapping WHERE his_code = $1";
    const findResult = await pool.query(findQuery, [his_code]);
    if (findResult.rows.length === 0) {
      return res
        .status(404)
        .send({ message: `No test mapping found for his_code: ${his_code}` });
    }
    const updateQuery = `
        UPDATE test_mapping
        SET lis_code = $1, updated_by = $2
        WHERE his_code = $3
    `;
    const values = [lis_code, updated_by, his_code];
    const updateResult = await pool.query(updateQuery, values);
    res.status(200).send({
      message: "Test mapping data updated successfully.",
      data: updateResult.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTMData,
  addTMData,
  editTMData,
};
