const fs = require("fs");
const iconv = require("iconv-lite");
const path = require("path");
const parser = require("./parser");
const obxExtractor = require("./obxExtractor");
const resHdrUp = require("./resHdrUp");
const resDtUp = require("./resDtUp");
const { orderLogger, resultLogger } = require("../helper/logger");
const folderPath = path.join("C:/hcini", "queue", "HL7_out");
let currentState = 0;

function checkForR01Files() {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      resultLogger.info(`Error reading folder: ${err.message}`);
      return;
    }
    const r01Files = files.filter(
      (file) => path.extname(file).toLowerCase() === ".r01"
    );

    if (r01Files.length > 0) {
      resultLogger.info(`Found .r01 file(s): ${r01Files}`);

      r01Files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        fs.readFile(filePath, { encoding: "utf8" }, (err, data) => {
          if (err) {
            console.error(`Error reading file ${file}:`, err.message);
            return;
          }
          const decodedData = iconv.decode(data, "ISO-8859-1");
          const correctedData = decodedData.replace(/ýL/g, "µL");
          const parsed = parser(correctedData);
          const obx = obxExtractor(parsed);
          resHdrUp(parsed, file);
          resDtUp(obx, parsed.ono, file);
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
            currentState = 0;
          });
        });
      });
    } else {
      if (currentState == 0) {
        resultLogger.info("No R01 Found");
        currentState = 1;
      }
    }
  });
}

module.exports = checkForR01Files;
