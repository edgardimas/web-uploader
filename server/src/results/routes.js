const { Router } = require("express");
const controller = require("./controller");

const router = Router();

router.get("/", controller.getResults);
router.get("/:id", controller.getResultById);

module.exports = router;
