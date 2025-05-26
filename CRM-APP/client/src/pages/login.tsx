import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import {
  useLanguageContext,
  useTranslations,
} from "../context/LanguageContext";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { darkMode } = useLanguageContext();
  const t = useTranslations();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = () => {
    console.log("Logging in with:", formData);
    router.push("/dashboard");
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
            {t.login}
          </h2>
          <div className="space-y-6">
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
          </div>
          <button
            onClick={handleLogin}
            className="w-full mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          >
            {t.login}
          </button>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            {t.dontHaveAccount}{" "}
            <Link href="/register" className="text-purple-600 hover:underline">
              {t.registerHere}
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
