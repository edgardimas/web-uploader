const pool = require("../../database");

const getTMData = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM test_mapping");
    const rows = result.rows;
    console.log("yuhu");
    // Send the access_token along with the data when rendering
    const accessToken = req.headers.access_token; // Or however you have it in the request
    res.render("testmappings", { data: rows, accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving data");
  }
};

module.exports = {
  getTMData,
};
