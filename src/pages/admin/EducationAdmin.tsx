import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";

interface Education {
  id: number;
  created_at: string;
  qualification: string;
  college: string;
  university: string;
  year_from: number;
  year_to: number;
  percentage: string;
  location: string;
}
const initialEdu: Omit<Education, "id" | "created_at"> = {
  qualification: "",
  college: "",
  university: "",
  year_from: new Date().getFullYear(),
  year_to: new Date().getFullYear(),
  percentage: "",
  location: "",
};
const EducationAdmin: React.FC = () => {
  const { role } = useAuth();
  const [data, setData] = useState<Education[]>([]);
  const [form, setForm] = useState(initialEdu);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("education").select("*").order("created_at", { ascending: false });
    setLoading(false);
    if (error) setError(error.message);
    else setData(data || []);
  };
  useEffect(() => { fetchData(); }, []);
  const resetForm = () => { setForm(initialEdu); setEditId(null); };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setLoading(true);
    if (editId !== null) {
      const { error } = await supabase.from("education").update(form).eq("id", editId);
      if (error) setError(error.message); else fetchData();
    } else {
      const { error } = await supabase.from("education").insert([form]);
      if (error) setError(error.message); else fetchData();
    }
    setLoading(false); resetForm();
  };
  const handleEdit = (item: Education) => {
    setEditId(item.id);
    setForm({
      qualification: item.qualification,
      college: item.college,
      university: item.university,
      year_from: item.year_from,
      year_to: item.year_to,
      percentage: item.percentage,
      location: item.location
    });
  };
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete education record?")) return;
    setLoading(true);
    const { error } = await supabase.from("education").delete().eq("id", id);
    setLoading(false);
    if (error) setError(error.message); else fetchData();
  };
  if (role !== "admin") return <div className="p-8">Access denied.</div>;
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl mb-6 font-bold">Education Admin</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3 mb-10 bg-gray-100 p-4 rounded-lg">
        <input name="qualification" value={form.qualification} onChange={handleChange} placeholder="Qualification" className="input" required />
        <input name="college" value={form.college} onChange={handleChange} placeholder="College" className="input" required />
        <input name="university" value={form.university} onChange={handleChange} placeholder="University" className="input" required />
        <input name="year_from" value={form.year_from} onChange={handleChange} placeholder="Year From" className="input" type="number" required />
        <input name="year_to" value={form.year_to} onChange={handleChange} placeholder="Year To" className="input" type="number" required />
        <input name="percentage" value={form.percentage} onChange={handleChange} placeholder="Percentage/CGPA" className="input" required />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="input" required />
        <div className="flex items-center gap-2">
          <button type="submit" className="btn-primary">{editId ? "Update" : "Add"} Education</button>
          {editId && <button type="button" className="btn" onClick={resetForm}>Cancel</button>}
        </div>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border text-left bg-white">
          <thead>
            <tr>
              <th className="p-2">College</th>
              <th className="p-2">Qualification</th>
              <th className="p-2">Year</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-2 font-semibold">{item.college}</td>
                <td className="p-2">{item.qualification}</td>
                <td className="p-2">{item.year_from} - {item.year_to}</td>
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

export default EducationAdmin;

