import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SuccessPage = () => {
  const { order_id } = useParams();
  const orderId = order_id;
  const navigate = useNavigate();

  useEffect(() => {
    const updateOrderStatus = async () => {
      try {
        if (!orderId) return;

        interface UpdateOrderResponse {
          message: string;
        }

        const res = await axios.patch<UpdateOrderResponse>(
          "/api/orders/order/update-status",
          { order_id: orderId }
        );

        if (res.data.message === "updated") {
          setTimeout(() => {
            navigate("/products");
          }, 3000);
        }
      } catch (err) {
        console.error("Failed to update order status:", err);
      }
    };

    updateOrderStatus();
  }, [orderId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100 text-center px-4">
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        Thanh toán thành công!
      </h1>
      <p className="text-lg mb-6">
        Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
      </p>
      <button
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        onClick={() => navigate("/products")}
      >
        Quay về trang chủ
      </button>
    </div>
  );
};

export default SuccessPage;
