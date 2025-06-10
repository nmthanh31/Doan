require("dotenv").config();

const express = require("express");
const session = require("express-session");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

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

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api/users", userRoutes);

const PORT = 3001;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`User Service running on port ${PORT}`)
);
