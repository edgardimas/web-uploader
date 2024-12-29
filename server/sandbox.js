const mysql = require("mysql2");

// Your data object
const data = {
  obx1: "HB|Hemoglobin|NM|12.0|g/dL|N|RNF|F||SA^SYSTEM ADMINISTRATOR|20241223150729|ALL^ALL||Cyan",
  obx2: "WBC|Jumlah Leukosit|NM|3.00|10^3/�L|N|RNF|F||SA^SYSTEM ADMINISTRATOR|20241223150729|ALL^ALL||DCDM",
  // ... (other entries)
  obx30:
    "GLUU|Glukosa (urin)|ST|Negative||N|(-) Negatif|F||SA^SYSTEM ADMINISTRATOR|20241223151229|ALL^ALL||CC",
};

// Create a MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "your_username",
  password: "your_password",
  database: "your_database",
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database.");
});

// Function to insert data
const insertData = (key, value) => {
  const values = value.split("|"); // Split the string by '|'

  // Prepare the SQL query (adjust according to your table structure)
  const sql =
    "INSERT INTO your_table_name (column1, column2, column3, column4, column5, column6, column7, column8, column9, column10, column11, column12, column13) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  // Execute the query
  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error inserting data:", err);
    } else {
      console.log(`Inserted data for ${key}:`, results.insertId);
    }
  });
};

// Iterate over the data object and insert each entry
for (const [key, value] of Object.entries(data)) {
  insertData(key, value);
}

// Close the connection after all inserts
connection.end((err) => {
  if (err) {
    console.error("Error closing the connection:", err);
  } else {
    console.log("Connection closed.");
  }
});
