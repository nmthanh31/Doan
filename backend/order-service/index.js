const express = require("express");
const cors = require("cors");
const orderRoutes = require("./routes/order.routes");
const path = require("path");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/orders", orderRoutes);

const PORT = 3003;
app.listen(PORT, () => console.log("Order Service running on port " + PORT));
