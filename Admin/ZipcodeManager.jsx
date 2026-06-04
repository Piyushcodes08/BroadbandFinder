import axios from "axios";
import { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import Sidebar from "./Sidebar";

const API_BASE = "https://zenith.cloudastro.space/api/zipcodes";

const ZipcodeManager = () => {
  const [zipcodes, setZipcodes] = useState([]);
  const [cityFilter, setCityFilter] = useState("");
  const [formData, setFormData] = useState({ city: "", zipcode: "", number: "", types: [] });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchZipcodes = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE}?city=${cityFilter}&page=${page}&limit=50`;
      const res = await axios.get(url);
      setZipcodes(res.data.data);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error("Error fetching zipcodes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZipcodes();
  }, [cityFilter, page]);

  const handleSave = async () => {
    if (!formData.city || !formData.zipcode) return;
    try {
      if (editingId) {
        await axios.put(`${API_BASE}/${editingId}`, formData);
      } else {
        await axios.post(API_BASE, formData);
      }
      setFormData({ city: "", zipcode: "", number: "", types: [] });
      setEditingId(null);
      fetchZipcodes();
    } catch (err) {
      console.error("Error saving zipcode", err);
    }
  };

  const handleEdit = (z) => {
    setFormData(z);
    setEditingId(z._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this zipcode?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchZipcodes();
    } catch (err) {
      console.error("Error deleting zipcode", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 space-y-6">
        <div className="bg-white shadow-md rounded-xl p-4 md:p-6 border border-gray-200">
          <h2 className="text-2xl font-bold pb-2">Manage Zipcodes</h2>

          {/* Filter */}
          <div className="bg-white p-3 border-b rounded-lg flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              placeholder="Filter by city..."
              value={cityFilter}
              onChange={(e) => {
                setPage(1);
                setCityFilter(e.target.value);
              }}
              className="border p-2 rounded w-full md:w-auto flex-1"
            />
          </div>

          {/* Form
          <div className="bg-white p-4 rounded-lg space-y-4">
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="border p-2 rounded flex-1 min-w-[150px]"
              />
              <input
                type="text"
                placeholder="Zipcode"
                value={formData.zipcode}
                onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
                className="border p-2 rounded flex-1 min-w-[150px]"
              />
              <input
                type="number"
                placeholder="Number"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                className="border p-2 rounded flex-1 min-w-[150px]"
              />
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 self-start"
              >
                {editingId ? "Update" : "Add"}
              </button>
            </div>
          </div> */}

          {/* Table */}
          <div className="bg-white shadow rounded-lg overflow-x-auto max-h-[60vh]">
            <table className="w-full text-sm border-collapse min-w-[600px]">
              <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="border p-2 text-left">City</th>
                  <th className="border p-2 text-left">Zipcode</th>
                  <th className="border p-2 text-left">Number</th>
                  <th className="border p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="16" className="p-4 text-center flex items-center justify-center">
                      <Oval
                        height={50}
                        width={50}
                        color="red"
                        secondaryColor="red"
                        strokeWidth={4}
                        strokeWidthSecondary={4}
                        ariaLabel="loading"
                      />
                    </td>
                  </tr>
                ) : zipcodes.length > 0 ? (
                  zipcodes.map((z) => (
                    <tr key={z._id} className="hover:bg-gray-50">
                      <td className="border p-2">{z.city}</td>
                      <td className="border p-2">{z.zipcode}</td>
                      <td className="border p-2">{z.number}</td>
                      <td className="border p-2 text-center space-x-2">
                        <button
                          onClick={() => handleEdit(z)}
                          className="bg-gray-200 text-blue-600 px-4 py-1 rounded hover:bg-blue-600 hover:text-white transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(z._id)}
                          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-4 text-gray-500">
                      No zipcodes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-center items-center mt-4 gap-3 text-sm">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-200 transition w-full sm:w-auto"
            >
              Prev
            </button>
            <span className="px-3 py-2">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-200 transition w-full sm:w-auto"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZipcodeManager;