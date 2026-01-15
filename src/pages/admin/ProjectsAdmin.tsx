import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";

interface Project {
  id: number;
  created_at: string;
  title: string;
  synopsis: string;
  abstract: string;
  technologies: string;
  outcome: string;
  github_link: string;
}

const initialProject: Omit<Project, "id" | "created_at"> = {
  title: "",
  synopsis: "",
  abstract: "",
  technologies: "",
  outcome: "",
  github_link: "",
};

const ProjectsAdmin: React.FC = () => {
  const { role } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState(initialProject);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    setLoading(false);
    if (error) setError(error.message);
    else setProjects(data || []);
  };

  useEffect(() => { fetchProjects(); }, []);

  const resetForm = () => {
    setForm(initialProject);
    setEditId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (editId !== null) {
      // Update
      const { error } = await supabase.from("projects").update(form).eq("id", editId);
      if (error) setError(error.message);
      else fetchProjects();
    } else {
      // Create
      const { error } = await supabase.from("projects").insert([form]);
      if (error) setError(error.message);
      else fetchProjects();
    }
    setLoading(false);
    resetForm();
  };

  const handleEdit = (project: Project) => {
    setEditId(project.id);
    setForm({
      title: project.title,
      synopsis: project.synopsis,
      abstract: project.abstract,
      technologies: project.technologies,
      outcome: project.outcome,
      github_link: project.github_link,
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete project?")) return;
    setLoading(true);
    const { error } = await supabase.from("projects").delete().eq("id", id);
    setLoading(false);
    if (error) setError(error.message);
    else fetchProjects();
  };

  if (role !== "admin") return <div className="p-8">Access denied.</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl mb-6 font-bold">Projects Admin</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3 mb-10 bg-gray-100 p-4 rounded-lg">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="input" required />
        <input name="synopsis" value={form.synopsis} onChange={handleChange} placeholder="Synopsis" className="input" required />
        <textarea name="abstract" value={form.abstract} onChange={handleChange} placeholder="Abstract" className="input" required />
        <input name="technologies" value={form.technologies} onChange={handleChange} placeholder="Technologies (comma-separated)" className="input" required />
        <input name="outcome" value={form.outcome} onChange={handleChange} placeholder="Outcome" className="input" required />
        <input name="github_link" value={form.github_link} onChange={handleChange} placeholder="GitHub Link" className="input" />
        <div className="flex items-center gap-2">
          <button type="submit" className="btn-primary">{editId ? "Update" : "Add"} Project</button>
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
              <th className="p-2">Tech</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t">
                <td className="p-2 font-semibold">{project.title}</td>
                <td className="p-2">{project.technologies}</td>
                <td className="p-2">
                  <button className="btn-sm btn-secondary mr-2" onClick={() => handleEdit(project)}>Edit</button>
                  <button className="btn-sm btn-danger" onClick={() => handleDelete(project.id)}>Delete</button>
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

export default ProjectsAdmin;

