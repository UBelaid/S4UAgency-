import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import { useAppContext, useTranslations } from '../context/LanguageContext';
import * as XLSX from 'xlsx';

interface Purchase {
  id: number;
  supplierId: number;
  productId: number;
  quantity: number;
  totalCost: number;
  date: string;
}

const PurchasesPage = () => {
  const { darkMode } = useAppContext();
  const t = useTranslations();
  const [purchases, setPurchases] = useState<Purchase[]>([
    { id: 1, supplierId: 1, productId: 1, quantity: 10, totalCost: 8500.00, date: '2025-05-20' },
    { id: 2, supplierId: 2, productId: 2, quantity: 50, totalCost: 2000.00, date: '2025-05-21' },
  ]);
  const [newPurchase, setNewPurchase] = useState<Purchase>({
    id: 0,
    supplierId: 0,
    productId: 0,
    quantity: 0,
    totalCost: 0,
    date: new Date().toISOString().split('T')[0],
  });
  const [editPurchase, setEditPurchase] = useState<Purchase | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>(purchases);

  // Autosearch functionality
  useEffect(() => {
    const filtered = purchases.filter(
      (purchase) =>
        purchase.supplierId.toString().includes(searchQuery) ||
        purchase.productId.toString().includes(searchQuery)
    );
    setFilteredPurchases(filtered);
  }, [searchQuery, purchases]);

  // Add purchase
  const handleAddPurchase = () => {
    if (
      newPurchase.supplierId > 0 &&
      newPurchase.productId > 0 &&
      newPurchase.quantity > 0 &&
      newPurchase.totalCost > 0 &&
      newPurchase.date
    ) {
      const newId = purchases.length ? purchases[purchases.length - 1].id + 1 : 1;
      setPurchases([...purchases, { ...newPurchase, id: newId }]);
      setNewPurchase({
        id: 0,
        supplierId: 0,
        productId: 0,
        quantity: 0,
        totalCost: 0,
        date: new Date().toISOString().split('T')[0],
      });
    } else {
      alert('Please fill all fields with valid data.');
    }
  };

  // Edit purchase
  const handleEditPurchase = (purchase: Purchase) => {
    setEditPurchase(purchase);
  };

  const handleUpdatePurchase = () => {
    if (editPurchase) {
      setPurchases(
        purchases.map((p) =>
          p.id === editPurchase.id ? { ...editPurchase } : p
        )
      );
      setEditPurchase(null);
    }
  };

  // Delete purchase
  const handleDeletePurchase = (id: number) => {
    setPurchases(purchases.filter((p) => p.id !== id));
  };

  // Export to Excel
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(purchases);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Purchases');
    XLSX.writeFile(wb, 'purchases.xlsx');
  };

  // Import from Excel
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const importedPurchases: Purchase[] = XLSX.utils.sheet_to_json(worksheet);
        setPurchases([...purchases, ...importedPurchases]);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
      <Sidebar />
      <div className="flex-1 p-8">
        <h2 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">{t.purchases}</h2>

        {/* Add Purchase Form */}
        <div className="mb-8 p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            {editPurchase ? t.edit : t.add} {t.purchases}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input
              type="number"
              placeholder="Supplier ID"
              value={editPurchase ? editPurchase.supplierId : newPurchase.supplierId}
              onChange={(e) =>
                editPurchase
                  ? setEditPurchase({ ...editPurchase, supplierId: parseInt(e.target.value) || 0 })
                  : setNewPurchase({ ...newPurchase, supplierId: parseInt(e.target.value) || 0 })
              }
              className={`px-4 py-3 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            <input
              type="number"
              placeholder="Product ID"
              value={editPurchase ? editPurchase.productId : newPurchase.productId}
              onChange={(e) =>
                editPurchase
                  ? setEditPurchase({ ...editPurchase, productId: parseInt(e.target.value) || 0 })
                  : setNewPurchase({ ...newPurchase, productId: parseInt(e.target.value) || 0 })
              }
              className={`px-4 py-3 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={editPurchase ? editPurchase.quantity : newPurchase.quantity}
              onChange={(e) =>
                editPurchase
                  ? setEditPurchase({ ...editPurchase, quantity: parseInt(e.target.value) || 0 })
                  : setNewPurchase({ ...newPurchase, quantity: parseInt(e.target.value) || 0 })
              }
              className={`px-4 py-3 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            <input
              type="number"
              placeholder="Total Cost"
              value={editPurchase ? editPurchase.totalCost : newPurchase.totalCost}
              onChange={(e) =>
                editPurchase
                  ? setEditPurchase({ ...editPurchase, totalCost: parseFloat(e.target.value) || 0 })
                  : setNewPurchase({ ...newPurchase, totalCost: parseFloat(e.target.value) || 0 })
              }
              className={`px-4 py-3 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            <input
              type="date"
              value={editPurchase ? editPurchase.date : newPurchase.date}
              onChange={(e) =>
                editPurchase
                  ? setEditPurchase({ ...editPurchase, date: e.target.value })
                  : setNewPurchase({ ...newPurchase, date: e.target.value })
              }
              className={`px-4 py-3 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          <div className="mt-6 flex space-x-4">
            <button
              onClick={editPurchase ? handleUpdatePurchase : handleAddPurchase}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            >
              {editPurchase ? t.update : t.add}
            </button>
            {editPurchase && (
              <button
                onClick={() => setEditPurchase(null)}
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
            className={`flex-1 px-4 py-3 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          <button
            onClick={handleExport}
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-200"
          >
            {t.export}
          </button>
          <label className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 cursor-pointer">
            {t.import}
            <input type="file" accept=".xlsx, .xls" onChange={handleImport} className="hidden" />
          </label>
        </div>

        {/* Purchases Table */}
        <div className="overflow-x-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="p-4 text-left text-gray-700 dark:text-gray-300">Supplier ID</th>
                  <th className="p-4 text-left text-gray-700 dark:text-gray-300">Product ID</th>
                  <th className="p-4 text-left text-gray-700 dark:text-gray-300">Quantity</th>
                  <th className="p-4 text-left text-gray-700 dark:text-gray-300">Total Cost</th>
                  <th className="p-4 text-left text-gray-700 dark:text-gray-300">Date</th>
                  <th className="p-4 text-left text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.map((purchase) => (
                  <tr key={purchase.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="p-4">{purchase.supplierId}</td>
                    <td className="p-4">{purchase.productId}</td>
                    <td className="p-4">{purchase.quantity}</td>
                    <td className="p-4">${purchase.totalCost.toFixed(2)}</td>
                    <td className="p-4">{purchase.date}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleEditPurchase(purchase)}
                        className="text-blue-500 hover:underline mr-4"
                      >
                        {t.edit}
                      </button>
                      <button
                        onClick={() => handleDeletePurchase(purchase.id)}
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
          <Link href="/dashboard" className="text-purple-600 hover:underline font-medium">
            {t.dashboard}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PurchasesPage;