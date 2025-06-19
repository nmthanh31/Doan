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

    axios.get(`/api/orders/user/${userId}`).then((res) => {
      const userOrders = res.data as Order[];
      const incart = userOrders.find((o) => o.status === "incart");
      setCartOrder(incart || null);
      setOrders(userOrders.filter((o) => o.status !== "incart"));

      if (incart) {
        axios
          .get(`/api/orders/items/${incart.id}`)
          .then((res) => setItemsInCart(res.data as CartItem[]));
      }
    });

    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>(
          "/api/products/"
        );



        setProducts(response.data);
      } catch (error) {
        console.log("Lỗi khi tải danh sách sản phẩm,", error);
      }
    };

    fetchProducts();
  }, []);

  const findProductById = (id: string) => {
    return products.find((product) => product.id == id);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const removeFromCart = async (orderId: string, productId: string) => {
    const response = await axios.delete<{ id: string }>(
      `/api/orders/item/delete-item`,
      {
        params: {
          order_id: orderId,
          product_id: productId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    setItemsInCart((prevItems) =>
      prevItems.filter((item) => item.id !== response.data.id)
    );
  };

  const updateQuantity = async (
    orderId: string,
    productId: string,
    quantity: number
  ) => {
    const response = await axios.patch<{
      message: string;
      id: string;
      item: CartItem;
    }>("/api/orders/item/update-quantity", {
      order_id: orderId,
      product_id: productId,
      quantity: quantity,
    });

    if (response.data.message == "delete") {
      setItemsInCart((prevItems) =>
        prevItems.filter((item) => item.id !== response.data.id)
      );
    } else if (response.data.message == "update") {
      setItemsInCart(
        itemsInCart.map((item) =>
          item.id == response.data.id ? response.data.item : item
        )
      );
    }
  };

  const checkout = async (amount: number) => {
    try {
      const res = await axios.post<{ data: { payUrl: string } }>(
        "/api/payment",
        {
          amount: amount,
          order_id: cartOrder?.id,
        }
      );

      const payUrl = res.data.data.payUrl;

      window.location.href = payUrl;
    } catch (error) {
      console.error("Payment failed", error);
    }
  };

  const calculateCartTotal = () => {
    return itemsInCart.reduce((total, item) => {
      const product = findProductById(item.product_id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
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
                    {itemsInCart.map((item) => {
                      return (
                        <React.Fragment key={item.id}>
                          <ListItem
                            secondaryAction={
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() =>
                                  removeFromCart(
                                    cartOrder?.id.toString() || "",
                                    item.product_id.toString()
                                  )
                                }
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
                                  updateQuantity(
                                    cartOrder?.id.toString() || "",
                                    item.product_id.toString(),
                                    -1
                                  )
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
                                  updateQuantity(
                                    cartOrder?.id.toString() || "",
                                    item.product_id.toString(),
                                    1
                                  )
                                }
                              >
                                +
                              </Button>
                            </Box>
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      );
                    })}
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
                      onClick={() => checkout(calculateCartTotal())}
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
