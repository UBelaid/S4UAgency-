"use client";

import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
  useLanguageContext,
  useTranslations,
} from "../context/LanguageContext";
import * as XLSX from "xlsx";

interface SupplierData {
  id: number;
  name: string;
}

interface ProductData {
  id: number;
  name: string;
  price: number;
}

interface PurchaseData {
  id: number;
  supplierId: number;
  supplierName: string;
  productId: number;
  productName: string;
  quantity: number;
  totalCost: number;
  purchaseDate: string;
}

const PurchasesPage: React.FC = () => {
  const { darkMode } = useLanguageContext();
  const t = useTranslations();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [purchases, setPurchases] = useState<PurchaseData[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    supplierId: 0,
    productId: 0,
    quantity: 0,
    purchaseDate: new Date().toISOString().split("T")[0], // May 29, 2025
  });
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof typeof formData, string>>
  >({});
  const [importError, setImportError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Populate suppliers and products on mount (mock data for now)
  useEffect(() => {
    const fetchData = async () => {
      const mockSuppliers: SupplierData[] = [
        { id: 1, name: "Supplier A" },
        { id: 2, name: "Supplier B" },
      ];
      const mockProducts: ProductData[] = [
        { id: 1, name: "Product X", price: 10 },
        { id: 2, name: "Product Y", price: 20 },
      ];
      setSuppliers(mockSuppliers);
      setProducts(mockProducts);
    };
    fetchData();
  }, []);

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof typeof formData, string>> = {};
    if (formData.supplierId === 0)
      errors.supplierId = `${t.suppliers} ${t.isRequired}`;
    if (formData.productId === 0)
      errors.productId = `${t.product} ${t.isRequired}`;
    if (formData.quantity <= 0)
      errors.quantity = `${t.quantity} ${t.mustBePositive}`;
    if (!formData.purchaseDate)
      errors.purchaseDate = `${t.purchaseDate} ${t.isRequired}`;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setFormData({
      supplierId: 0,
      productId: 0,
      quantity: 0,
      purchaseDate: new Date().toISOString().split("T")[0],
    });
    setFormErrors({});
    setCurrentId(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "supplierId" || name === "productId" || name === "quantity"
          ? Number(value)
          : value,
    }));
    if (value || (name === "quantity" && Number(value) > 0))
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAdd = () => {
    if (!validateForm()) return;
    const supplier = suppliers.find((s) => s.id === formData.supplierId);
    const product = products.find((p) => p.id === formData.productId);
    if (!supplier || !product) return;
    const newId = Math.max(0, ...purchases.map((p) => p.id)) + 1;
    const totalCost = product.price * formData.quantity;
    setPurchases((prev) => [
      ...prev,
      {
        id: newId,
        supplierId: formData.supplierId,
        supplierName: supplier.name,
        productId: formData.productId,
        productName: product.name,
        quantity: formData.quantity,
        totalCost,
        purchaseDate: formData.purchaseDate,
      },
    ]);
    resetForm();
  };

  const handleEdit = (id: number) => {
    const purchase = purchases.find((p) => p.id === id);
    if (purchase) {
      setFormData({
        supplierId: purchase.supplierId,
        productId: purchase.productId,
        quantity: purchase.quantity,
        purchaseDate: purchase.purchaseDate,
      });
      setCurrentId(id);
      setIsEditing(true);
      setIsModalOpen(true);
    }
  };

  const handleUpdate = () => {
    if (!validateForm() || !currentId) return;
    const supplier = suppliers.find((s) => s.id === formData.supplierId);
    const product = products.find((p) => p.id === formData.productId);
    if (!supplier || !product) return;
    const totalCost = product.price * formData.quantity;
    setPurchases((prev) =>
      prev.map((p) =>
        p.id === currentId
          ? {
              ...p,
              supplierId: formData.supplierId,
              supplierName: supplier.name,
              productId: formData.productId,
              productName: product.name,
              quantity: formData.quantity,
              totalCost,
              purchaseDate: formData.purchaseDate,
            }
          : p
      )
    );
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm(t.confirmDelete)) {
      setPurchases((prev) => prev.filter((p) => p.id !== id));
      const newPurchaseCount = purchases.length - 1;
      const maxPage = Math.max(1, Math.ceil(newPurchaseCount / itemsPerPage));
      if (currentPage > maxPage) setCurrentPage(maxPage);
    }
  };

  const handleExportToExcel = () => {
    try {
      setImportError("");
      const exportData = purchases.map((purchase) => ({
        ID: purchase.id,
        Supplier: purchase.supplierName,
        Product: purchase.productName,
        Quantity: purchase.quantity,
        TotalCost: purchase.totalCost,
        PurchaseDate: purchase.purchaseDate,
      }));
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Purchases");
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const filename = `purchases_export_${timestamp}.xlsx`;
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
        const getColumnIndex = (possibleNames: string[]): number => {
          const foundName = possibleNames.find((name) =>
            headers.includes(name.toLowerCase())
          );
          return foundName
            ? headers.findIndex((h) => h.includes(foundName.toLowerCase()))
            : -1;
        };
        const supplierNameIndex = getColumnIndex(["supplier", "suppliername"]);
        const productNameIndex = getColumnIndex(["product", "productname"]);
        const quantityIndex = getColumnIndex(["quantity"]);
        const purchaseDateIndex = getColumnIndex(["purchasedate", "date"]);
        if (
          supplierNameIndex === -1 ||
          productNameIndex === -1 ||
          quantityIndex === -1 ||
          purchaseDateIndex === -1
        ) {
          setImportError(
            "Excel file must contain columns for Supplier, Product, Quantity, and Purchase Date."
          );
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
        const importedPurchases: PurchaseData[] = [];
        const maxExistingId = Math.max(0, ...purchases.map((p) => p.id));
        dataRows.forEach((row) => {
          const supplierName = String(row[supplierNameIndex] || "").trim();
          const productName = String(row[productNameIndex] || "").trim();
          const quantity = Number(row[quantityIndex]) || 0;
          const purchaseDate = String(row[purchaseDateIndex] || "").trim();
          const supplier = suppliers.find(
            (s) => s.name.toLowerCase() === supplierName.toLowerCase()
          );
          const product = products.find(
            (p) => p.name.toLowerCase() === productName.toLowerCase()
          );
          if (supplier && product && quantity > 0 && purchaseDate) {
            const totalCost = product.price * quantity;
            importedPurchases.push({
              id: maxExistingId + importedPurchases.length + 1,
              supplierId: supplier.id,
              supplierName: supplier.name,
              productId: product.id,
              productName: product.name,
              quantity,
              totalCost,
              purchaseDate,
            });
          }
        });
        if (importedPurchases.length === 0) {
          setImportError("No valid purchase data found in the Excel file.");
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
        setPurchases((prev) => [...prev, ...importedPurchases]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        console.log(
          `Successfully imported ${importedPurchases.length} purchases`
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

  const filteredPurchases = purchases.filter((purchase) =>
    Object.values(purchase).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredPurchases.length / itemsPerPage)
  );
  const paginatedPurchases = filteredPurchases.slice(
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
            {t.purchases}
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
                  {t.suppliers}
                </th>
                <th
                  className={`px-6 py-3 text-left text-sm font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {t.product}
                </th>
                <th
                  className={`px-6 py-3 text-left text-sm font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {t.quantity}
                </th>
                <th
                  className={`px-6 py-3 text-left text-sm font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {t.totalCost}
                </th>
                <th
                  className={`px-6 py-3 text-left text-sm font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {t.purchaseDate}
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
              {paginatedPurchases.length > 0 ? (
                paginatedPurchases.map((purchase) => (
                  <tr
                    key={purchase.id}
                    className={`border-t ${
                      darkMode
                        ? "border-gray-700 text-gray-200"
                        : "border-gray-200 text-gray-800"
                    } hover:${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
                  >
                    <td className="px-6 py-4">{purchase.supplierName}</td>
                    <td className="px-6 py-4">{purchase.productName}</td>
                    <td className="px-6 py-4">{purchase.quantity}</td>
                    <td className="px-6 py-4">
                      {purchase.totalCost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">{purchase.purchaseDate}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => handleEdit(purchase.id)}
                        className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                      >
                        {t.edit}
                      </button>
                      <button
                        onClick={() => handleDelete(purchase.id)}
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
                    {t.suppliers}
                  </label>
                  <select
                    name="supplierId"
                    value={formData.supplierId}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-gray-50 border-gray-200 text-gray-800"
                    } ${formErrors.supplierId ? "border-red-500" : ""}`}
                  >
                    <option value={0}>{t.select}</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.supplierId && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.supplierId}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    {t.product}
                  </label>
                  <select
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-gray-50 border-gray-200 text-gray-800"
                    } ${formErrors.productId ? "border-red-500" : ""}`}
                  >
                    <option value={0}>{t.select}</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.productId && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.productId}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    {t.quantity}
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity || ""}
                    onChange={handleInputChange}
                    placeholder={t.quantity}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                        : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500"
                    } ${formErrors.quantity ? "border-red-500" : ""}`}
                    step="1"
                  />
                  {formErrors.quantity && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.quantity}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    {t.purchaseDate}
                  </label>
                  <input
                    type="date"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-gray-50 border-gray-200 text-gray-800"
                    } ${formErrors.purchaseDate ? "border-red-500" : ""}`}
                  />
                  {formErrors.purchaseDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.purchaseDate}
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

export default PurchasesPage;
