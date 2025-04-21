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

exports.updateQuanity = (req, res) => {
  const { order_id, product_id, quantity } = req.body;
  try {
    const updatedItem = orderService.updateQuantity(
      order_id,
      product_id,
      quantity
    );
    res.json(updatedItem);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.removeItemFromOrder = (req, res) => {
  const { order_id, product_id } = req.body;

  try {
    const result = orderService.removeItemFromOrder(order_id, product_id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateStatus = (req, res) => {
  const { order_id } = req.body;

  try {
    const result = orderService.updateStatus(order_id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
