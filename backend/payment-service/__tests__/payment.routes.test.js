const request = require("supertest");
const express = require("express");
const axios = require("axios");
jest.mock("axios"); // 👉 mock axios để không gọi MoMo thật

const app = express();
app.use(express.json());

// 👉 Import lại phần xử lý POST /api/payment (copy/paste hoặc require file bạn đang chạy server)
app.post("/api/payment", async (req, res) => {
  const { amount, order_id } = req.body;
  const accessKey = "F8BBA842ECF85";
  const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  const orderInfo = "pay with MoMo";
  const partnerCode = "MOMO";
  const redirectUrl = "http://localhost:5173/payment/success/:order_id";
  const ipnUrl = "https://webhook.site/test-webhook";
  const requestType = "payWithMethod";
  const orderId = partnerCode + new Date().getTime();
  const requestId = orderId;
  const extraData = "";
  const orderGroupId = "";
  const autoCapture = true;
  const lang = "vi";

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  const crypto = require("crypto");
  const signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");

  const requestBody = JSON.stringify({
    partnerCode, partnerName: "Test", storeId: "MomoTestStore", requestId, amount,
    orderId, orderInfo, redirectUrl, ipnUrl, lang, requestType, autoCapture,
    extraData, orderGroupId, signature,
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

  try {
    const result = await axios(options);
    return res.status(200).json({ message: "success", data: result.data });
  } catch (error) {
    return res.status(500).json({
      message: "MoMo Payment Error",
      error: error?.response?.data || error.message,
    });
  }
});

describe("Payment Route", () => {
  it("should return 200 and payUrl when payment is successful", async () => {
    const mockMoMoResponse = {
      data: {
        payUrl: "https://momo.vn/pay?order_id=123",
        resultCode: 0,
      },
    };

    axios.mockResolvedValue(mockMoMoResponse); // 👉 mock axios trả về thành công

    const res = await request(app)
      .post("/api/payment")
      .send({ amount: "10000", order_id: "123" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("success");
    expect(res.body.data.payUrl).toContain("https://momo.vn/pay");
  });

  it("should return 500 if MoMo API call fails", async () => {
    axios.mockRejectedValue({ message: "Request failed" });

    const res = await request(app)
      .post("/api/payment")
      .send({ amount: "10000", order_id: "123" });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("MoMo Payment Error");
  });
});
