import { useState, useEffect } from "react";
import axios from "axios";

const DiscountCode = () => {
  const [discounts, setDiscounts] = useState([]);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "",
    value: "",
    expirationDate: "",
    minPurchase: "",
    maxDiscount: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/discounts");
      const data = await response.json();

      // console.log("Discount API Response:", data); // Debugging

      if (Array.isArray(data)) {
        setDiscounts(data);
      } else {
        console.error("API response is not an array:", data);
        setDiscounts([]);
      }
    } catch (error) {
      console.error("Error fetching discounts:", error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form to create discount code
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:4000/api/discounts/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post("http://localhost:4000/api/discounts", formData);
      }
      setFormData({
        code: "",
        discountType: "",
        value: "",
        expirationDate: "",
        minPurchase: "",
        maxDiscount: "",
      });
      fetchDiscounts();
    } catch (error) {
      console.error("Error creating discount:", error);
    }
  };

  const handleEdit = (discount) => {
    setFormData(discount);
    setEditingId(discount._id);
  };

  // Delete a discount
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/discounts/${id}`);
      fetchDiscounts();
    } catch (error) {
      console.error("Error deleting discount:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-800 shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold mb-4">Manage Discount Codes</h2>

      {/* Discount Creation Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="code"
            placeholder="Discount Code"
            value={formData.code}
            onChange={handleChange}
            className="border p-2 rounded w-full bg-gray-700"
            required
          />
          <select
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
            className="border p-2 rounded w-full bg-gray-700"
          >
            <option value="fixed">Fixed Amount</option>
            <option value="percentage">Percentage</option>
          </select>
          <input
            type="number"
            name="value"
            placeholder="Discount Value"
            value={formData.value}
            onChange={handleChange}
            className="border p-2 rounded w-full bg-gray-700"
            required
          />
          <input
            type="date"
            name="expirationDate"
            value={formData.expirationDate}
            onChange={handleChange}
            className="border p-2 rounded w-full bg-gray-700"
          />
          <input
            type="number"
            name="minPurchase"
            placeholder="Min Purchase ₹"
            value={formData.minPurchase}
            onChange={handleChange}
            className="border p-2 rounded w-full bg-gray-700"
          />
          <input
            type="number"
            name="maxDiscount"
            placeholder="Max Discount ₹"
            value={formData.maxDiscount}
            onChange={handleChange}
            className="border p-2 rounded w-full bg-gray-700"
          />
        </div>
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          {editingId ? "Update Discount" : "Create Discount"}
        </button>
      </form>

      {/* Display Discounts */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Existing Discount Codes</h3>
        {discounts.length === 0 ? (
          <p>No discounts available.</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-900">
                <th className="border p-2">Code</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Value</th>
                <th className="border p-2">Expires</th>
                <th className="border p-2">Min Purchase</th>
                <th className="border p-2">Max Discount</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount) => (
                <tr key={discount._id} className="text-center">
                  <td className="border p-2">{discount.code}</td>
                  <td className="border p-2">{discount.discountType}</td>
                  <td className="border p-2">{discount.value}</td>
                  <td className="border p-2">{discount.expirationDate?.split("T")[0]}</td>
                  <td className="border p-2">₹{discount.minPurchase}</td>
                  <td className="border p-2">₹{discount.maxDiscount}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleEdit(discount)}
                      className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(discount._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DiscountCode;