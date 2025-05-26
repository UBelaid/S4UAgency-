import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "../components/Sidebar";
import { useLanguageContext, useTranslations } from "../context/LanguageContext";
import * as XLSX from "xlsx";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

const ProductsPage = () => {
  const { darkMode } = useLanguageContext();
  const t = useTranslations();
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Laptop",
      category: "Electronics",
      price: 999.99,
      stock: 50,
    },
    {
      id: 2,
      name: "Headphones",
      category: "Accessories",
      price: 49.99,
      stock: 200,
    },
  ]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: 0,
    stock: 0,
  });
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  // Autosearch functionality
  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  // Add product
  const handleAddProduct = () => {
    if (
      newProduct.name &&
      newProduct.category &&
      newProduct.price > 0 &&
      newProduct.stock >= 0
    ) {
      const newId = products.length ? products[products.length - 1].id + 1 : 1;
      setProducts([...products, { id: newId, ...newProduct }]);
      setNewProduct({ name: "", category: "", price: 0, stock: 0 });
    } else {
      alert("Please fill all fields with valid data.");
    }
  };

  // Edit product
  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
  };

  const handleUpdateProduct = () => {
    if (editProduct) {
      setProducts(
        products.map((p) => (p.id === editProduct.id ? { ...editProduct } : p))
      );
      setEditProduct(null);
    }
  };

  // Delete product
  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // Export to Excel
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(products);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "products.xlsx");
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
        const importedProducts: Product[] = XLSX.utils.sheet_to_json(worksheet);
        setProducts([...products, ...importedProducts]);
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
          {t.products}
        </h2>

        {/* Add Product Form */}
        <div className="mb-8 p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            {editProduct ? t.edit : t.add} {t.products}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Product Name"
              value={editProduct ? editProduct.name : newProduct.name}
              onChange={(e) =>
                editProduct
                  ? setEditProduct({ ...editProduct, name: e.target.value })
                  : setNewProduct({ ...newProduct, name: e.target.value })
              }
              className={`px-4 py-3 border rounded-lg ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-gray-50 border-gray-200 text-gray-800"
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            <input
              type="text"
              placeholder="Category"
              value={editProduct ? editProduct.category : newProduct.category}
              onChange={(e) =>
                editProduct
                  ? setEditProduct({ ...editProduct, category: e.target.value })
                  : setNewProduct({ ...newProduct, category: e.target.value })
              }
              className={`px-4 py-3 border rounded-lg ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-gray-50 border-gray-200 text-gray-800"
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            <input
              type="number"
              placeholder="Price"
              value={editProduct ? editProduct.price : newProduct.price}
              onChange={(e) =>
                editProduct
                  ? setEditProduct({
                      ...editProduct,
                      price: parseFloat(e.target.value) || 0,
                    })
                  : setNewProduct({
                      ...newProduct,
                      price: parseFloat(e.target.value) || 0,
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
              placeholder="Stock"
              value={editProduct ? editProduct.stock : newProduct.stock}
              onChange={(e) =>
                editProduct
                  ? setEditProduct({
                      ...editProduct,
                      stock: parseInt(e.target.value) || 0,
                    })
                  : setNewProduct({
                      ...newProduct,
                      stock: parseInt(e.target.value) || 0,
                    })
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
              onClick={editProduct ? handleUpdateProduct : handleAddProduct}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            >
              {editProduct ? t.update : t.add}
            </button>
            {editProduct && (
              <button
                onClick={() => setEditProduct(null)}
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

        {/* Products Table */}
        <div className="overflow-x-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="p-4 text-left text-gray-700 dark:text-gray-300">
                    Name
                  </th>
                  <th className="p-4 text-left text-gray-700 dark:text-gray-300">
                    Category
                  </th>
                  <th className="p-4 text-left text-gray-700 dark:text-gray-300">
                    Price
                  </th>
                  <th className="p-4 text-left text-gray-700 dark:text-gray-300">
                    Stock
                  </th>
                  <th className="p-4 text-left text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="p-4">{product.name}</td>
                    <td className="p-4">{product.category}</td>
                    <td className="p-4">${product.price.toFixed(2)}</td>
                    <td className="p-4">{product.stock}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-500 hover:underline mr-4"
                      >
                        {t.edit}
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
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

export default ProductsPage;
