const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

router.get("/user/:user_id", orderController.getOrderByUserID);
router.get("/items/:order_id", orderController.getItemsInOrder);

router.post("/item", orderController.addItemToOrder);
// router.post("/", orderController.createOrder);
// router.post("/item", orderController.addItemToOrder);
// router.put("/status/:order_id", orderController.updateOrderStatus);
// router.delete(
//   "/:order_id/items/:product_id",
//   orderController.removeItemFromOrder
// );

module.exports = router;
