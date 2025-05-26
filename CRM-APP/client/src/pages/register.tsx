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

  const handleRegister = () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Registering with:", formData);
  };

  return (
    <Layout>
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div
          className={`p-8 rounded-xl shadow-lg w-full max-w-md border ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h2
            className="text-3xl font-bold mb-6 text-center"
            style={{ color: darkMode ? "white" : "black" }}
          >
            {t.register}
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.username}
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-gray-50 border-gray-200 text-gray-800"
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder={t.username}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.email}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-gray-50 border-gray-200 text-gray-800"
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder={t.email}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.password}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-gray-50 border-gray-200 text-gray-800"
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder={t.password}
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  {showPassword ? "👁️‍🗨️" : "👁️"}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.confirmPassword}
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-gray-50 border-gray-200 text-gray-800"
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder={t.confirmPassword}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.pin}
              </label>
              <input
                type="text"
                name="pin"
                value={formData.pin}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-gray-50 border-gray-200 text-gray-800"
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder={t.pin}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.role}
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handleRoleChange("employee")}
                  className={`flex-1 flex items-center justify-center p-4 rounded-lg border transition-all duration-200 ${
                    formData.role === "employee"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-500"
                      : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  style={{ color: darkMode ? "white" : "black" }}
                >
                  <span className="mr-2">👤</span>
                  <span>{t.employee}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange("admin")}
                  className={`flex-1 flex items-center justify-center p-4 rounded-lg border transition-all duration-200 ${
                    formData.role === "admin"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500"
                      : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  style={{ color: darkMode ? "white" : "black" }}
                >
                  <span className="mr-2">🛠️</span>
                  <span>{t.admin}</span>
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={handleRegister}
            className="w-full mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          >
            {t.register}
          </button>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            {t.alreadyHaveAccount}{" "}
            <Link href="/login" className="text-purple-600 hover:underline">
              {t.loginHere}
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
