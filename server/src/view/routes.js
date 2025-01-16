const express = require("express");
const router = express.Router();
const logger = require("../../logger");

let logs = [];
setInterval(() => {
  console.log("Current Logs: ", logs);
}, 1000);

logger.on("log", (message) => {
  logs.push(message);

  if (logs.length > 5) {
    logs.shift();
  }
});

router.get("/", (req, res) => {
  const sampleData = {
    title: "Uploader Viewer",
    timestamp: new Date().toLocaleString(),
    logs: logs,
  };

  res.render("index", sampleData);
});

module.exports = router;
