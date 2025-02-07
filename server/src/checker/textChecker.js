const fs = require("fs");
const path = require("path");
const pool = require("../../database");

// Define the source directory (your folder)
const folderPath = path.join("C:/hcini", "queue", "HL7_out");

// Define the destination folder (temp_txt outside HL7_out)
const destDir = path.join("C:/hcini", "queue", "temp_txt");

// Ensure temp_txt folder exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Function to scan and process .txt files
async function textChecker() {
  try {
    // Read all files in the folderPath
    const files = fs.readdirSync(folderPath);

    // Filter for only .txt files
    const txtFiles = files.filter((file) => file.endsWith(".txt"));

    // if (txtFiles.length === 0) {
    //   console.log("No .txt files found.");
    //   return;
    // }

    for (const file of txtFiles) {
      const filePath = path.join(folderPath, file);

      // Read file contents
      const data = fs.readFileSync(filePath, "utf8");

      // Extract ack_control and ono using regex
      const ackControlMatch = data.match(/ack_control=(\w+)/);
      const onoMatch = data.match(/ono=([\w_]+)/);

      if (!ackControlMatch || !onoMatch) {
        console.log(`Skipping ${file}, missing required fields.`);
        continue;
      }

      const ackControl = ackControlMatch[1];
      const ono = onoMatch[1];

      console.log(
        `Processing: ${file}, ACK Control: ${ackControl}, ONO: ${ono}`
      );

      // If ack_control is "AA", update the database
      if (ackControl === "AA") {
        await updateDatabase(ono);
      }

      // Move file to temp_txt folder
      const newFilePath = path.join(destDir, file);
      fs.renameSync(filePath, newFilePath);
      console.log(`Moved ${file} to temp_txt.`);
    }
  } catch (error) {
    console.error("Error scanning files:", error);
  }
}

// Function to update the database
async function updateDatabase(ono) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "UPDATE lis_order SET is_ok = TRUE WHERE ono = $1",
      [ono]
    );
    if (result.rowCount > 0) {
      console.log(`Updated is_ok for ONO: ${ono}`);
    } else {
      console.log(`ONO: ${ono} not found in the database.`);
    }
  } catch (error) {
    console.error("Database update error:", error);
  } finally {
    client.release(); // Release connection back to the pool
  }
}

module.exports = textChecker;
