import React, { useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import {
  useLanguageContext,
  useTranslations,
} from "../context/LanguageContext";

const RegisterPage: React.FC = () => {
  const { darkMode } = useLanguageContext();
  const t = useTranslations();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    pin: "",
    role: "employee",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role: string) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          pin: formData.pin,
          role: formData.role,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Registration successful! Please login.");
        window.location.href = "/login";
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (error) {
      setError("Error registering user");
    }
  };

  return (
    <Layout>
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-800"
        }`}
      >
        <div
          className={`p-8 rounded-xl shadow-lg w-full max-w-md border ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h2 className="text-3xl font-bold mb-6 text-center">{t.register}</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">{t.username}</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                    : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500"
                }`}
                placeholder={t.username}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t.email}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                    : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500"
                }`}
                placeholder={t.emailPlaceholder}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t.password}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                      : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500"
                  }`}
                  placeholder={t.passwordPlaceholder}
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁️‍🗨️" : "👁️"}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t.confirmPassword}</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                    : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500"
                }`}
                placeholder={t.passwordPlaceholder}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t.pin}</label>
              <input
                type="text"
                name="pin"
                value={formData.pin}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                    : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500"
                }`}
                placeholder={t.pin}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t.role}</label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handleRoleChange("employee")}
                  className={`flex-1 flex items-center justify-center p-3 rounded-lg border transition-all duration-200 ${
                    formData.role === "employee"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-500"
                      : `${darkMode ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100"}`
                  }`}
                >
                  <span className="mr-2">👤</span>
                  <span>{t.employee}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange("admin")}
                  className={`flex-1 flex items-center justify-center p-3 rounded-lg border transition-all duration-200 ${
                    formData.role === "admin"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500"
                      : `${darkMode ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100"}`
                  }`}
                >
                  <span className="mr-2">🛠️</span>
                  <span>{t.admin}</span>
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={handleRegister}
            className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-semibold"
          >
            {t.register}
          </button>
          <p className="mt-4 text-center text-sm">
            {t.alreadyHaveAccount}{" "}
            <Link href="/login" className="text-purple-600 hover:underline">
              {t.loginHere}
            </Link>
          </p>
          <div className="mt-4 w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-b-lg"></div>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;