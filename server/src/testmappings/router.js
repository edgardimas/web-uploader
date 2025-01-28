const express = require("express");
const router = express.Router();
const { addTMData, editTMData } = require("./controller");
const authentication = require("../middleware/authentication");

router.post("/addtm", authentication, addTMData);
router.put("/testmappings/:his_code", authentication, editTMData);

module.exports = router;
