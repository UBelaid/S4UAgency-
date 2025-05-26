import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "../components/Sidebar";
import { useLanguageContext } from "../context/LanguageContext";
import * as XLSX from "xlsx";

interface Sale {
  id: number;
  clientId: number;
  productId: number;
  quantity: number;
  totalPrice: number;
  date: string;
}

const SalesPage = () => {
  const { darkMode } = useLanguageContext();
  const [sales, setSales] = useState<Sale[]>([
    {
      id: 1,
      clientId: 1,
      productId: 1,
      quantity: 2,
      totalPrice: 1999.98,
      date: "2025-05-20",
    },
    {
      id: 2,
      clientId: 2,
      productId: 2,
      quantity: 5,
      totalPrice: 249.95,
      date: "2025-05-21",
    },
  ]);
  const [newSale, setNewSale] = useState<Sale>({
    id: 0,
    clientId: 0,
    productId: 0,
    quantity: 0,
    totalPrice: 0,
    date: new Date().toISOString().split("T")[0],
  });
  const [editSale, setEditSale] = useState<Sale | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSales, setFilteredSales] = useState<Sale[]>(sales);

  // Autosearch functionality
  useEffect(() => {
    const filtered = sales.filter(
      (sale) =>
        sale.clientId.toString().includes(searchQuery) ||
        sale.productId.toString().includes(searchQuery)
    );
    setFilteredSales(filtered);
  }, [searchQuery, sales]);

  // Add sale
  const handleAddSale = () => {
    if (
      newSale.clientId > 0 &&
      newSale.productId > 0 &&
      newSale.quantity > 0 &&
      newSale.totalPrice > 0 &&
      newSale.date
    ) {
      const newId = sales.length ? sales[sales.length - 1].id + 1 : 1;
      setSales([...sales, { ...newSale, id: newId }]);
      setNewSale({
        id: 0,
        clientId: 0,
        productId: 0,
        quantity: 0,
        totalPrice: 0,
        date: new Date().toISOString().split("T")[0],
      });
    } else {
      alert("Please fill all fields with valid data.");
    }
  };

  // Edit sale
  const handleEditSale = (sale: Sale) => {
    setEditSale(sale);
  };

  const handleUpdateSale = () => {
    if (editSale) {
      setSales(sales.map((s) => (s.id === editSale.id ? { ...editSale } : s)));
      setEditSale(null);
    }
  };

  // Delete sale
  const handleDeleteSale = (id: number) => {
    setSales(sales.filter((s) => s.id !== id));
  };

  // Export to Excel
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(sales);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales");
    XLSX.writeFile(wb, "sales.xlsx");
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
        const importedSales: Sale[] = XLSX.utils.sheet_to_json(worksheet);
        setSales([...sales, ...importedSales]);
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
          Sales
        </h2>

        {/* Add Sale Form */}
        <div className="mb-8 p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            {editSale ? "Edit Sale" : "Add New Sale"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input
              type="number"
              placeholder="Client ID"
              value={editSale ? editSale.clientId : newSale.clientId}
              onChange={(e) =>
                editSale
                  ? setEditSale({
                      ...editSale,
                      clientId: parseInt(e.target.value) || 0,
                    })
                  : setNewSale({
                      ...newSale,
                      clientId: parseInt(e.target.value) || 0,
                    })
              }
              className={`px-4 py-3 border rounded-lg ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-gray-50 border-gray-200 text-gray-800"
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            <input
              type="number"
              placeholder="Product ID"
              value={editSale ? editSale.productId : newSale.productId}
              onChange={(e) =>
                editSale
                  ? setEditSale({
                      ...editSale,
                      productId: parseInt(e.target.value) || 0,
                    })
                  : setNewSale({
                      ...newSale,
                      productId: parseInt(e.target.value) || 0,
                    })
              }
              className={`px-4 py-3 border rounded-lg ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-gray-50 border-gray-200 text-gray-800"
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={editSale ? editSale.quantity : newSale.quantity}
              onChange={(e) =>
                editSale
                  ? setEditSale({
                      ...editSale,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  : setNewSale({
                      ...newSale,
                      quantity: parseInt(e.target.value) || 0,
                    })
              }
              className={`px-4 py-3 border rounded-lg ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-gray-50 border-gray-200 text-gray-800"
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            <input
              type="number"
              placeholder="Total Price"
              value={editSale ? editSale.totalPrice : newSale.totalPrice}
              onChange={(e) =>
                editSale
                  ? setEditSale({
                      ...editSale,
                      totalPrice: parseFloat(e.target.value) || 0,
                    })
                  : setNewSale({
                      ...newSale,
                      totalPrice: parseFloat(e.target.value) || 0,
                    })
              }
              className={`px-4 py-3 border rounded-lg ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-gray-50 border-gray-200 text-gray-800"
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            <input
              type="date"
              value={editSale ? editSale.date : newSale.date}
              onChange={(e) =>
                editSale
                  ? setEditSale({ ...editSale, date: e.target.value })
                  : setNewSale({ ...newSale, date: e.target.value })
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
              onClick={editSale ? handleUpdateSale : handleAddSale}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            >
              {editSale ? "Update" : "Add"}
            </button>
            {editSale && (
              <button
                onClick={() => setEditSale(null)}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex space-x-4">
          <input
            type="text"
            placeholder="Search sales by Client ID or Product ID..."
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
            Export to Excel
          </button>
          <label className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 cursor-pointer">
            Import from Excel
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>

        {/* Sales Table */}
        <div className="overflow-x-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="p-4 text-left text-gray-700 dark:text-gray-300">
                    Client ID
                  </th>
                  <th className="p-4 text-left text-gray-700 dark:text-gray-300">
                    Product ID
                  </th>
                  <th className="p-4 text-left text-gray-700 dark:text-gray-300">
                    Quantity
                  </th>
                  <th className="p-4 text-left text-gray-700 dark:text-gray-300">
                    Total Price
                  </th>
                  <th className="p-4 text-left text-gray-700 dark:text-gray-300">
                    Date
                  </th>
                  <th className="p-4 text-left text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="p-4">{sale.clientId}</td>
                    <td className="p-4">{sale.productId}</td>
                    <td className="p-4">{sale.quantity}</td>
                    <td className="p-4">${sale.totalPrice.toFixed(2)}</td>
                    <td className="p-4">{sale.date}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleEditSale(sale)}
                        className="text-blue-500 hover:underline mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSale(sale.id)}
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
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
