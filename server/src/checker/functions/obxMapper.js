const pool = require("../../../database");

const obxMapper = async (obxData) => {
  try {
    const lisCodes = Object.values(obxData).map((obx) => obx.split("|")[0]);

    const hisCodes = await Promise.all(
      lisCodes.map(
        (lisCode) =>
          new Promise((resolve, reject) => {
            pool.query(
              "SELECT his_code FROM test_mapping WHERE lis_code = $1",
              [lisCode],
              (error, result) => {
                if (error) {
                  return reject(error);
                }
                // Resolve with HIS code or original LIS code if no mapping found
                resolve(result.rows.length ? result.rows[0].his_code : lisCode);
              }
            );
          })
      )
    );

    // 3️⃣ Replace LIS codes in OBX data
    const updatedOBX = {};
    Object.keys(obxData).forEach((key, index) => {
      const parts = obxData[key].split("|");
      parts[0] = hisCodes[index]; // Replace LIS code with HIS code
      updatedOBX[key] = parts.join("|"); // Reconstruct OBX string
    });

    return updatedOBX;
  } catch (error) {
    console.error("Error mapping LIS to HIS:", error);
    return null;
  }
};

module.exports = obxMapper;
