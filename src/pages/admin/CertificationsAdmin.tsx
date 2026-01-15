import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";

interface Certification {
  id: number;
  created_at: string;
  title: string;
  provider_name: string;
  issued_to: string;
  issued_by: string;
  issued_on: string;
  validation: string;
  expiry_date?: string;
  skills_acquired: string;
  certificate_link: string;
  badge_url?: string;
  file_url?: string;
  overview?: string;
}

const initialCert: Omit<Certification, "id" | "created_at"> = {
  title: "",
  provider_name: "",
  issued_to: "",
  issued_by: "",
  issued_on: "",
  validation: "",
  expiry_date: "",
  skills_acquired: "",
  certificate_link: "",
  badge_url: "",
  file_url: "",
  overview: "",
};

const CertificationsAdmin: React.FC = () => {
  const { role } = useAuth();
  const [data, setData] = useState<Certification[]>([]);
  const [form, setForm] = useState(initialCert);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("certifications").select("*").order("created_at", { ascending: false });
    setLoading(false);
    if (error) setError(error.message);
    else setData(data || []);
  };
  useEffect(() => { fetchData(); }, []);
  const resetForm = () => { setForm(initialCert); setEditId(null); };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null);
    const formData = {...form};
    if(formData.expiry_date==="") delete formData.expiry_date;
    if(formData.badge_url==="") delete formData.badge_url;
    if(formData.file_url==="") delete formData.file_url;
    if(formData.overview==="") delete formData.overview;
    if (editId !== null) {
      const { error } = await supabase.from("certifications").update(formData).eq("id", editId);
      if (error) setError(error.message); else fetchData();
    } else {
      const { error } = await supabase.from("certifications").insert([formData]);
      if (error) setError(error.message); else fetchData();
    }
    setLoading(false); resetForm();
  };
  const handleEdit = (item: Certification) => {
    setEditId(item.id); setForm({
      title: item.title ?? "",
      provider_name: item.provider_name ?? "",
      issued_to: item.issued_to ?? "",
      issued_by: item.issued_by ?? "",
      issued_on: item.issued_on ?? "",
      validation: item.validation ?? "",
      expiry_date: item.expiry_date || "",
      skills_acquired: item.skills_acquired ?? "",
      certificate_link: item.certificate_link ?? "",
      badge_url: item.badge_url || "",
      file_url: item.file_url || "",
      overview: item.overview || "",
    });
  };
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete certification?")) return;
    setLoading(true);
    const { error } = await supabase.from("certifications").delete().eq("id", id);
    setLoading(false);
    if (error) setError(error.message); else fetchData();
  };
  if (role !== "admin") return <div className="p-8">Access denied.</div>;
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl mb-6 font-bold">Certifications Admin</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3 mb-10 bg-gray-100 p-4 rounded-lg">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="input" required />
        <input name="provider_name" value={form.provider_name} onChange={handleChange} placeholder="Provider Name" className="input" required />
        <input name="issued_to" value={form.issued_to} onChange={handleChange} placeholder="Issued To" className="input" required />
        <input name="issued_by" value={form.issued_by} onChange={handleChange} placeholder="Issued By" className="input" required />
        <input name="issued_on" value={form.issued_on} onChange={handleChange} placeholder="Issued On (YYYY-MM-DD)" className="input" required />
        <input name="validation" value={form.validation} onChange={handleChange} placeholder="Validation Date (YYYY-MM-DD)" className="input" required />
        <input name="expiry_date" value={form.expiry_date} onChange={handleChange} placeholder="Expiry Date (YYYY-MM-DD or leave blank)" className="input" />
        <input name="skills_acquired" value={form.skills_acquired} onChange={handleChange} placeholder="Skills Acquired" className="input" required />
        <input name="certificate_link" value={form.certificate_link} onChange={handleChange} placeholder="Certificate Link" className="input" required />
        <input name="badge_url" value={form.badge_url} onChange={handleChange} placeholder="Badge Image URL (optional)" className="input" />
        <input name="file_url" value={form.file_url} onChange={handleChange} placeholder="Certificate File URL (optional)" className="input" />
        <textarea name="overview" value={form.overview} onChange={handleChange} placeholder="Overview (optional)" className="input" />
        <div className="flex items-center gap-2">
          <button type="submit" className="btn-primary">{editId ? "Update" : "Add"} Certification</button>
          {editId && <button type="button" className="btn" onClick={resetForm}>Cancel</button>}
        </div>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border text-left bg-white">
          <thead>
            <tr>
              <th className="p-2">Title</th>
              <th className="p-2">Provider</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-2 font-semibold">{item.title}</td>
                <td className="p-2">{item.provider_name}</td>
                <td className="p-2">
                  <button className="btn-sm btn-secondary mr-2" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="btn-sm btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <style>{`
        .input { width: 100%; padding: .5rem; border-radius: .4rem; border: 1px solid #cbd5e1; }
        .btn-primary { background: #2563eb; color: white; padding: .5rem 1.5rem; border-radius: .4rem; }
        .btn { background: #e5e7eb; color: #374151; padding: .5rem 1.5rem; border-radius: .4rem; }
        .btn-sm { padding: .35rem .7rem; border-radius: .35rem; font-size: .95em; }
        .btn-secondary { background: #f1f5f9; color: #2563eb; }
        .btn-danger { background: #dc2626; color: white; }
      `}</style>
    </div>
  );
};

export default CertificationsAdmin;

