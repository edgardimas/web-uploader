const fs = require("fs");
const path = require("path");

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

      // Read each .R01 file's content
      r01Files.forEach((file) => {
        const filePath = path.join(folderPath, file); // Correct file path

        fs.readFile(filePath, "utf8", (err, data) => {
          if (err) {
            console.error(`Error reading file ${file}:`, err.message);
            return;
          }
          console.log(`Contents of ${file}:\n${data}`);
        });
      });
    } else {
      console.log("No .r01 files found.");
    }
  });
}

module.exports = checkForR01Files;
