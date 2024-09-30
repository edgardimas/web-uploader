const { Router } = require("express");
const controller = require("./controller");

const router = Router();

router.get("/", controller.getOrderHeaders);
router.get("/:id", controller.getOrderHeaderById);
router.post("/", controller.addOrderHeader);
// router.delete("/:id", controller.deleteOrders);

module.exports = router;
