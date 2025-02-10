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
let currentState = 0;

async function checkForR01Files() {
  try {
    // Read the folder contents asynchronously
    const files = await fs.readdir(folderPath);

    // Filter the files to get only .r01 files
    const r01Files = files.filter(
      (file) => path.extname(file).toLowerCase() === ".r01"
    );

    if (r01Files.length > 0) {
      resultLogger.info(`Found .r01 file(s): ${r01Files}`);

      // Process each file
      for (const file of r01Files) {
        const filePath = path.join(folderPath, file);
        try {
          // Read the file content
          const data = await fs.readFile(filePath, { encoding: "utf8" });

          // Decode and correct the data
          const decodedData = iconv.decode(
            Buffer.from(data, "utf8"),
            "ISO-8859-1"
          );
          const correctedData = decodedData.replace(/ýL/g, "µL");

          // Parse and extract necessary data
          const parsed = parser(correctedData);
          const obx = obxExtractor(parsed);
          const mappedObx = await obxMapper(obx);
          // Update the records
          await resHdrUp(parsed, file);
          await resDtUp(mappedObx, parsed.ono, file);

          // Move the file to the new destination
          const destinationPath = path.join(
            "C:/hcini",
            "queue",
            "HL7_out",
            "temp",
            file
          );
          await fs.rename(filePath, destinationPath);

          console.log(`File ${file} moved successfully!`);
          currentState = 0;
        } catch (fileErr) {
          console.error(`Error processing file ${file}:`, fileErr.message);
        }
      }
    } else {
      if (currentState == 0) {
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
