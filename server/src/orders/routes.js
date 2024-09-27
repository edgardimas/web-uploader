const { Router } = require("express");
const controller = require("./controller");

const router = Router();

router.get("/", controller.getOrders);

module.exports = router;
