const { Router } = require("express");
const controller = require("./controller");

const router = Router();

router.get("/", controller.getOrderHeaders);
router.get("/:id", controller.getOrderHeaderById);
router.post("/", controller.addOrderHeader);
router.put("/:id", controller.updateOrderHeader);
router.delete("/:id", controller.removeOrderHeader);

module.exports = router;
