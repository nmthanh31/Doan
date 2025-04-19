import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Tab,
  Tabs,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Badge,
  IconButton,
} from "@mui/material";
import { Delete, ShoppingCart, History } from "@mui/icons-material";
import { Product } from "../interfaces/ProductProps";
import { CartItem, Order } from "../interfaces/OrderProps";



const OrderPage: React.FC = () => {
  const [tabValue, setTabValue] = useState<number>(0);
  const [itemsInCart, setItemsInCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartOrder, setCartOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log("User ID from localStorage:", userId); // Thêm dòng này

    axios.get(`http://localhost:3003/api/orders/user/${userId}`).then((res) => {
      const userOrders = res.data as Order[];
      const incart = userOrders.find((o) => o.status === "incart");
      setCartOrder(incart || null);
      setOrders(userOrders.filter((o) => o.status !== "incart"));

      if (incart) {
        axios
          .get(`http://localhost:3003/api/orders/items/${incart.id}`)
          .then((res) => setItemsInCart(res.data as CartItem[]));
      }
    });

    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>("http://localhost:3002/api/products/");

        console.log(response.data);

        setProducts(response.data);
      } catch (error) {
        console.log("Lỗi khi tải danh sách sản phẩm: " + error.message);
      }
    };

    fetchProducts();
  }, []);

  const findProductById = (id: number) => {
    return products.find((product) => product.id == id);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const removeFromCart = async (id: number) => {
    await axios.delete(`/order-items/${id}`);
    setItemsInCart(itemsInCart.filter((item) => item.id !== id));
  };

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    await axios.patch(`/order-items/${id}`, { quantity: newQuantity });
    setItemsInCart(
      itemsInCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const checkout = async () => {
    if (!cartOrder) return;

    await axios.patch(`/orders/${cartOrder.id}`, {
      status: "completed",
      total: calculateCartTotal(),
    });

    setOrders([
      { ...cartOrder, status: "completed", total: calculateCartTotal() },
      ...orders,
    ]);
    setItemsInCart([]);
    setCartOrder(null);
    setTabValue(1);
  };

  const calculateCartTotal = () => {
    return itemsInCart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <div className="container mx-auto">
      <Box sx={{ width: "100%", p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý đơn hàng
        </Typography>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="order tabs"
        >
          <Tab
            icon={<ShoppingCart />}
            iconPosition="start"
            label={
              <Badge badgeContent={itemsInCart.length} color="primary">
                Giỏ hàng
              </Badge>
            }
          />
          <Tab
            icon={<History />}
            iconPosition="start"
            label="Đơn hàng đã mua"
          />
        </Tabs>

        <Box sx={{ pt: 3 }}>
          {tabValue === 0 && (
            <Box>
              {itemsInCart.length === 0 ? (
                <Typography variant="body1">
                  Giỏ hàng của bạn đang trống
                </Typography>
              ) : (
                <>
                  <List>
                    {itemsInCart.map((item) => (
                      <React.Fragment key={item.id}>
                        <ListItem
                          secondaryAction={
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Delete />
                            </IconButton>
                          }
                        >
                          <ListItemText
                            primary={findProductById(item.product_id)?.name}
                            secondary={`${item.price.toLocaleString()}đ x ${
                              item.quantity
                            }`}
                          />
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              ml: 2,
                            }}
                          >
                            <Button
                              size="small"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              -
                            </Button>
                            <Typography sx={{ mx: 1 }}>
                              {item.quantity}
                            </Typography>
                            <Button
                              size="small"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              +
                            </Button>
                          </Box>
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    <Typography variant="h6">
                      Tổng cộng: {calculateCartTotal().toLocaleString()}đ
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={checkout}
                    >
                      Thanh toán
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          )}

          {tabValue === 1 && (
            <Box>
              {orders.length === 0 ? (
                <Typography variant="body1">
                  Bạn chưa có đơn hàng nào
                </Typography>
              ) : (
                <List>
                  {orders.map((order) => (
                    <React.Fragment key={order.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={`Đơn hàng #${order.id}`}
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                Ngày:{" "}
                                {new Date(order.create_at).toLocaleDateString()}
                              </Typography>
                              <br />
                              "Đã hoàn thành"
                              <br />
                              {`Tổng tiền: ${order.total.toLocaleString()}đ`}
                            </>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default OrderPage;
