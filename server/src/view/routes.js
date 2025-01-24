const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const logDirPath = path.join(__dirname, "../../logs");
const ordersCalPath = path.join(logDirPath, "orders");
const resultsCalPath = path.join(logDirPath, "results");

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

router.get("/data", (req, res) => {
  readLatestLogs("orders", (orderLogs) => {
    readLatestLogs("results", (resultLogs) => {
      res.json({ orderLogs, resultLogs });
    });
  });
});

// Route to display logs for both orders and results
router.get("/", (req, res) => {
  res.render("index");
});

router.get("/:type/realtime", (req, res) => {
  const logType = req.params.type;

  if (!["orders", "results"].includes(logType)) {
    return res.status(400).send("Invalid log type.");
  }

  readLatestLogs(logType, (logs) => {
    res.json({ logs });
  });
});

router.get("/orderlog", (req, res) => {
  fs.readdir(ordersCalPath, (err, orderFiles) => {
    if (err) {
      return res.status(500).send("Error reading orders log directory.");
    }
    const OrderlogFiles = orderFiles.filter((file) => file.endsWith(".log"));

    fs.readdir(resultsCalPath, (err, resultFiles) => {
      if (err) {
        return res.status(500).send("Error reading results log directory.");
      }
      const ResultlogFiles = resultFiles.filter((file) =>
        file.endsWith(".log")
      );

      // Combine both types of logs into one object
      const logFiles = {
        orders: OrderlogFiles,
        results: ResultlogFiles,
      };

      // Render the view with both types of logs
      res.render("logviewer", { logFiles, logs: [], currentFile: null });
    });
  });
});

router.get("/resultlog", (req, res) => {
  fs.readdir(ordersCalPath, (err, orderFiles) => {
    if (err) {
      return res.status(500).send("Error reading orders log directory.");
    }
    const OrderlogFiles = orderFiles.filter((file) => file.endsWith(".log"));

    fs.readdir(resultsCalPath, (err, resultFiles) => {
      if (err) {
        return res.status(500).send("Error reading results log directory.");
      }
      const ResultlogFiles = resultFiles.filter((file) =>
        file.endsWith(".log")
      );

      // Combine both types of logs into one object
      const logFiles = {
        orders: OrderlogFiles,
        results: ResultlogFiles,
      };

      // Render the view with both types of logs
      res.render("logviewer", { logFiles, logs: [], currentFile: null });
    });
  });
});

router.get("/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(ordersCalPath, filename);

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

    fs.readdir(ordersCalPath, (err, files) => {
      if (err) {
        return res.status(500).send("Error reading log directory.");
      }

      const logFiles = files.filter((file) => file.endsWith(".log"));
      res.render("logviewer", { logFiles, logs, currentFile: filename });
    });
  });
});
module.exports = router;
