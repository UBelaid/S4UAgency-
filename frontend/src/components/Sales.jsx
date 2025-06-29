import { useState, useEffect } from "react";
import axios from "axios";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    client_id: "",
    product_id: "",
    quantity: "",
    total_price: "",
    sale_date: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSales();
    fetchClients();
    fetchProducts();
  }, []);

  const fetchSales = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/sales", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSales(res.data);
    } catch (err) {
      setError(
        "Failed to fetch sales: " + (err.response?.data?.error || err.message)
      );
      console.error("Fetch sales error:", err);
    }
  };

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/clients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(res.data);
    } catch (err) {
      setError(
        "Failed to fetch clients: " + (err.response?.data?.error || err.message)
      );
      console.error("Fetch clients error:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      setError(
        "Failed to fetch products: " +
          (err.response?.data?.error || err.message)
      );
      console.error("Fetch products error:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/sales/${editingId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post("http://localhost:5000/api/sales", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchSales();
      setFormData({
        client_id: "",
        product_id: "",
        quantity: "",
        total_price: "",
        sale_date: "",
      });
      setEditingId(null);
    } catch (err) {
      setError(
        "Failed to save sale: " + (err.response?.data?.error || err.message)
      );
      console.error("Save sale error:", err);
    }
  };

  const handleEdit = (sale) => {
    setFormData({
      client_id: sale.client_id,
      product_id: sale.product_id,
      quantity: sale.quantity,
      total_price: sale.total_price,
      sale_date: sale.sale_date,
    });
    setEditingId(sale.id);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/sales/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSales();
    } catch (err) {
      setError(
        "Failed to delete sale: " + (err.response?.data?.error || err.message)
      );
      console.error("Delete sale error:", err);
    }
  };

  return (
    <div className="mt-4">
      <h2>Sales</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2">
          <div className="col-md-2">
            <select
              name="client_id"
              className="form-control"
              value={formData.client_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <select
              name="product_id"
              className="form-control"
              value={formData.product_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <input
              type="number"
              name="quantity"
              className="form-control"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              step="0.01"
              name="total_price"
              className="form-control"
              placeholder="Total Price"
              value={formData.total_price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="date"
              name="sale_date"
              className="form-control"
              value={formData.sale_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">
              {editingId ? "Update" : "Add"} Sale
            </button>
          </div>
        </div>
      </form>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Client</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Sale Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.client_name}</td>
              <td>{sale.product_name}</td>
              <td>{sale.quantity}</td>
              <td>${sale.total_price}</td>
              <td>{sale.sale_date}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(sale)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(sale.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Sales;
