const { Router } = require("express");
const controller = require("./controller");

const router = Router();

router.get("/", controller.getOrders);
router.get("/:id", controller.getOrderById);
router.post("/", controller.addOrder);
router.put("/:id", controller.updateOrder);
router.delete("/:id", controller.removeOrder);

module.exports = router;
