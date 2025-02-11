const { Router } = require("express");
const controller = require("./controller");

const router = Router();

router.get("/", controller.getOrders);
router.get("/:id", controller.getOrderByOno);
router.post("/", controller.addOrder);
router.post("/error-edit", controller.errorEdit);
router.patch("/:ono", controller.updateOrder);
router.delete("/:ono", controller.removeOrder);

module.exports = router;
