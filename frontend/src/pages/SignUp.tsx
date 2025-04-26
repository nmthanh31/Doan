import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });

  const navifate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const newUser = {
      full_name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address,
    };

    try {
      const response = await fetch("http://localhost:3001/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        alert("Đăng ký thành công!");
        setFormData({
          email: "",
          name: "",
          password: "",
          confirmPassword: "",
          phone: "",
          address: "",
        });
        navifate("/login");
      } else {
        alert("Đăng ký thất bại.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Có lỗi xảy ra khi gửi dữ liệu.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-800 p-4">
      <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Đăng ký tài khoản
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Địa chỉ email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white"
            >
              Họ và tên
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white"
            >
              Nhập lại mật khẩu
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-white"
            >
              Số điện thoại
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              required
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-white"
            >
              Địa chỉ
            </label>
            <input
              id="address"
              name="address"
              type="text"
              required
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-gray-900"
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-indigo-600 py-2 text-white font-semibold hover:bg-indigo-500"
          >
            Sign up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white">
          Already have an account?
          <Link
            to="/login"
            className="ml-1 font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Log in here!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
