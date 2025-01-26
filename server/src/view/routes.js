const express = require("express");
const fs = require("fs");
const path = require("path");

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

const readLogs = (logtype, callback) => {
  const Dir = path.join(logDirPath, logtype);

  if (!fs.existsSync(Dir)) {
    return callback([]);
  }
  const files = fs.readdirSync(Dir).filter((file) => file.endsWith(".log"));
  callback(files);
};

const readLogFile = (logType, fileName, callback) => {
  const filePath = path.join(logDirPath, logType, fileName);
  if (!fs.existsSync(filePath)) {
    return callback([]);
  }

  fs.readFile(filePath, "utf-8", (err, data) => {
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

    callback(logs);
  });
};

// Route to display logs for both orders and results
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

module.exports = router;
