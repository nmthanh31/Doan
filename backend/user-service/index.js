require('dotenv').config()

const express = require("express");
const session = require("express-session");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");


const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Hoặc "*" nếu muốn mở hoàn toàn
    methods: 'GET,POST,PUT,DELETE',
    credentials: true, // Cho phép gửi cookie/session
  })
);

app.use(express.json());

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 ngày
    },
  })
);

app.use("/api/users", userRoutes);

const PORT = 3001;
app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));
