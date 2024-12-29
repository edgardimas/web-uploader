const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const sampleData = {
    title: "Viewer Example",
    message: "Welcome to the viewer Route",
    timestamp: new Date().toLocaleString(),
  };
  res.render("index", sampleData);
});

module.exports = router;
