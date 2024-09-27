const { Router } = require("express");

const router = Router();
router.get("/", (req, res) => {
  req.setEncoding("using api route");
});

module.exports = router;
