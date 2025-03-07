"use client";

import { useState } from "react";
import { loginUser, registerUser } from "@/app/api/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const AuthForm = ({ isLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = isLogin ? await loginUser(formData) : await registerUser(formData);
      
      localStorage.setItem("userInfo", JSON.stringify(response));

      toast.success(isLogin ? "Авторизация прошла успешно! Перенаправление..." : "Регистрация прошла успешно! Перенаправление...");

      setTimeout(() => {
        router.push("/home/tasks");
      }, 3000);
    } catch (err) {
      toast.error(err.message || "Что-то пошло не так. Пожалуйста, попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center">{isLogin ? "Login" : "Register"}</h2>

        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="email"
            name="email"
            placeholder="Электронная почта"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            required
          />

          <div className="relative w-full mt-4">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Пароль"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 transition cursor-pointer"
            >
              {showPassword ? <AiFillEye size={20} /> : <AiFillEyeInvisible size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600 transition cursor-pointer"
            disabled={loading}
          >
            {loading ? "Обработка..." : isLogin ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          {isLogin ? "У вас нет учетной записи?" : "У вас уже есть учетная запись?"}{" "}
          <a href={isLogin ? "/auth/register" : "/auth/login"} className="text-blue-500 hover:underline cursor-pointer">
            {isLogin ? "Регистрация" : "Войти в систему"}
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
