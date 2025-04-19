const orderService = require("../services/order.service");

exports.getOrderByUserID = (req, res) => {
  const user_id = req.params.user_id;
  const orders = orderService.getOrderByUserID(user_id);
  res.json(orders);
};

exports.getItemsInOrder = (req, res) => {
  const order_id = req.params.order_id;
  const items = orderService.getItemsInOrder(order_id);
  res.json(items);
};

exports.addItemToOrder = (req, res) => {
  const { user_id, product_id, product_price } = req.body;
  try {
    const newItem = orderService.addItemToOrder(
      user_id,
      product_id,
      product_price
    );
    return res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  res.status(201);
};

// ✅ Tạo mới đơn hàng (status mặc định: incart)
// exports.createOrder = (req, res) => {
//   const { user_id, total } = req.body;

//   try {
//     const newOrder = orderService.createOrder(user_id, total);
//     res.status(201).json(newOrder);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ✅ Thêm sản phẩm vào đơn hàng
// exports.addItemToOrder = (req, res) => {
//   const { order_id } = req.params;
//   const { product_id } = req.body;

//   try {
//     const newItem = orderService.addItemToOrder(order_id, product_id);
//     res.status(201).json(newItem);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// // ✅ Cập nhật trạng thái đơn hàng
// exports.updateOrderStatus = (req, res) => {
//   const { order_id } = req.params;
//   const { status } = req.body;

//   try {
//     const updatedOrder = orderService.updateOrderStatus(order_id, status);
//     res.json(updatedOrder);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// exports.removeItemFromOrder = (req, res) => {
//   const { order_id, product_id } = req.params;

//   try {
//     orderService.removeItemFromOrder(order_id, product_id);
//     res.status(200).json({ message: "Item removed successfully" });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };
