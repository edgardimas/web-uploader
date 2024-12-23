const fs = require("fs");
const path = require("path");
const parser = require("./parser");
const pool = require("../../database");
const queries = require("./queries");
const obxExtractor = require("./obxExtractor");

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
        fs.readFile(filePath, "utf8", (err, data) => {
          if (err) {
            console.error(`Error reading file ${file}:`, err.message);
            return;
          }

          // Parse the file content
          const parsed = parser(data);
          const obx = obxExtractor(parsed);

          // Insert into database
          pool.query(
            queries.addResultHeader,
            [
              parsed.ono,
              parsed.lno,
              parsed.site,
              parsed.pid,
              parsed.apid,
              parsed.name,
              parsed.address1,
              parsed.address2,
              parsed.address3,
              parsed.address4,
              parsed.ptype,
              parsed.birth_dt,
              parsed.sex,
              parsed.mobile_phone,
              parsed.email,
              parsed.source_cd,
              parsed.source_nm,
              parsed.room_no,
              parsed.clinician_cd,
              parsed.clinician_nm,
              parsed.priority,
              parsed.diagnose,
              parsed.pstatus,
              parsed.visitno,
              parsed.comment,
            ],
            (error) => {
              if (error) {
                console.error(
                  `Database error for file ${file}:`,
                  error.message
                );
                return;
              }

              console.log(`Database insert successful for file ${file}`);

              // Move file after successful database insert
              const sourcePath = filePath;
              const destinationPath = path.join(
                "C:/hcini",
                "queue",
                "HL7_out",
                "temp",
                file
              );

              // fs.rename(sourcePath, destinationPath, (err) => {
              //   if (err) {
              //     console.error(`Error moving file ${file}:`, err.message);
              //     return;
              //   }
              //   console.log(`File ${file} moved successfully!`);
              // });
            }
          );
        });
      });
    } else {
      console.log("No .r01 files found.");
    }
  });
}

module.exports = checkForR01Files;
