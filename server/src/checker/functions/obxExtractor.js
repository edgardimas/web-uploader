function extractObxData(data) {
  return Object.keys(data)
    .filter((key) => key.startsWith("obx"))
    .reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {});
}

module.exports = extractObxData;
