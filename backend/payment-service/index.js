const cors = require("cors");
const { default: axios } = require("axios");
const express = require("express");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Hoặc "*" nếu muốn mở hoàn toàn
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true, // Cho phép gửi cookie/session
  })
);

app.use(express.json());

app.post("/api/payment", async (req, res) => {
  const { amount, order_id } = req.body;
  var accessKey = "F8BBA842ECF85";
  var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  var orderInfo = "pay with MoMo";
  var partnerCode = "MOMO";
  var redirectUrl = "http://localhost:5173/payment/success/:order_id";
  var ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
  var requestType = "payWithMethod";
  var orderId = partnerCode + new Date().getTime();
  var requestId = orderId;
  var extraData = "";
  var orderGroupId = "";
  var autoCapture = true;
  var lang = "vi";

  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;
  //signature
  const crypto = require("crypto");
  var signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature,
  });

  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/create",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };

  let result;

  try {
    result = await axios(options);

    console.log("--------------------RESULT----------------");
    console.log(result.data);

    return res.status(200).json({
      message: "success",
      data: result.data,
    });
  } catch (error) {
    console.error(
      "MoMo API Error:",
      error?.response?.data || error.message || error
    );
    return res.status(500).json({
      message: "MoMo Payment Error",
      error: error?.response?.data || error.message,
    });
  }
});

app.listen(3004, () => {
  console.log("Payment service is running on port 3004");
});
