const { Client } = require("pg");
const client = new Client({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  port: "5432",
  database: "uploader-web",
});

client
  .connect()
  .then(() => {
    console.log("connected to postgreSQL database");
  })
  .catch((err) => {
    console.log(err);
    console.error("Error connecting to PostgreSQL database", err);
  });

client.query('SELECT * FROM "Order"', (err, result) => {
  if (err) {
    console.error("Error executing query", err);
  } else {
    console.log("Query result:", result.rows);
  }
});

// client
//   .end()
//   .then(() => {
//     console.log("Connection to PostgreSQL closed");
//   })
//   .catch((err) => {
//     console.error("Error closing connection", err);
//   });
