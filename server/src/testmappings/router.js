const express = require("express");
const router = express.Router();
const { addTMData, editTMData } = require("./controller");

router.post("/testmappings", addTMData);
router.put("/testmappings/:his_code", editTMData);

module.exports = router;
