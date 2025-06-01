const express = require("express");
const cors = require("cors");
const orderRoutes = require("./routes/order.routes");
const session = require('express-session');

const app = express();

app.use(express.json());
// Thêm dòng này để chấp nhận proxy từ Nginx
app.set("trust proxy", 1);

// Cập nhật CORS configuration
app.use(
  cors({
    origin: true, // Cho phép tất cả domain (hoặc có thể chỉ định domain cụ thể)
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// Cập nhật session configuration để hoạt động với proxy
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false, // Đặt thành true nếu dùng HTTPS
      httpOnly: true,
    },
  })
);

app.use("/api/orders", orderRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

const PORT = 3003;
app.listen(PORT, "0.0.0.0", () =>
  console.log("Order Service running on port " + PORT)
);
