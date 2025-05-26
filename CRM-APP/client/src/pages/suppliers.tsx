import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "../components/Sidebar";
import {
  useLanguageContext,
  useTranslations,
} from "../context/LanguageContext";
import * as XLSX from "xlsx";

interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
}

const SuppliersPage = () => {
  const { darkMode } = useLanguageContext();
  const t = useTranslations();
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: 1,
      name: "ABC Corp",
      contactPerson: "Alice Brown",
      email: "alice@abccorp.com",
      phone: "123-456-7890",
    },
    {
      id: 2,
      name: "XYZ Ltd",
      contactPerson: "Bob White",
      email: "bob@xyz.com",
      phone: "098-765-4321",
    },
  ]);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
  });
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSuppliers, setFilteredSuppliers] =
    useState<Supplier[]>(suppliers);

  // Autosearch functionality
  useEffect(() => {
    const filtered = suppliers.filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSuppliers(filtered);
  }, [searchQuery, suppliers]);

  // Add supplier
  const handleAddSupplier = () => {
    if (
      newSupplier.name &&
      newSupplier.contactPerson &&
      newSupplier.email &&
      newSupplier.phone
    ) {
      const newId = suppliers.length
        ? suppliers[suppliers.length - 1].id + 1
        : 1;
      setSuppliers([...suppliers, { id: newId, ...newSupplier }]);
      setNewSupplier({ name: "", contactPerson: "", email: "", phone: "" });
    } else {
      alert("Please fill all fields with valid data.");
    }
  };

  // Edit supplier
  const handleEditSupplier = (supplier: Supplier) => {
    setEditSupplier(supplier);
  };

  const handleUpdateSupplier = () => {
    if (editSupplier) {
      setSuppliers(
        suppliers.map((s) =>
          s.id === editSupplier.id ? { ...editSupplier } : s
        )
      );
      setEditSupplier(null);
    }
  };

  // Delete supplier
  const handleDeleteSupplier = (id: number) => {
    setSuppliers(suppliers.filter((s) => s.id !== id));
  };

  // Export to Excel
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(suppliers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Suppliers");
    XLSX.writeFile(wb, "suppliers.xlsx");
  };

  // Import from Excel
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const importedSuppliers: Supplier[] =
          XLSX.utils.sheet_to_json(worksheet);
        setSuppliers([...suppliers, ...importedSuppliers]);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div
      className={`flex min-h-screen ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-800"
      }`}
    >
      <Sidebar />
      <div className="flex-1 p-8">
        <h2 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
          {t.suppliers}
        </h2>

        {/* Add Supplier Form */}
        <div className="mb-8 p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            {editSupplier ? t.edit : t.add} {t.suppliers}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Supplier Name"
              value={editSupplier ? editSupplier.name : newSupplier.name}
              onChange={(e) =>
                editSupplier
                  ? setEditSupplier({ ...editSupplier, name: e.target.value })
                  : setNewSupplier({ ...newSupplier, name: e.target.value })
              }
              className={`px-4 py-3 border rounded-lg ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-gray-50 border-gray-200 text-gray-800"
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            <input
              type="text"
              placeholder="Contact Person"
              value={
                editSupplier
                  ? editSupplier.contactPerson
                  : newSupplier.contactPerson
              }
              onChange={(e) =>
                editSupplier
                  ? setEditSupplier({
                      ...editSupplier,
                      contactPerson: e.target.value,
                    })
                  : setNewSupplier({
                      ...newSupplier,
                      contactPerson: e.target.value,
                    })
              }
              className={`px-4 py-3 border rounded-lg ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-gray-50 border-gray-200 text-gray-800"
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            <input
              type="email"
              placeholder="Email"
              value={editSupplier ? editSupplier.email : newSupplier.email}
              onChange={(e) =>
                editSupplier
                  ? setEditSupplier({ ...editSupplier, email: e.target.value })
                  : setNewSupplier({ ...newSupplier, email: e.target.value })
              }
              className={`px-4 py-3 border rounded-lg ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-gray-50 border-gray-200 text-gray-800"
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            <input
              type="text"
              placeholder="Phone"
              value={editSupplier ? editSupplier.phone : newSupplier.phone}
              onChange={(e) =>
                editSupplier
                  ? setEditSupplier({ ...editSupplier, phone: e.target.value })
                  : setNewSupplier({ ...newSupplier, phone: e.target.value })
              }
              className={`px-4 py-3 border rounded-lg ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-gray-50 border-gray-200 text-gray-800"
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          <div className="mt-6 flex space-x-4">
            <button
              onClick={editSupplier ? handleUpdateSupplier : handleAddSupplier}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            >
              {editSupplier ? t.update : t.add}
            </button>
            {editSupplier && (
              <button
                onClick={() => setEditSupplier(null)}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-200"
              >
                {t.cancel}
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex space-x-4">
          <input
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`flex-1 px-4 py-3 border rounded-lg ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-gray-200"
                : "bg-gray-50 border-gray-200 text-gray-800"
            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          <button
            onClick={handleExport}
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-200"
          >
            {t.export}
          </button>
          <label className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 cursor-pointer">
            {t.import}
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>

        {/* Suppliers Table */}
        <div className="overflow-x-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="p-4 text-left text-gray-700 dark:text-gray-300">
                    Name
                  </th>
                  <th className="p-4 text-left text-gray-700 dark:text-gray-300">
                    Contact Person
                  </th>
                  <th className="p-4 text-left text-gray-700 dark:text-gray-300">
                    Email
                  </th>
                  <th className="p-4 text-left text-gray-700 dark:text-gray-300">
                    Phone
                  </th>
                  <th className="p-4 text-left text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="p-4">{supplier.name}</td>
                    <td className="p-4">{supplier.contactPerson}</td>
                    <td className="p-4">{supplier.email}</td>
                    <td className="p-4">{supplier.phone}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleEditSupplier(supplier)}
                        className="text-blue-500 hover:underline mr-4"
                      >
                        {t.edit}
                      </button>
                      <button
                        onClick={() => handleDeleteSupplier(supplier.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/dashboard"
            className="text-purple-600 hover:underline font-medium"
          >
            {t.dashboard}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuppliersPage;
