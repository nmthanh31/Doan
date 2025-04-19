import { use, useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, user } = useAuth(); // Giả sử bạn đã có hook useAuth để lấy hàm login
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }; // Thêm navigate vào dependencies

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Đang gửi yêu cầu

    try {
      // Gửi yêu cầu đăng nhập tới backend
      axios.defaults.withCredentials = true; // Đảm bảo gửi cookie cùng với yêu cầu

      const response = await axios.post(
        "http://localhost:3001/api/users/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true, // 💡 Quan trọng để session hoạt động
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);

      // Kiểm tra nếu đăng nhập thành công
      if (response.data.user) {
        login(response.data.user, response.data.token);
      } else {
        setErrorMessage("Đăng nhập không thành công. Vui lòng kiểm tra lại.");
      }
    } catch (error: any) {
      // Xử lý lỗi khi gửi yêu cầu (lỗi server, hoặc sai thông tin đăng nhập)
      setErrorMessage(
        error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại!"
      );
    } finally {
      setIsLoading(false); // Dừng trạng thái loading
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-800 p-4">
      <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center">
          <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-white">
            Đăng nhập
          </h2>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-md bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Mật khẩu
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div className="mt-2 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full rounded-md bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white"
                tabIndex={-1} // không focus vào nút này khi tab
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center rounded-md px-3 py-2 text-white font-semibold shadow-md focus:ring-2 focus:ring-indigo-400 ${
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500"
              }`}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Chưa có tài khoản?{" "}
          <Link
            to="/signup"
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
