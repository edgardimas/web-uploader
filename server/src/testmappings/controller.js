const pool = require("../../database");

const getTMData = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM test_mapping");
    const rows = result.rows;
    res.render("testmappings", { data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving data");
  }
};

module.exports = {
  getTMData,
};
