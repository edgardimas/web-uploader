const fs = require("fs");
const path = require("path");
const pool = require("../../database");

const folderPath = path.join("C:/hcini", "queue", "error");
const destDir = path.join("C:/hcini", "queue", "temp_err");

// Ensure temp_err folder exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

async function errChecker() {
  try {
    const files = fs.readdirSync(folderPath);
    const txtFiles = files.filter((file) => file.endsWith(".txt"));

    for (const file of txtFiles) {
      const filePath = path.join(folderPath, file);
      const data = fs.readFileSync(filePath, "utf8");

      // Extract information
      const ackControlMatch = data.match(/ack_control=(\w+)/);
      const onoMatch = data.match(/ono=([\w_]+)/);
      const errorMatch = data.match(/error=([\s\S]+)/);

      if (!ackControlMatch || !onoMatch || !errorMatch) {
        console.log(`Skipping ${file}, missing required fields.`);
        continue;
      }

      const ackControl = ackControlMatch[1];
      const ono = onoMatch[1];
      const error_msg = errorMatch[1];

      console.log(
        `Processing: ${file}, ACK Control: ${ackControl}, ONO: ${ono}`
      );

      // Store error in the database and move the file
      if (ackControl === "AR") {
        await storeErrorInDatabase(ono, error_msg, data); // Save full file content
        const newFilePath = path.join(destDir, file);
        fs.renameSync(filePath, newFilePath);
        console.log(`Moved ${file} to temp_err.`);
      }
    }
  } catch (error) {
    console.error("Error processing files:", error);
  }
}

// Function to store error details in the database
async function storeErrorInDatabase(ono, error_msg, fileContent) {
  const client = await pool.connect();
  try {
    await client.query(
      `INSERT INTO ono_errors (ono, error_msg, error_file) 
       VALUES ($1, $2, $3)`,
      [ono, error_msg, fileContent] // Store full file content in err_data
    );
    console.log(`Inserted error record for ONO: ${ono}`);
  } catch (error) {
    console.error("Database insert error:", error);
  } finally {
    client.release();
  }
}

module.exports = errChecker;
