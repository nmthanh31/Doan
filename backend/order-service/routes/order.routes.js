const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

router.get("/user/:user_id", orderController.getOrderByUserID);
router.get("/items/:order_id", orderController.getItemsInOrder);
router.post("/item", orderController.addItemToOrder);
router.delete("/item/delete-item", orderController.removeItemFromOrder);
router.patch("/item/update-quantity", orderController.updateQuanity);
router.patch("/order/update-status", orderController.updateStatus);

module.exports = router;
