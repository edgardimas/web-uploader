const { Router } = require("express");
const controller = require("./controller");

const router = Router();

router.get("/", controller.getResults);
router.get("/:ono", controller.getResultByOno);

module.exports = router;
