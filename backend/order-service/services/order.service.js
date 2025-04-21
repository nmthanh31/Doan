const path = require("path");
const { readCSV, writeCSV } = require("../utils/csv");
const fileOrderPath = path.join(__dirname, "../data/orders.csv");
const fileItemPath = path.join(__dirname, "../data/order_items.csv");

const generateId = (list) => {
  return list.length > 0
    ? Math.max(...list.map((item) => parseInt(item.id))) + 1
    : 1;
};

// ✅ Lấy tất cả các đơn hàng của user
exports.getOrderByUserID = (user_id) => {
  const orders = readCSV(fileOrderPath);
  return orders.filter((order) => order.user_id === user_id);
};

// ✅ Lấy tất cả item trong 1 đơn hàng
exports.getItemsInOrder = (order_id) => {
  const items = readCSV(fileItemPath);
  return items.filter((item) => item.order_id === order_id);
};

exports.updateQuantity = (order_id, product_id, quantity = 1) => {
  const orders = readCSV(fileOrderPath);
  let orderIndex = -1;

  for (let i = 0; i < orders.length; i++) {
    if (orders[i].id == order_id) {
      orderIndex = i;
      break;
    }
  }
  if (order_id == -1) {
    return {
      message: "order not found",
    };
  }

  // console.log(orders[orderIndex]);

  const items = readCSV(fileItemPath);
  let itemId;

  let itemIndex = -1;
  for (let i = 0; i < items.length; i++) {
    if (items[i].product_id == product_id && items[i].order_id == order_id) {
      itemIndex = i;
      break;
    }
  }

  if (itemIndex == -1) {
    return {
      message: "item not found",
    };
  }

  items[itemIndex].quantity = parseInt(items[itemIndex].quantity) + quantity;

  let isDone = false;
  if (items[itemIndex].quantity <= 0) {
    itemId = items[itemIndex].id;
    items.splice(itemIndex, 1);
    isDone = true;
  }

  // console.log("item quantity", items[itemIndex].quantity);
  // console.log("order total", orders[orderIndex].total);

  writeCSV(fileItemPath, items);
  orders[orderIndex].total = this.calculateTotal(order_id);
  writeCSV(fileOrderPath, orders);

  // console.log("new order total", orders[orderIndex].total);

  if (isDone) {
    return {
      message: "delete",
      id: itemId,
    };
  }
  return {
    message: "update",
    item: items[itemIndex],
    id: items[itemIndex].id,
  };
};

// Thêm đơn hàng vào giỏ hàng
exports.addItemToOrder = (user_id, product_id, product_price) => {
  const orders = readCSV(fileOrderPath);
  let order_id = -1;
  let orderIndex = -1;

  for (let i = 0; i < orders.length; i++) {
    if (orders[i].user_id == user_id && orders[i].status == "incart") {
      order_id = orders[i].id;
      orderIndex = i;
      break;
    }
  }
  if (order_id == -1) {
    order_id = generateId(orders);
    const newOrder = {
      id: order_id,
      user_id,
      total: 0,
      status: "incart",
      created_at: new Date().toISOString(),
    };

    orders.push(newOrder);
  }

  console.log("order old total", orders[orderIndex].total);

  const items = readCSV(fileItemPath);
  // console.log("product_id", product_id, "order_id", order_id);

  let itemIndex = -1;
  for (let i = 0; i < items.length; i++) {
    if (items[i].product_id == product_id && items[i].order_id == order_id) {
      itemIndex = i;
      break;
    }
  }

  if (itemIndex !== -1) {
    items[itemIndex].quantity = parseInt(items[itemIndex].quantity) + 1;
    writeCSV(fileItemPath, items);
    orders[orderIndex].total =
      parseInt(orders[orderIndex].total) + parseInt(product_price);
    writeCSV(fileOrderPath, orders);
    // console.log("newItem price", newItem.price);

    console.log("new order total", orders[orderIndex].total);
    return items[itemIndex];
  }

  const newItem = {
    id: generateId(items),
    order_id,
    product_id,
    quantity: 1,
    price: product_price,
  };
  items.push(newItem);
  writeCSV(fileItemPath, items);
  orders[orderIndex].total =
    parseInt(orders[orderIndex].total) + parseInt(product_price);
  writeCSV(fileOrderPath, orders);

  console.log("newItem price", newItem.price);

  console.log("new order total", orders[orderIndex].total);

  return newItem;
};

exports.calculateTotal = (order_id) => {
  const orders = readCSV(fileOrderPath);
  let orderIndex = -1;

  for (let i = 0; i < orders.length; i++) {
    if ((orders[i].id == order_id, orders[i].status == "incart")) {
      orderIndex = i;
      break;
    }
  }
  if (order_id == -1) {
    console.log("order not found");
    return {
      message: "eo có đơn hàng này trong giỏ hàng",
    };
  }

  const items = readCSV(fileItemPath);
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i].order_id == order_id) {
      total += parseInt(items[i].price) * parseInt(items[i].quantity);
    }
  }

  orders[orderIndex].total = total;
  writeCSV(fileOrderPath, orders);

  return total;
};

exports.removeItemFromOrder = (order_id, product_id) => {
  const orders = readCSV(fileOrderPath);
  let orderIndex = -1;

  for (let i = 0; i < orders.length; i++) {
    if (orders[i].id == order_id) {
      orderIndex = i;
      break;
    }
  }
  if (order_id == -1) {
    return {
      message: "order not found",
    };
  }

  const items = readCSV(fileItemPath);
  let itemId;

  let itemIndex = -1;
  for (let i = 0; i < items.length; i++) {
    if (items[i].product_id == product_id && items[i].order_id == order_id) {
      itemIndex = i;
      break;
    }
  }

  if (itemIndex == -1) {
    return {
      message: "item not found",
    };
  }

  itemId = items[itemIndex].id;

  items.splice(itemIndex, 1);

  writeCSV(fileItemPath, items);
  orders[orderIndex].total = this.calculateTotal(order_id);
  writeCSV(fileOrderPath, orders);
  return {
    message: "delete",
    id: itemId,
  };
};

exports.updateStatus = (order_id) => {
  console.log("update order status", order_id);

  const orders = readCSV(fileOrderPath);
  let orderIndex = -1;

  for (let i = 0; i < orders.length; i++) {
    if (orders[i].id == order_id) {
      orderIndex = i;
      break;
    }
  }
  if (order_id == -1) {
    return {
      message: "order not found",
    };
  }
  console.log("old order", orders[orderIndex]);

  orders[orderIndex].status = "completed";

  console.log("new order", orders[orderIndex]);
  writeCSV(fileOrderPath, orders);

  return {
    message: "updated",
    order: orders[orderIndex],
  };
};
