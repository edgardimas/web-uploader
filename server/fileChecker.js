const fs = require("fs");
const path = require("path");

const folderPath = path.join("C:/hcini", "queue", "HL7_out");

function checkForR01Files() {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Error reading folder: ", err);
      return;
    }
    const r01Files = files.filter((file) => path.extname(file) === ".R01");
    console.log(r01Files[0], "<<<<<<");
    function readFile(folderP) {
      try {
        const data = fs.readFileSync(folderP);
        return data.toString();
      } catch (error) {
        console.error(`Got an error trying to read the file: ${error.message}`);
      }
    }
    const input = readFile(`${folderPath}/${r01Files[0]}`);

    console.log(typeof input);
    if (r01Files.length > 0) {
      console.log("Found .r01 file(s):", r01Files);
    } else {
      console.log("No .r01 files found.");
    }
  });
}

module.exports = checkForR01Files;
