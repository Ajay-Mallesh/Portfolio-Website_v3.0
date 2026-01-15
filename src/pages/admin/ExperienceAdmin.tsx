import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";

interface Experience {
  id: number;
  created_at: string;
  company_name: string;
  designation: string;
  total_experience: string;
  from_year: string;
  to_year: string;
  roles_and_responsibilities: string;
  promotion_details: string;
  promotion_from_year: string;
  promotion_to_year: string;
  promotion_roles: string;
  skills_acquired: string;
  tools_utilised: string;
  certification_ids: string;
}

const initialExp: Omit<Experience, "id" | "created_at"> = {
  company_name: "",
  designation: "",
  total_experience: "",
  from_year: "",
  to_year: "",
  roles_and_responsibilities: "",
  promotion_details: "",
  promotion_from_year: "",
  promotion_to_year: "",
  promotion_roles: "",
  skills_acquired: "",
  tools_utilised: "",
  certification_ids: "",
};

const ExperienceAdmin: React.FC = () => {
  const { role } = useAuth();
  const [data, setData] = useState<Experience[]>([]);
  const [form, setForm] = useState(initialExp);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("experience").select("*").order("created_at", { ascending: false });
    setLoading(false);
    if (error) setError(error.message);
    else setData(data || []);
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => { setForm(initialExp); setEditId(null); };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setLoading(true);
    if (editId !== null) {
      const { error } = await supabase.from("experience").update(form).eq("id", editId);
      if (error) setError(error.message); else fetchData();
    } else {
      const { error } = await supabase.from("experience").insert([form]);
      if (error) setError(error.message); else fetchData();
    }
    setLoading(false); resetForm();
  };
  const handleEdit = (item: Experience) => {
    setEditId(item.id); setForm({
      company_name: item.company_name,
      designation: item.designation,
      total_experience: item.total_experience,
      from_year: item.from_year,
      to_year: item.to_year,
      roles_and_responsibilities: item.roles_and_responsibilities,
      promotion_details: item.promotion_details,
      promotion_from_year: item.promotion_from_year,
      promotion_to_year: item.promotion_to_year,
      promotion_roles: item.promotion_roles,
      skills_acquired: item.skills_acquired,
      tools_utilised: item.tools_utilised,
      certification_ids: item.certification_ids
    });
  };
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete experience record?")) return;
    setLoading(true);
    const { error } = await supabase.from("experience").delete().eq("id", id);
    setLoading(false);
    if (error) setError(error.message); else fetchData();
  };
  if (role !== "admin") return <div className="p-8">Access denied.</div>;
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl mb-6 font-bold">Experience Admin</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3 mb-10 bg-gray-100 p-4 rounded-lg">
        <input name="company_name" value={form.company_name} onChange={handleChange} placeholder="Company Name" className="input" required />
        <input name="designation" value={form.designation} onChange={handleChange} placeholder="Designation" className="input" required />
        <input name="total_experience" value={form.total_experience} onChange={handleChange} placeholder="Total Experience" className="input" required />
        <input name="from_year" value={form.from_year} onChange={handleChange} placeholder="From Year" className="input" required />
        <input name="to_year" value={form.to_year} onChange={handleChange} placeholder="To Year" className="input" required />
        <textarea name="roles_and_responsibilities" value={form.roles_and_responsibilities} onChange={handleChange} placeholder="Roles & Responsibilities" className="input" required />
        <input name="promotion_details" value={form.promotion_details} onChange={handleChange} placeholder="Promotion Details" className="input" />
        <input name="promotion_from_year" value={form.promotion_from_year} onChange={handleChange} placeholder="Promotion From (Year)" className="input" />
        <input name="promotion_to_year" value={form.promotion_to_year} onChange={handleChange} placeholder="Promotion To (Year)" className="input" />
        <input name="promotion_roles" value={form.promotion_roles} onChange={handleChange} placeholder="Promotion Roles" className="input" />
        <input name="skills_acquired" value={form.skills_acquired} onChange={handleChange} placeholder="Skills Acquired" className="input" />
        <input name="tools_utilised" value={form.tools_utilised} onChange={handleChange} placeholder="Tools Utilised" className="input" />
        <input name="certification_ids" value={form.certification_ids} onChange={handleChange} placeholder="Certification Ids" className="input" />
        <div className="flex items-center gap-2">
          <button type="submit" className="btn-primary">{editId ? "Update" : "Add"} Experience</button>
          {editId && <button type="button" className="btn" onClick={resetForm}>Cancel</button>}
        </div>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border text-left bg-white">
          <thead>
            <tr>
              <th className="p-2">Company</th>
              <th className="p-2">Designation</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-2 font-semibold">{item.company_name}</td>
                <td className="p-2">{item.designation}</td>
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

export default ExperienceAdmin;

