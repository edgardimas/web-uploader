const express = require("express");
const fs = require("fs");
const path = require("path");
const { getTMData } = require("../testmappings/controller");
const { login } = require("../users/controller");
const router = express.Router();
const logDirPath = path.join(__dirname, "../../logs");
const ordersDirPath = path.join(logDirPath, "orders");
const resultsDirPath = path.join(logDirPath, "results");

const readLatestLogs = (logType, callback) => {
  const logDir = path.join(logDirPath, logType);

  if (!fs.existsSync(logDir)) {
    return callback([]);
  }

  const files = fs
    .readdirSync(logDir)
    .filter((file) => file.endsWith(".log"))
    .sort()
    .reverse();
  if (files.length === 0) {
    return callback([]);
  }

  const latestFile = path.join(logDir, files[0]);
  fs.readFile(latestFile, "utf-8", (err, data) => {
    if (err) {
      return callback([]);
    }

    const logs = data
      .split("\n")
      .filter((line) => line)
      .map((line) => {
        try {
          const parsed = JSON.parse(line);
          return { time: parsed.time, msg: parsed.msg || "Invalid log entry" };
        } catch {
          return { time: "Invalid time", msg: "Invalid log entry" };
        }
      });

    callback(logs.slice(-5)); // Return the last 5 log entries
  });
};

router.get("/data", (req, res) => {
  readLatestLogs("orders", (orderLogs) => {
    readLatestLogs("results", (resultLogs) => {
      res.json({ orderLogs, resultLogs });
    });
  });
});

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/orderlogs", (req, res) => {
  fs.readdir(ordersDirPath, (err, files) => {
    if (err) {
      return res.status(500).send("Error reading log directory.");
    }
    const logFiles = files.filter((file) => file.endsWith(".log"));
    res.render("orderlogs", { logFiles, logs: [], currentFile: null });
  });
});

router.get("/resultlogs", (req, res) => {
  fs.readdir(resultsDirPath, (err, files) => {
    if (err) {
      return res.status(500).send("Error reading log directory.");
    }
    const logFiles = files.filter((file) => file.endsWith(".log"));
    res.render("resultlogs", { logFiles, logs: [], currentFile: null });
  });
});

router.get("/orders/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(ordersDirPath, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Log file not found.");
  }

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading log file.");
    }

    const logs = data
      .split("\n")
      .filter((line) => line)
      .map((line) => {
        try {
          const parsed = JSON.parse(line);
          return { time: parsed.time, msg: parsed.msg || "Invalid log entry" };
        } catch {
          return { time: "Invalid time", msg: "Invalid log entry" };
        }
      });

    fs.readdir(ordersDirPath, (err, files) => {
      if (err) {
        return res.status(500).send("Error reading log directory.");
      }

      const logFiles = files.filter((file) => file.endsWith(".log"));
      res.render("orderlogs", { logFiles, logs, currentFile: filename });
    });
  });
});

router.get("/results/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(resultsDirPath, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Log file not found.");
  }

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading log file.");
    }

    const logs = data
      .split("\n")
      .filter((line) => line)
      .map((line) => {
        try {
          const parsed = JSON.parse(line);
          return { time: parsed.time, msg: parsed.msg || "Invalid log entry" };
        } catch {
          return { time: "Invalid time", msg: "Invalid log entry" };
        }
      });

    fs.readdir(resultsDirPath, (err, files) => {
      if (err) {
        return res.status(500).send("Error reading log directory.");
      }

      const logFiles = files.filter((file) => file.endsWith(".log"));
      res.render("resultlogs", { logFiles, logs, currentFile: filename });
    });
  });
});

router.get("/testmappings", getTMData);

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", login);

module.exports = router;
