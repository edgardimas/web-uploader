const fs = require("fs").promises;
const iconv = require("iconv-lite");
const path = require("path");
const parser = require("./functions/parser");
const obxExtractor = require("./functions/obxExtractor");
const resHdrUp = require("./functions/resHdrUp");
const resDtUp = require("./functions/resDtUp");
const { orderLogger, resultLogger } = require("../helpers/logger");
const obxMapper = require("./functions/obxMapper");
const folderPath = path.join("C:/hcini", "queue", "HL7_out");
const pool = require("../../database");
let currentState = 0;

async function checkForR01Files() {
  try {
    const files = await fs.readdir(folderPath);
    // Filter to get only .r01 files
    const r01Files = files.filter(
      (file) => path.extname(file).toLowerCase() === ".r01"
    );

    if (r01Files.length > 0) {
      // Get file stats and sort by creation date (oldest first)
      const fileStats = await Promise.all(
        r01Files.map(async (file) => {
          const filePath = path.join(folderPath, file);
          const stats = await fs.stat(filePath);
          return { file, filePath, birthtime: stats.birthtime };
        })
      );

      // Sort files by creation date
      fileStats.sort((a, b) => a.birthtime - b.birthtime);
      console.log(fileStats);

      const oldestFile = fileStats[0]; // Pick the oldest file
      const client = await pool.connect();
      try {
        // Wait for 2 seconds before processing
        const now = new Date();
        const age = now - oldestFile.birthtime;
        if (age < 2000) {
          console.log("wait", age);
          await new Promise((resolve) => setTimeout(resolve, 2000 - age));
        }
        console.log("continue", age);
        // Read the file content
        const data = await fs.readFile(oldestFile.filePath, {
          encoding: "utf8",
        });

        // Decode and process the data
        const decodedData = iconv.decode(data, "ISO-8859-1");
        const correctedData = decodedData.replace(/ýL/g, "µL");
        const parsed = parser(correctedData);
        const obx = obxExtractor(parsed);
        const mappedObx = await obxMapper(obx);

        await client.query("BEGIN");
        await resHdrUp(parsed, oldestFile.file, client);
        await resDtUp(mappedObx, parsed.ono, oldestFile.file, client);
        await client.query("COMMIT");
        // Move the file after processing
        const destinationPath = path.join(
          "C:/hcini",
          "queue",
          "HL7_out",
          "temp",
          oldestFile.file
        );
        await fs.rename(oldestFile.filePath, destinationPath);

        console.log(
          `File ${oldestFile.file} processed and moved successfully!`
        );
        currentState = 0;
      } catch (fileErr) {
        await client.query("ROLLBACK");

        console.error(
          `Error processing file ${oldestFile.file}:`,
          fileErr.message
        );
      }
    } else {
      if (currentState === 0) {
        resultLogger.info("No R01 Found");
        currentState = 1;
      }
    }
  } catch (err) {
    console.error("Error reading folder:", err.message);
    resultLogger.info(`Error reading folder: ${err.message}`);
  }
}

module.exports = checkForR01Files;
