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
  const items = readCSV(fileItemPath);
  const itemIndex = items.findIndex(
    (item) => item.product_id === product_id && item.order_id === order_id
  );

  if (itemIndex) {
    items[itemIndex].quantity = parseInt(items[itemIndex].quantity) + quantity;
    writeCSV(fileItemPath, items);
    return items[itemIndex];
  }

  return null;
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

  // console.log("order", orders[orderIndex]);

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
      parseInt(orders[orderIndex].total) +
      parseInt(product_price) * items[itemIndex].quantity;
    writeCSV(fileOrderPath, orders);
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
    parseInt(orders[orderIndex].total) +
    parseInt(product_price) * items[itemIndex].quantity;
  writeCSV(fileOrderPath, orders);
  return newItem;
};
