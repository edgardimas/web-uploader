const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  databse: "uploader-web",
  password: "postgres",
  port: 5432,
});

module.exports = pool;
