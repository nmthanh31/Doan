const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/product.routes");
const path = require("path");

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173", // Hoặc "*" nếu muốn mở hoàn toàn
        methods: 'GET,POST,PUT,DELETE',
        credentials: true, // Cho phép gửi cookie/session
    })
)
app.use(
    "/images",
    express.static(path.join(__dirname, "data/static/"))
  );

app.use(express.json());

app.use("/api/products", productRoutes);

const PORT = 3002;
app.listen(PORT, () => console.log("Product Service running on port " + PORT));