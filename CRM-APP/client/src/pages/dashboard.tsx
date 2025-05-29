import React from "react";
import Link from "next/link";
import Sidebar from "../components/Sidebar";
import {
  useLanguageContext,
  useTranslations,
} from "../context/LanguageContext";

const DashboardPage: React.FC = () => {
  const { darkMode, language } = useLanguageContext();
  const t = useTranslations();

  const summaryData = {
    totalClients: 2,
    totalSuppliers: 10,
    totalProducts: 50,
    totalSales: 12345,
    totalPurchases: 30,
  };

  const currentDateTime = new Date("2025-05-27T21:08:00+01:00")
    .toLocaleString(language === "fr" ? "fr-FR" : "en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
      timeZone: "Europe/London",
    })
    .replace("GMT", "+01");

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div
        className={`flex-1 p-8 ${
          darkMode ? "bg-gray-900" : "bg-gray-100"
        } transition-colors duration-200`}
      >
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            {t.dashboard}
          </h1>
          <p
            className={`mt-2 text-xl font-semibold ${
              darkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            {t.welcomeMessage}, {t.userPlaceholder}! 🎉
          </p>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {t.todayIs} {currentDateTime}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <Link href="/clients" className="block">
            <div
              className={`p-6 rounded-lg shadow-md animate-slide-up ${
                darkMode
                  ? "bg-gray-800"
                  : "bg-gradient-to-br from-purple-50 to-pink-50"
              } cursor-pointer hover:${
                darkMode ? "bg-gray-700" : "bg-purple-100"
              }`}
            >
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {t.totalClients}
              </h3>
              <p
                className={`text-3xl font-bold ${
                  darkMode ? "text-purple-400" : "text-purple-600"
                }`}
              >
                {summaryData.totalClients}
              </p>
            </div>
          </Link>
          <Link href="/suppliers" className="block">
            <div
              className={`p-6 rounded-lg shadow-md animate-slide-up ${
                darkMode
                  ? "bg-gray-800"
                  : "bg-gradient-to-br from-blue-50 to-indigo-50"
              } cursor-pointer hover:${
                darkMode ? "bg-gray-700" : "bg-blue-100"
              }`}
            >
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {t.totalSuppliers}
              </h3>
              <p
                className={`text-3xl font-bold ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              >
                {summaryData.totalSuppliers}
              </p>
            </div>
          </Link>
          <Link href="/products" className="block">
            <div
              className={`p-6 rounded-lg shadow-md animate-slide-up ${
                darkMode
                  ? "bg-gray-800"
                  : "bg-gradient-to-br from-green-50 to-teal-50"
              } cursor-pointer hover:${
                darkMode ? "bg-gray-700" : "bg-green-100"
              }`}
            >
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {t.totalProducts}
              </h3>
              <p
                className={`text-3xl font-bold ${
                  darkMode ? "text-green-400" : "text-green-600"
                }`}
              >
                {summaryData.totalProducts}
              </p>
            </div>
          </Link>
          <Link href="/sales" className="block">
            <div
              className={`p-6 rounded-lg shadow-md animate-slide-up ${
                darkMode
                  ? "bg-gray-800"
                  : "bg-gradient-to-br from-yellow-50 to-orange-50"
              } cursor-pointer hover:${
                darkMode ? "bg-gray-700" : "bg-yellow-100"
              }`}
            >
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {t.totalSales}
              </h3>
              <p
                className={`text-3xl font-bold ${
                  darkMode ? "text-yellow-400" : "text-yellow-600"
                }`}
              >
                {summaryData.totalSales.toLocaleString("fr-MA", {
                  style: "currency",
                  currency: "MAD",
                })}
              </p>
            </div>
          </Link>
          <Link href="/purchases" className="block">
            <div
              className={`p-6 rounded-lg shadow-md animate-slide-up ${
                darkMode
                  ? "bg-gray-800"
                  : "bg-gradient-to-br from-red-50 to-pink-50"
              } cursor-pointer hover:${
                darkMode ? "bg-gray-700" : "bg-red-100"
              }`}
            >
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {t.totalPurchases}
              </h3>
              <p
                className={`text-3xl font-bold ${
                  darkMode ? "text-red-400" : "text-red-600"
                }`}
              >
                {summaryData.totalPurchases}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
