const fs = require("fs");
const iconv = require("iconv-lite");
const path = require("path");
const parser = require("./parser");
const obxExtractor = require("./obxExtractor");
const resHdrUp = require("./resHdrUp");
const resDtUp = require("./resDtUp");

const folderPath = path.join("C:/hcini", "queue", "HL7_out");

function checkForR01Files() {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Error reading folder:", err.message);
      return;
    }

    // Filter files with ".R01" extension (case-insensitive)
    const r01Files = files.filter(
      (file) => path.extname(file).toLowerCase() === ".r01"
    );

    if (r01Files.length > 0) {
      console.log("Found .r01 file(s):", r01Files);

      // Process each .R01 file
      r01Files.forEach((file) => {
        const filePath = path.join(folderPath, file);

        // Read file contents
        fs.readFile(filePath, { encoding: "utf8" }, (err, data) => {
          if (err) {
            console.error(`Error reading file ${file}:`, err.message);
            return;
          }
          const decodedData = iconv.decode(data, "ISO-8859-1");
          const correctedData = decodedData.replace(/ýL/g, "µL");
          // Parse the file content
          const parsed = parser(correctedData);
          const obx = obxExtractor(parsed);

          // Insert into database
          resHdrUp(parsed, file);
          resDtUp(obx, parsed.ono, file);
          // Move file after successful database insert
          const sourcePath = filePath;
          const destinationPath = path.join(
            "C:/hcini",
            "queue",
            "HL7_out",
            "temp",
            file
          );

          fs.rename(sourcePath, destinationPath, (err) => {
            if (err) {
              console.error(`Error moving file ${file}:`, err.message);
              return;
            }
            console.log(`File ${file} moved successfully!`);
          });
        });
      });
    } else {
      console.log("No .r01 files found.");
    }
  });
}

module.exports = checkForR01Files;
