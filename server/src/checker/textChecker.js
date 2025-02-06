const fs = require("fs");
const path = require("path");
const pool = require("../../database");

// Define directories
const sourceDir = path.join(__dirname); // Current directory
const destDir = path.join(__dirname, "temp_txt"); // Moves files one level up

// Ensure temp_txt folder exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

async function textChecker() {
  try {
    const files = fs.readdirSync(sourceDir);
    const txtFiles = files.filter((file) => file.endsWith(".txt"));

    for (const file of txtFiles) {
      const filePath = path.join(sourceDir, file);
      const data = fs.readFileSync(filePath, "utf8");
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

      if (ackControl === "AA") {
        await updateDatabase(ono);
      }
      const newFilePath = path.join(destDir, file);
      fs.renameSync(filePath, newFilePath);
      console.log(`Moved ${file} to temp_txt.`);
    }
  } catch (error) {
    console.error("Error scanning files:", error);
  }
}

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
