import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Product } from "../interfaces/ProductProps";
import CardProduct from "../components/CardProduct";
import { useAuth } from "../contexts/AuthContext";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>("/api/products/");
        setProducts(response.data);
      } catch (error: any) {
        setMessage("Lỗi khi tải danh sách sản phẩm: " + error.message);
        setMessageType("error");
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (
    userId: string,
    productId: string,
    productPrice: string
  ) => {
    try {
      await axios.post("/api/orders/item", {
        user_id: userId,
        product_id: productId,
        product_price: productPrice,
      });

      setMessage("✅ Đã thêm sản phẩm vào giỏ hàng!");
      setMessageType("success");
    } catch (error: any) {
      const errMsg = error.response?.data?.message || error.message;

      if (errMsg.includes("Product already in cart")) {
        setMessage("Sản phẩm đã có trong giỏ hàng!");
      } else {
        setMessage("Lỗi khi thêm vào giỏ: " + errMsg);
      }

      setMessageType("error");
    }

    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="container bg-white mx-auto px-4">
      <div className="flex justify-between items-center py-4 border-b">
        <h1 className="text-3xl font-bold text-gray-800">Danh sách sản phẩm</h1>
        <div className="flex space-x-4 items-center">
          <span className="text-gray-700">Xin chào, {user?.full_name}</span>
          <button
            onClick={() => navigate("/orders")}
            className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition hover:cursor-pointer"
          >
            Đơn hàng của tôi
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition hover:cursor-pointer"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`my-4 p-3 rounded ${
            messageType === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-10">
        {products.map((product) => (
          <CardProduct
            key={product.id}
            title={product.name}
            price={product.price}
            image={`http://localhost/images/${product.image_url}`}
            rating={product.rating}
            onAddToCart={() => {
              if (userId) {
                handleAddToCart(userId, product.id, product.price.toString());
              } else {
                setMessage("Không tìm thấy người dùng!");
                setMessageType("error");
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
