"use client";

import React, { useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import {
  useLanguageContext,
  useTranslations,
} from "../context/LanguageContext";
import * as XLSX from "xlsx";

interface SupplierData {
  id: number;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  companyAddress: string;
}

const SuppliersPage: React.FC = () => {
  const { darkMode } = useLanguageContext();
  const t = useTranslations();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [formData, setFormData] = useState<SupplierData>({
    id: 0,
    name: "",
    contactName: "",
    email: "",
    phone: "",
    companyAddress: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<SupplierData>>({});
  const [importError, setImportError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const validateForm = (): boolean => {
    const errors: Partial<SupplierData> = {};
    if (!formData.name.trim())
      errors.name = `${t.supplierName} ${t.isRequired}`;
    if (!formData.contactName.trim())
      errors.contactName = `${t.contactName} ${t.isRequired}`;
    if (!formData.email.trim()) errors.email = `${t.email} ${t.isRequired}`;
    if (!formData.phone.trim()) errors.phone = `${t.phone} ${t.isRequired}`;
    if (!formData.companyAddress.trim())
      errors.companyAddress = `${t.companyAddress} ${t.isRequired}`;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setFormData({
      id: 0,
      name: "",
      contactName: "",
      email: "",
      phone: "",
      companyAddress: "",
    });
    setFormErrors({});
    setCurrentId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value.trim()) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAdd = () => {
    if (!validateForm()) return;
    const newId = Math.max(0, ...suppliers.map((s) => s.id)) + 1;
    setSuppliers((prev) => [...prev, { ...formData, id: newId }]);
    resetForm();
  };

  const handleEdit = (id: number) => {
    const supplier = suppliers.find((s) => s.id === id);
    if (supplier) {
      setFormData(supplier);
      setCurrentId(id);
      setIsEditing(true);
      setIsModalOpen(true);
    }
  };

  const handleUpdate = () => {
    if (!validateForm() || !currentId) return;
    setSuppliers((prev) =>
      prev.map((s) => (s.id === currentId ? { ...formData, id: s.id } : s))
    );
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm(t.confirmDelete)) {
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
      const newSupplierCount = suppliers.length - 1;
      const maxPage = Math.max(1, Math.ceil(newSupplierCount / itemsPerPage));
      if (currentPage > maxPage) setCurrentPage(maxPage);
    }
  };

  const handleExportToExcel = () => {
    try {
      setImportError("");
      const exportData = suppliers.map((supplier) => ({
        ID: supplier.id,
        Name: supplier.name,
        ContactName: supplier.contactName,
        Email: supplier.email,
        Phone: supplier.phone,
        CompanyAddress: supplier.companyAddress,
      }));
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Suppliers");
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const filename = `suppliers_export_${timestamp}.xlsx`;
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
                possibleNames.some((name) =>
                  h.includes(name.toLowerCase())
                )
              )
            : -1;
        const nameIndex = getColumnIndex(["name", "nom"]);
        const contactNameIndex = getColumnIndex(["contactname", "contact"]);
        const emailIndex = getColumnIndex(["email", "e-mail"]);
        const phoneIndex = getColumnIndex(["phone", "telephone"]);
        const companyAddressIndex = getColumnIndex([
          "companyaddress",
          "address",
        ]);
        if (
          nameIndex === -1 ||
          contactNameIndex === -1 ||
          emailIndex === -1 ||
          phoneIndex === -1 ||
          companyAddressIndex === -1
        ) {
          setImportError(
            "Excel file must contain columns for Name, Contact Name, Email, Phone, and Company Address."
          );
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
        const importedSuppliers: SupplierData[] = [];
        const maxExistingId = Math.max(0, ...suppliers.map((s) => s.id));
        dataRows.forEach((row) => {
          const name = String(row[nameIndex] || "").trim();
          const contactName = String(row[contactNameIndex] || "").trim();
          const email = String(row[emailIndex] || "").trim();
          const phone = String(row[phoneIndex] || "").trim();
          const companyAddress = String(row[companyAddressIndex] || "").trim();
          if (name && contactName && email && phone && companyAddress) {
            importedSuppliers.push({
              id: maxExistingId + importedSuppliers.length + 1,
              name,
              contactName,
              email,
              phone,
              companyAddress,
            });
          }
        });
        if (importedSuppliers.length === 0) {
          setImportError("No valid supplier data found in the Excel file.");
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
        setSuppliers((prev) => [...prev, ...importedSuppliers]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        console.log(
          `Successfully imported ${importedSuppliers.length} suppliers`
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

  const filteredSuppliers = suppliers.filter((supplier) =>
    Object.values(supplier).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredSuppliers.length / itemsPerPage)
  );
  const paginatedSuppliers = filteredSuppliers.slice(
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
            {t.suppliers}
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
                  {t.supplierName}
                </th>
                <th
                  className={`px-6 py-3 text-left text-sm font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {t.contactName}
                </th>
                <th
                  className={`px-6 py-3 text-left text-sm font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {t.email}
                </th>
                <th
                  className={`px-6 py-3 text-left text-sm font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {t.phone}
                </th>
                <th
                  className={`px-6 py-3 text-left text-sm font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {t.companyAddress}
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
              {paginatedSuppliers.length > 0 ? (
                paginatedSuppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className={`border-t ${
                      darkMode
                        ? "border-gray-700 text-gray-200"
                        : "border-gray-200 text-gray-800"
                    } hover:${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
                  >
                    <td className="px-6 py-4">{supplier.name}</td>
                    <td className="px-6 py-4">{supplier.contactName}</td>
                    <td className="px-6 py-4">{supplier.email}</td>
                    <td className="px-6 py-4">{supplier.phone}</td>
                    <td className="px-6 py-4">{supplier.companyAddress}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => handleEdit(supplier.id)}
                        className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                      >
                        {t.edit}
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.id)}
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
                    {t.supplierName}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t.supplierName}
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
                    {t.contactName}
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    placeholder={t.contactName}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                        : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500"
                    } ${formErrors.contactName ? "border-red-500" : ""}`}
                  />
                  {formErrors.contactName && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.contactName}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    {t.email}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t.email}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                        : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500"
                    } ${formErrors.email ? "border-red-500" : ""}`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    {t.phone}
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t.phone}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                        : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500"
                    } ${formErrors.phone ? "border-red-500" : ""}`}
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    {t.companyAddress}
                  </label>
                  <input
                    type="text"
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleInputChange}
                    placeholder={t.companyAddress}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                        : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500"
                    } ${formErrors.companyAddress ? "border-red-500" : ""}`}
                  />
                  {formErrors.companyAddress && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.companyAddress}
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

export default SuppliersPage;
