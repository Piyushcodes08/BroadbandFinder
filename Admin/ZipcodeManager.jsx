import axios from "axios";
import { useEffect, useState } from "react";
import { MapPin, Search, Edit2, Trash2, Plus, Save, X } from "lucide-react";
import AdminLayout, { AdminCard, AdminTable, AdminTr, AdminTd, AdminBtn, AdminInput } from "./AdminLayout";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/zipcodes`;

export default function ZipcodeManager() {
  const [zipcodes, setZipcodes] = useState([]);
  const [cityFilter, setCityFilter] = useState("");
  const [formData, setFormData] = useState({ city: "", zipcode: "", number: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchZipcodes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}?city=${cityFilter}&page=${page}&limit=50`);
      setZipcodes(res.data.data || []);
      setTotalPages(res.data.pages || 1);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchZipcodes(); }, [cityFilter, page]);

  const handleSave = async () => {
    if (!formData.city || !formData.zipcode) return;
    setSaving(true);
    try {
      editingId
        ? await axios.put(`${API_BASE}/${editingId}`, formData)
        : await axios.post(API_BASE, formData);
      setFormData({ city: "", zipcode: "", number: "" });
      setEditingId(null);
      setShowForm(false);
      fetchZipcodes();
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  const handleEdit = (z) => { setFormData(z); setEditingId(z._id); setShowForm(true); };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this zipcode?")) return;
    try { await axios.delete(`${API_BASE}/${id}`); fetchZipcodes(); }
    catch { /* silent */ }
  };

  const cancelForm = () => {
    setFormData({ city: "", zipcode: "", number: "" });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <AdminLayout
      title="Manage Zipcodes"
      subtitle="Add, edit or remove service area zipcodes."
      actions={
        <AdminBtn onClick={() => { setShowForm(true); setEditingId(null); setFormData({ city: "", zipcode: "", number: "" }); }}>
          <Plus size={15} /> Add Zipcode
        </AdminBtn>
      }
    >
      {/* Add/Edit form */}
      {showForm && (
        <AdminCard className="mb-5">
          <div className="p-5">
            <h3 className="font-semibold mb-4" style={{ color: "var(--admin-text-primary)" }}>
              {editingId ? "Edit Zipcode" : "Add New Zipcode"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: "city",    placeholder: "City *",    maxLen: undefined },
                { key: "zipcode", placeholder: "Zipcode *", maxLen: 5 },
                { key: "number",  placeholder: "Number",    maxLen: undefined },
              ].map(({ key, placeholder, maxLen }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--admin-text-secondary)" }}>{placeholder}</label>
                  <AdminInput
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <AdminBtn onClick={handleSave} disabled={saving}>
                <Save size={14} /> {saving ? "Saving…" : editingId ? "Update" : "Save"}
              </AdminBtn>
              <AdminBtn variant="outline" onClick={cancelForm}>
                <X size={14} /> Cancel
              </AdminBtn>
            </div>
          </div>
        </AdminCard>
      )}

      {/* Table card */}
      <AdminCard>
        {/* Search */}
        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid var(--admin-border)" }}>
          <Search size={15} style={{ color: "var(--admin-text-secondary)" }} />
          <input
            type="text"
            placeholder="Filter by city…"
            value={cityFilter}
            onChange={(e) => { setPage(1); setCityFilter(e.target.value); }}
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color: "var(--admin-text-primary)" }}
          />
        </div>

        {/* Table */}
        <AdminTable heads={["City", "Zipcode", "Number", "Actions"]}>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <AdminTr key={i}>
                {[1,2,3,4].map(j => (
                  <AdminTd key={j}><div className="h-3 w-24 rounded animate-pulse" style={{ backgroundColor: "var(--admin-border)" }} /></AdminTd>
                ))}
              </AdminTr>
            ))
          ) : zipcodes.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-5 py-10 text-center">
                <MapPin size={28} className="mx-auto mb-2" style={{ color: "var(--admin-border)" }} />
                <span style={{ color: "var(--admin-text-secondary)" }}>No zipcodes found.</span>
              </td>
            </tr>
          ) : (
            zipcodes.map((z) => (
              <AdminTr key={z._id}>
                <AdminTd><span className="font-medium">{z.city}</span></AdminTd>
                <AdminTd>{z.zipcode}</AdminTd>
                <AdminTd>{z.number || "—"}</AdminTd>
                <AdminTd>
                  <div className="flex gap-2">
                    <AdminBtn variant="outline" onClick={() => handleEdit(z)}>
                      <Edit2 size={12} /> Edit
                    </AdminBtn>
                    <AdminBtn variant="danger" onClick={() => handleDelete(z._id)}>
                      <Trash2 size={12} /> Delete
                    </AdminBtn>
                  </div>
                </AdminTd>
              </AdminTr>
            ))
          )}
        </AdminTable>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: "1px solid var(--admin-border)" }}>
          <span className="text-sm" style={{ color: "var(--admin-text-secondary)" }}>Page <b>{page}</b> of <b>{totalPages}</b></span>
          <div className="flex gap-2">
            <AdminBtn variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</AdminBtn>
            <AdminBtn variant="outline" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</AdminBtn>
          </div>
        </div>
      </AdminCard>
    </AdminLayout>
  );
}
