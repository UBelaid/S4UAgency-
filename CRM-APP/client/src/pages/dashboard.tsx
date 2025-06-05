"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
  useLanguageContext,
  useTranslations,
} from "../context/LanguageContext";

const DashboardPage: React.FC = () => {
  const { darkMode } = useLanguageContext();
  const t = useTranslations();
  const [dashboardData, setDashboardData] = useState({
    totalClients: 0,
    totalSuppliers: 0,
    totalProducts: 0,
    totalSales: 0,
    totalPurchases: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [clientsRes, suppliersRes, productsRes, salesRes, purchasesRes] =
          await Promise.all([
            fetch("http://localhost:5000/api/clients"),
            fetch("http://localhost:5000/api/suppliers"),
            fetch("http://localhost:5000/api/products"),
            fetch("http://localhost:5000/api/sales"),
            fetch("http://localhost:5000/api/purchases"),
          ]);

        const clients = await clientsRes.json();
        const suppliers = await suppliersRes.json();
        const products = await productsRes.json();
        const sales = await salesRes.json();
        const purchases = await purchasesRes.json();

        // Define types for sale and purchase
        type Sale = { total_price: number };
        type Purchase = { total_cost: number };

        setDashboardData({
          totalClients: clients.length,
          totalSuppliers: suppliers.length,
          totalProducts: products.length,
          totalSales: (sales as Sale[]).reduce(
            (sum: number, sale: Sale) => sum + sale.total_price,
            0
          ),
          totalPurchases: (purchases as Purchase[]).reduce(
            (sum: number, purchase: Purchase) => sum + purchase.total_cost,
            0
          ),
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format monetary values with MAD
  const formatMoney = (value: number) => {
    return (
      value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " MAD"
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div
        className={`flex-1 p-8 ${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-800"
        }`}
      >
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          {t.dashboard}
        </h1>
        <div className="text-sm mb-4">
          {t.welcomeMessage}, User! {t.todayIs}{" "}
          {new Date().toLocaleString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZoneName: "short",
          })}{" "}
          +01
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            className={`p-6 rounded-lg shadow-md ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3 className="text-lg font-semibold">{t.totalClients}</h3>
            <p className="text-2xl mt-2">{dashboardData.totalClients}</p>
          </div>
          <div
            className={`p-6 rounded-lg shadow-md ${
              darkMode ? "bg-gray-800" : "bg-blue-50"
            }`}
          >
            <h3 className="text-lg font-semibold">{t.totalSuppliers}</h3>
            <p className="text-2xl mt-2">{dashboardData.totalSuppliers}</p>
          </div>
          <div
            className={`p-6 rounded-lg shadow-md ${
              darkMode ? "bg-gray-800" : "bg-green-50"
            }`}
          >
            <h3 className="text-lg font-semibold">{t.totalProducts}</h3>
            <p className="text-2xl mt-2">{dashboardData.totalProducts}</p>
          </div>
          <div
            className={`p-6 rounded-lg shadow-md ${
              darkMode ? "bg-gray-800" : "bg-yellow-50"
            }`}
          >
            <h3 className="text-lg font-semibold">{t.totalSales}</h3>
            <p className="text-2xl mt-2">
              {formatMoney(dashboardData.totalSales)}
            </p>
          </div>
          <div
            className={`p-6 rounded-lg shadow-md ${
              darkMode ? "bg-gray-800" : "bg-red-50"
            }`}
          >
            <h3 className="text-lg font-semibold">{t.totalPurchases}</h3>
            <p className="text-2xl mt-2">
              {formatMoney(dashboardData.totalPurchases)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
