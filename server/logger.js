const pino = require("pino");
const dayjs = require("dayjs");
const path = require("path");
const fs = require("fs");

const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir); // Create the folder if it doesn't exist
}

const logFilePath = path.join(logDir, `${dayjs().format("YYYY-MM-DD")}.log`);

const logger = pino(
  {
    base: null,
    formatters: {
      log: (obj) => obj,
    },
    timestamp: () => `,"time":"[${dayjs().format("YYYY-MM-DD HH:mm:ss")}]"`,
  },
  pino.destination(logFilePath) // Ensure logs are directed to the file
);

module.exports = logger;
