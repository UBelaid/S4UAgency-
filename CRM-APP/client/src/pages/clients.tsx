import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "../components/Sidebar";
import {  useLanguageContext, useTranslations } from "../context/LanguageContext";
import * as XLSX from "xlsx";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const ClientsPage = () => {
  const { darkMode } = useLanguageContext();
  const t = useTranslations();
  const [clients, setClients] = useState<Client[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "098-765-4321",
    },
  ]);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClients, setFilteredClients] = useState<Client[]>(clients);

  // Autosearch functionality
  useEffect(() => {
    const filtered = clients.filter(
      (client) =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [searchQuery, clients]);

  // Add client
  const handleAddClient = () => {
    if (newClient.name && newClient.email && newClient.phone) {
      const newId = clients.length ? clients[clients.length - 1].id + 1 : 1;
      setClients([...clients, { id: newId, ...newClient }]);
      setNewClient({ name: "", email: "", phone: "" });
    } else {
      alert("Please fill all fields with valid data.");
    }
  };

  // Edit client
  const handleEditClient = (client: Client) => {
    setEditClient(client);
  };

  const handleUpdateClient = () => {
    if (editClient) {
      setClients(
        clients.map((c) => (c.id === editClient.id ? { ...editClient } : c))
      );
      setEditClient(null);
    }
  };

  // Delete client
  const handleDeleteClient = (id: number) => {
    setClients(clients.filter((c) => c.id !== id));
  };

  // Export to Excel
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(clients);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clients");
    XLSX.writeFile(wb, "clients.xlsx");
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
        const importedClients: Client[] = XLSX.utils.sheet_to_json(worksheet);
        setClients([...clients, ...importedClients]);
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
          {t.clients}
        </h2>

        {/* Add Client Form */}
        <div className="mb-8 p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            {editClient ? t.edit : t.add} {t.clients}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input
              type="text"
              placeholder="Name"
              value={editClient ? editClient.name : newClient.name}
              onChange={(e) =>
                editClient
                  ? setEditClient({ ...editClient, name: e.target.value })
                  : setNewClient({ ...newClient, name: e.target.value })
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
              value={editClient ? editClient.email : newClient.email}
              onChange={(e) =>
                editClient
                  ? setEditClient({ ...editClient, email: e.target.value })
                  : setNewClient({ ...newClient, email: e.target.value })
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
              value={editClient ? editClient.phone : newClient.phone}
              onChange={(e) =>
                editClient
                  ? setEditClient({ ...editClient, phone: e.target.value })
                  : setNewClient({ ...newClient, phone: e.target.value })
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
              onClick={editClient ? handleUpdateClient : handleAddClient}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            >
              {editClient ? t.update : t.add}
            </button>
            {editClient && (
              <button
                onClick={() => setEditClient(null)}
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

        {/* Clients Table */}
        <div className="overflow-x-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="p-4 text-left text-gray-700 dark:text-gray-300">
                    Name
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
                {filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="p-4">{client.name}</td>
                    <td className="p-4">{client.email}</td>
                    <td className="p-4">{client.phone}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleEditClient(client)}
                        className="text-blue-500 hover:underline mr-4"
                      >
                        {t.edit}
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client.id)}
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

export default ClientsPage;
