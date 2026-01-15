import { motion } from "framer-motion";
import { Search, Filter, Plus, Edit2, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SectionWrapper from "@/components/SectionWrapper";
import ProjectCard from "@/components/ProjectCard";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/hooks/useProjects";
import { supabase } from "@/lib/supabaseClient";

interface Project {
  id: string;
  title: string;
  synopsis: string;
  techStack: string[];
  github?: string;
  abstract: string;
  outcomes: string;
}

interface EditFormData {
  title: string;
  synopsis: string;
  abstract: string;
  techStack: string;
  github: string;
  outcomes: string;
  blockDiagram?: File;
  reportFile?: File;
}

const Projects = () => {
  const { role } = useAuth();
  const { projects: dbProjects, loading, error, createProject: createProjectDB, updateProject: updateProjectDB, deleteProject: deleteProjectDB, uploadProjectFile } = useProjects();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<EditFormData>({
    title: "",
    synopsis: "",
    abstract: "",
    techStack: "",
    github: "",
    outcomes: "",
    blockDiagram: undefined,
    reportFile: undefined,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Get unique techs from projects
  const allTechs = [...new Set(projects.flatMap((p) => p.techStack))];

  // Sync database projects with local state
  useEffect(() => {
    if (!loading && dbProjects) {
      setProjects(dbProjects);
      console.log("✅ Projects loaded from database:", dbProjects.length);
    }
  }, [dbProjects, loading]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.synopsis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTech = !selectedTech || project.techStack.includes(selectedTech);
    return matchesSearch && matchesTech;
  });

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      synopsis: project.synopsis,
      abstract: project.abstract || "",
      techStack: project.techStack.join(", "),
      github: project.github || "",
      outcomes: project.outcomes || "",
    });
    setShowEditModal(true);
  };

  const handleSaveProject = async () => {
    if (!formData.title || !formData.synopsis) {
      alert("Please fill in required fields");
      return;
    }

    const techStackArray = formData.techStack
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);

    try {
      let createdProject: any;

      if (editingProject) {
        // Update existing project
        await updateProjectDB(editingProject.id, {
          title: formData.title,
          synopsis: formData.synopsis,
          abstract: formData.abstract,
          techStack: techStackArray,
          github: formData.github,
          outcomes: formData.outcomes,
        });
        createdProject = { id: editingProject.id };
      } else {
        // Add new project
        createdProject = await createProjectDB({
          title: formData.title,
          synopsis: formData.synopsis,
          abstract: formData.abstract,
          techStack: techStackArray,
          github: formData.github,
          outcomes: formData.outcomes,
        });
      }

      // Upload files if provided (non-blocking - don't fail if upload fails)
      if (createdProject?.id) {
        if (formData.blockDiagram) {
          uploadProjectFile(createdProject.id, formData.blockDiagram, 'diagram')
            .then(() => {
              console.log('Block diagram uploaded successfully');
            })
            .catch((err) => {
              console.error('Non-blocking upload error:', err);
              // Don't fail the project creation if file upload fails
            });
        }

        if (formData.reportFile) {
          uploadProjectFile(createdProject.id, formData.reportFile, 'report')
            .then(() => {
              console.log('Report uploaded successfully');
            })
            .catch((err) => {
              console.error('Non-blocking upload error:', err);
              // Don't fail the project creation if file upload fails
            });
        }
      }

      setShowEditModal(false);
      setEditingProject(null);
      setFormData({
        title: "",
        synopsis: "",
        abstract: "",
        techStack: "",
        github: "",
        outcomes: "",
        blockDiagram: undefined,
        reportFile: undefined,
      });
    } catch (err) {
      console.error("Failed to save project:", err);
      alert("Failed to save project");
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProjectDB(id);
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error("Failed to delete project:", err);
      alert("Failed to delete project");
    }
  };

  const openNewProjectForm = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      synopsis: "",
      abstract: "",
      techStack: "",
      github: "",
      outcomes: "",
      blockDiagram: undefined,
      reportFile: undefined,
    });
    setShowEditModal(true);
  };

  return (
    <Layout>
      <SectionWrapper className="min-h-screen pt-20 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              My <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Projects</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              A collection of projects I've built, showcasing my skills and passion for development.
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl mx-auto mb-12"
          >
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 py-3 px-4 bg-slate-700/40 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Tech Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 text-slate-400">
                  <Filter size={16} />
                  <span className="text-sm">Filter:</span>
                </div>
                <button
                  onClick={() => setSelectedTech(null)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    !selectedTech
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  All
                </button>
                {allTechs.slice(0, 8).map((tech) => (
                  <button
                    key={tech}
                    onClick={() => setSelectedTech(tech === selectedTech ? null : tech)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      selectedTech === tech
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>

              {/* Add New Project Button (Admin Only) */}
              {role === "admin" && (
                <button
                  onClick={openNewProjectForm}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
                >
                  <Plus size={18} /> Add Project
                </button>
              )}
            </div>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <ProjectCard {...project} index={index} />
                {/* Admin Action Buttons */}
                {role === "admin" && (
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(project)}
                      className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(project.id)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-slate-400 text-lg">No projects found matching your criteria.</p>
            </motion.div>
          )}
        </div>
      </SectionWrapper>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  placeholder="Enter project title"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Synopsis *
                </label>
                <textarea
                  value={formData.synopsis}
                  onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  placeholder="One line project synopsis"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Abstract
                </label>
                <textarea
                  value={formData.abstract}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  placeholder="Detailed project abstract"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Tech Stack (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.techStack}
                  onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    GitHub Link
                  </label>
                  <input
                    type="url"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Outcomes/Results
                </label>
                <textarea
                  value={formData.outcomes}
                  onChange={(e) => setFormData({ ...formData, outcomes: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  placeholder="Project outcomes and results"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Block Diagram (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, blockDiagram: e.target.files?.[0] })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
                />
                <p className="text-slate-400 text-xs mt-1">Upload image file for project block diagram</p>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Report File (Optional)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => setFormData({ ...formData, reportFile: e.target.files?.[0] })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
                />
                <p className="text-slate-400 text-xs mt-1">Upload PDF, Word, or text document</p>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={handleSaveProject}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
              >
                {editingProject ? "Update Project" : "Create Project"}
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-sm"
          >
            <h3 className="text-xl font-bold text-white mb-4">Delete Project?</h3>
            <p className="text-slate-400 mb-6">
              Are you sure you want to delete this project? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDeleteProject(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </Layout>
  );
};

export default Projects;
