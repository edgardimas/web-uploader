const pino = require("pino");
const dayjs = require("dayjs");
const path = require("path");
const fs = require("fs");

//Ultility function to create loggers
const createLogger = (logType) => {
  const logDir = path.join(__dirname, "../../logs", logType);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  const logFilePath = path.join(
    logDir,
    `${logType}-${dayjs().format("YYYY-MM-DD")}.log`
  );

  return pino(
    {
      base: null,
      formatters: {
        log: (obj) => obj,
      },
      timestamp: () => `,"time":"[${dayjs().format("YYYY-MM-DD HH:mm:ss")}]"`,
    },
    pino.destination(logFilePath)
  );
};

// Separate loggers
const orderLogger = createLogger("orders");
const resultLogger = createLogger("results");
const errorLogger = createLogger("errors");

module.exports = { orderLogger, resultLogger, errorLogger };
