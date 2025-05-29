"use client";

import React, { useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import {
  useLanguageContext,
  useTranslations,
} from "../context/LanguageContext";
import * as XLSX from "xlsx";

interface ProductData {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
}

const ProductsPage: React.FC = () => {
  const { darkMode } = useLanguageContext();
  const t = useTranslations();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [products, setProducts] = useState<ProductData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProductData>({
    id: 0,
    name: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    category: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ProductData, string>>>({});
  const [importError, setImportError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ProductData, string>> = {};
    if (!formData.name.trim()) errors.name = `${t.productName} ${t.isRequired}`;
    if (!formData.description.trim())
      errors.description = `${t.description} ${t.isRequired}`;
    if (formData.price <= 0) errors.price = `${t.price} ${t.mustBePositive}`;
    if (formData.stockQuantity < 0)
      errors.stockQuantity = `${t.stockQuantity} ${t.mustBeNonNegative}`;
    if (!formData.category.trim())
      errors.category = `${t.category} ${t.isRequired}`;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setFormData({
      id: 0,
      name: "",
      description: "",
      price: 0,
      stockQuantity: 0,
      category: "",
    });
    setFormErrors({});
    setCurrentId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stockQuantity"
          ? Number(value) || 0
          : value,
    }));
    if (value.trim() || name === "price" || name === "stockQuantity")
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAdd = () => {
    if (!validateForm()) return;
    const newId = Math.max(0, ...products.map((p) => p.id)) + 1;
    setProducts((prev) => [...prev, { ...formData, id: newId }]);
    resetForm();
  };

  const handleEdit = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setFormData(product);
      setCurrentId(id);
      setIsEditing(true);
      setIsModalOpen(true);
    }
  };

  const handleUpdate = () => {
    if (!validateForm() || !currentId) return;
    setProducts((prev) =>
      prev.map((p) => (p.id === currentId ? { ...formData, id: p.id } : p))
    );
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm(t.confirmDelete)) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      const newProductCount = products.length - 1;
      const maxPage = Math.max(1, Math.ceil(newProductCount / itemsPerPage));
      if (currentPage > maxPage) setCurrentPage(maxPage);
    }
  };

  const handleExportToExcel = () => {
    try {
      setImportError("");
      const exportData = products.map((product) => ({
        ID: product.id,
        Name: product.name,
        Description: product.description,
        Price: product.price,
        StockQuantity: product.stockQuantity,
        Category: product.category,
      }));
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const filename = `products_export_${timestamp}.xlsx`;
      XLSX.writeFile(workbook, filename);
      console.log("Export successful");
    } catch (error) {
      console.error("Export to Excel failed:", error);
      setImportError("Export failed. Please try again.");
    }
  };

  const handleImportFromExcel = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    setImportError("");
    if (!file) {
      setImportError("No file selected");
      return;
    }
    const validExtensions = [".xlsx", ".xls"];
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));
    if (!validExtensions.includes(fileExtension)) {
      setImportError(
        "Invalid file type. Please select an Excel file (.xlsx or .xls)"
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error("No data read from file.");
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) throw new Error("Could not read the worksheet.");
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
        }) as (string | number | boolean | null)[][];
        if (jsonData.length < 2) {
          setImportError(
            "Excel file must contain at least one data row with headers."
          );
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
        const headers = jsonData[0].map((h) => String(h).toLowerCase().trim());
        const dataRows = jsonData.slice(1);
        const getColumnIndex = (possibleNames: string[]): number =>
          possibleNames.findIndex((name) =>
            headers.includes(name.toLowerCase())
          ) !== -1
            ? headers.findIndex((h) =>
                possibleNames.some((name) => h.includes(name.toLowerCase()))
              )
            : -1;
        const nameIndex = getColumnIndex(["name", "nom"]);
        const descriptionIndex = getColumnIndex(["description", "desc"]);
        const priceIndex = getColumnIndex(["price", "prix"]);
        const stockQuantityIndex = getColumnIndex([
          "stockquantity",
          "quantity",
        ]);
        const categoryIndex = getColumnIndex(["category", "categorie"]);
        if (
          nameIndex === -1 ||
          descriptionIndex === -1 ||
          priceIndex === -1 ||
          stockQuantityIndex === -1 ||
          categoryIndex === -1
        ) {
          setImportError(
            "Excel file must contain columns for Name, Description, Price, Stock Quantity, and Category."
          );
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
        const importedProducts: ProductData[] = [];
        const maxExistingId = Math.max(0, ...products.map((p) => p.id));
        dataRows.forEach((row) => {
          const name = String(row[nameIndex] || "").trim();
          const description = String(row[descriptionIndex] || "").trim();
          const price = Number(row[priceIndex]) || 0;
          const stockQuantity = Number(row[stockQuantityIndex]) || 0;
          const category = String(row[categoryIndex] || "").trim();
          if (
            name &&
            description &&
            price > 0 &&
            stockQuantity >= 0 &&
            category
          ) {
            importedProducts.push({
              id: maxExistingId + importedProducts.length + 1,
              name,
              description,
              price,
              stockQuantity,
              category,
            });
          }
        });
        if (importedProducts.length === 0) {
          setImportError("No valid product data found in the Excel file.");
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
        setProducts((prev) => [...prev, ...importedProducts]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        console.log(
          `Successfully imported ${importedProducts.length} products`
        );
      } catch (error) {
        console.error("Import from Excel failed:", error);
        setImportError(
          "Failed to import Excel file. Please check the file format and try again."
        );
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.onerror = () => {
      setImportError("Failed to read the file. Please try again.");
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsArrayBuffer(file);
  };

  const filteredProducts = products.filter((product) =>
    Object.values(product).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / itemsPerPage)
  );
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage((prev) => prev + 1);
  const handlePreviousPage = () =>
    currentPage > 1 && setCurrentPage((prev) => prev - 1);

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
            {t.products}
          </h1>
        </div>
        <div className="mb-6 flex justify-between items-center">
          <input
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
            }`}
          />
          <div className="space-x-4 flex items-center">
            <button
              onClick={() => {
                setIsEditing(false);
                resetForm();
                setIsModalOpen(true);
              }}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"
            >
              {t.add}
            </button>
            <button
              onClick={handleExportToExcel}
              className={`px-6 py-2 rounded-lg text-white font-semibold shadow-md transition-all duration-200 ${
                darkMode
                  ? "bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800"
                  : "bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
              }`}
            >
              {t.export}
            </button>
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportFromExcel}
                accept=".xlsx,.xls"
                className="absolute opacity-0 w-0 h-0"
                id="importFile"
              />
              <label
                htmlFor="importFile"
                className={`px-6 py-2 rounded-lg text-white font-semibold cursor-pointer shadow-md transition-all duration-200 ${
                  darkMode
                    ? "bg-gradient-to-r from-green-600 to-teal-700 hover:from-green-700 hover:to-teal-800"
                    : "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                }`}
              >
                {t.import}
              </label>
            </div>
          </div>
        </div>
        {importError && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              darkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-700"
            }`}
          >
            {importError}
          </div>
        )}
        <div className="overflow-x-auto">
          <table
            className={`min-w-full rounded-lg shadow-lg ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <thead>
              <tr className={darkMode ? "bg-gray-700" : "bg-gray-200"}>
                <th
                  className={`px-6 py-3 text-left text-sm font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {t.productName}
                </th>
                <th
                  className={`px-6 py-3 text-left text-sm font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {t.description}
                </th>
                <th
                  className={`px-6 py-3 text-left text-sm font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {t.price}
                </th>
                <th
                  className={`px-6 py-3 text-left text-sm font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {t.stockQuantity}
                </th>
                <th
                  className={`px-6 py-3 text-left text-sm font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {t.category}
                </th>
                <th
                  className={`px-6 py-3 text-left text-sm font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {t.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={`border-t ${
                      darkMode
                        ? "border-gray-700 text-gray-200"
                        : "border-gray-200 text-gray-800"
                    } hover:${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
                  >
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">{product.description}</td>
                    <td className="px-6 py-4">{product.price.toFixed(2)}</td>
                    <td className="px-6 py-4">{product.stockQuantity}</td>
                    <td className="px-6 py-4">{product.category}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => handleEdit(product.id)}
                        className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                      >
                        {t.edit}
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                      >
                        {t.delete}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className={`px-6 py-4 text-center ${
                      darkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {t.noData}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              darkMode
                ? "bg-gray-700 text-gray-200"
                : "bg-gray-200 text-gray-800"
            } ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : darkMode
                ? "hover:bg-gray-600"
                : "hover:bg-gray-300"
            }`}
          >
            {t.previous}
          </button>
          <span className={darkMode ? "text-gray-200" : "text-gray-800"}>
            {t.page} {currentPage} {t.of} {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              darkMode
                ? "bg-gray-700 text-gray-200"
                : "bg-gray-200 text-gray-800"
            } ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : darkMode
                ? "hover:bg-gray-600"
                : "hover:bg-gray-300"
            }`}
          >
            {t.next}
          </button>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div
              className={`p-8 rounded-xl shadow-lg w-full max-w-md ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h2
                className={`text-2xl font-bold mb-6 ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {isEditing ? t.update : t.add}
              </h2>
              <div className="space-y-6">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    {t.productName}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t.productName}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                        : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500"
                    } ${formErrors.name ? "border-red-500" : ""}`}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    {t.description}
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder={t.description}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                        : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500"
                    } ${formErrors.description ? "border-red-500" : ""}`}
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.description}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    {t.price}
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price || ""}
                    onChange={handleInputChange}
                    placeholder={t.price}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                        : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500"
                    } ${formErrors.price ? "border-red-500" : ""}`}
                    step="0.01"
                  />
                  {formErrors.price && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.price}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    {t.stockQuantity}
                  </label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity || ""}
                    onChange={handleInputChange}
                    placeholder={t.stockQuantity}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                        : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500"
                    } ${formErrors.stockQuantity ? "border-red-500" : ""}`}
                    step="1"
                  />
                  {formErrors.stockQuantity && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.stockQuantity}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    {t.category}
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder={t.category}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                        : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500"
                    } ${formErrors.category ? "border-red-500" : ""}`}
                  />
                  {formErrors.category && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.category}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={resetForm}
                  className={`px-6 py-2 border rounded-lg ${
                    darkMode
                      ? "border-gray-600 text-gray-200 hover:bg-gray-700"
                      : "border-gray-300 text-gray-800 hover:bg-gray-200"
                  } transition-all`}
                >
                  {t.cancel}
                </button>
                <button
                  onClick={isEditing ? handleUpdate : handleAdd}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"
                >
                  {isEditing ? t.update : t.add}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
