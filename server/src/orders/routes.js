const { Router } = require("express");
const controller = require("./controller");

const router = Router();

router.get("/", controller.getOrders);
router.get("/:id", controller.getOrdersById);
router.post("/", controller.addOrders);

module.exports = router;
