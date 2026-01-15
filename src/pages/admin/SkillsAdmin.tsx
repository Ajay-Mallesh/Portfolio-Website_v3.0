import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";

interface Skill {
  id: number;
  created_at: string;
  skill_name: string;
  proficiency: number;
  category: string;
}
const initialSkill: Omit<Skill, "id" | "created_at"> = {
  skill_name: "",
  proficiency: 0,
  category: "",
};
const SkillsAdmin: React.FC = () => {
  const { role } = useAuth();
  const [data, setData] = useState<Skill[]>([]);
  const [form, setForm] = useState(initialSkill);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("skills").select("*").order("created_at", { ascending: false });
    setLoading(false);
    if (error) setError(error.message);
    else setData(data || []);
  };
  useEffect(() => { fetchData(); }, []);
  const resetForm = () => { setForm(initialSkill); setEditId(null); };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setLoading(true);
    if (editId !== null) {
      const { error } = await supabase.from("skills").update(form).eq("id", editId);
      if (error) setError(error.message); else fetchData();
    } else {
      const { error } = await supabase.from("skills").insert([form]);
      if (error) setError(error.message); else fetchData();
    }
    setLoading(false); resetForm();
  };
  const handleEdit = (item: Skill) => {
    setEditId(item.id);
    setForm({
      skill_name: item.skill_name,
      proficiency: item.proficiency,
      category: item.category
    });
  };
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete skill?")) return;
    setLoading(true);
    const { error } = await supabase.from("skills").delete().eq("id", id);
    setLoading(false);
    if (error) setError(error.message); else fetchData();
  };
  if (role !== "admin") return <div className="p-8">Access denied.</div>;
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl mb-6 font-bold">Skills Admin</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3 mb-10 bg-gray-100 p-4 rounded-lg">
        <input name="skill_name" value={form.skill_name} onChange={handleChange} placeholder="Skill Name" className="input" required />
        <input name="proficiency" type="number" value={form.proficiency} onChange={handleChange} placeholder="Proficiency (0-10)" min="0" max="10" className="input" required />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="input" required />
        <div className="flex items-center gap-2">
          <button type="submit" className="btn-primary">{editId ? "Update" : "Add"} Skill</button>
          {editId && <button type="button" className="btn" onClick={resetForm}>Cancel</button>}
        </div>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border text-left bg-white">
          <thead>
            <tr>
              <th className="p-2">Skill</th>
              <th className="p-2">Proficiency</th>
              <th className="p-2">Category</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-2 font-semibold">{item.skill_name}</td>
                <td className="p-2">{item.proficiency}</td>
                <td className="p-2">{item.category}</td>
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

export default SkillsAdmin;

