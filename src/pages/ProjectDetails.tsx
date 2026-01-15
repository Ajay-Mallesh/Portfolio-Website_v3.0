import { motion } from "framer-motion";
import { ArrowLeft, Github, ExternalLink, MessageSquare, Edit2, Trash2, X } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SectionWrapper from "@/components/SectionWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/hooks/useProjects";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
  synopsis: string;
  abstract: string;
  techStack: string[];
  outcomes: string;
  github?: string;
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

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role } = useAuth();
  const { projects: allProjects, updateProject: updateProjectDB, deleteProject: deleteProjectDB, uploadProjectFile, fetchProjectFiles } = useProjects();
  const [project, setProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectFiles, setProjectFiles] = useState<any[]>([]);
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

  // Find project from database
  useEffect(() => {
    if (id && allProjects.length > 0) {
      const foundProject = allProjects.find((p) => p.id === id || p.id.toString() === id);
      if (foundProject) {
        setProject(foundProject);
        setFormData({
          title: foundProject.title,
          synopsis: foundProject.synopsis,
          abstract: foundProject.abstract || "",
          techStack: Array.isArray(foundProject.techStack)
            ? foundProject.techStack.join(", ")
            : foundProject.techStack || "",
          github: foundProject.github || "",
          outcomes: foundProject.outcomes || "",
        });

        // Fetch project files
        fetchProjectFiles(foundProject.id).then((files) => {
          setProjectFiles(files);
        });
      }
    }
  }, [id, allProjects]);

  if (!project) {
    return (
      <Layout>
        <SectionWrapper>
          <div className="max-w-6xl mx-auto text-center py-20">
            <h1 className="text-2xl font-bold text-white mb-4">Project not found</h1>
            <Link to="/projects" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              Back to Projects
            </Link>
          </div>
        </SectionWrapper>
      </Layout>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!project) return;

    try {
      const techStackArray = formData.techStack
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech);

      await updateProjectDB(project.id, {
        title: formData.title,
        synopsis: formData.synopsis,
        abstract: formData.abstract,
        techStack: techStackArray,
        outcomes: formData.outcomes,
        github: formData.github,
      });

      // Update local state
      const updatedProject: Project = {
        ...project,
        title: formData.title,
        synopsis: formData.synopsis,
        abstract: formData.abstract,
        techStack: techStackArray,
        outcomes: formData.outcomes,
        github: formData.github,
      };
      setProject(updatedProject);

      // Upload files if provided (non-blocking)
      if (formData.blockDiagram) {
        uploadProjectFile(project.id, formData.blockDiagram, 'diagram')
          .then(() => {
            // Refresh project files
            fetchProjectFiles(project.id).then((files) => {
              setProjectFiles(files);
            });
          })
          .catch((err) => {
            console.error('Non-blocking upload error:', err);
          });
      }

      if (formData.reportFile) {
        uploadProjectFile(project.id, formData.reportFile, 'report')
          .then(() => {
            // Refresh project files
            fetchProjectFiles(project.id).then((files) => {
              setProjectFiles(files);
            });
          })
          .catch((err) => {
            console.error('Non-blocking upload error:', err);
          });
      }

      setIsEditing(false);
      toast.success("Project updated successfully");
    } catch (err) {
      console.error("Failed to save project:", err);
      toast.error("Failed to update project");
    }
  };

  const handleDelete = async () => {
    if (!project) return;

    try {
      await deleteProjectDB(project.id);
      toast.success("Project deleted successfully");
      setTimeout(() => {
        navigate("/projects");
      }, 1500);
    } catch (err) {
      console.error("Failed to delete project:", err);
      toast.error("Failed to delete project");
    }
  };

  return (
    <Layout>
      <SectionWrapper>
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Projects</span>
            </Link>
          </motion.div>

          {/* Project Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {project.title}
              </h1>
              {role === "admin" && !isEditing && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setFormData({
                        title: project.title,
                        synopsis: project.synopsis,
                        abstract: project.abstract,
                        techStack: Array.isArray(project.techStack)
                          ? project.techStack.join(", ")
                          : project.techStack || "",
                        github: project.github || "",
                        outcomes: project.outcomes,
                      });
                    }}
                    className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    title="Edit project"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                    title="Delete project"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xl text-slate-300 mb-6">{project.synopsis}</p>

            {!isEditing && (
              <div className="flex flex-wrap gap-4">
                {project.github && (
                  <Button asChild className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github size={18} /> View Code
                    </a>
                  </Button>
                )}
              </div>
            )}
          </motion.div>

          {isEditing ? (
            // Edit Form
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 border border-emerald-600/30 rounded-xl p-8 space-y-6 mb-12"
            >
              <h2 className="text-2xl font-semibold text-white">Edit Project</h2>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Title</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Synopsis</label>
                <Textarea
                  name="synopsis"
                  value={formData.synopsis}
                  onChange={handleChange}
                  rows={3}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Abstract</label>
                <Textarea
                  name="abstract"
                  value={formData.abstract}
                  onChange={handleChange}
                  rows={4}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Tech Stack (comma-separated)</label>
                <Input
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">GitHub URL</label>
                <Input
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Outcomes & Impact</label>
                <Textarea
                  name="outcomes"
                  value={formData.outcomes}
                  onChange={handleChange}
                  rows={4}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Block Diagram (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, blockDiagram: e.target.files?.[0] })}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
                />
                <p className="text-slate-400 text-xs mt-1">Upload image file for project block diagram</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Report File (Optional)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => setFormData({ ...formData, reportFile: e.target.files?.[0] })}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
                />
                <p className="text-slate-400 text-xs mt-1">Upload PDF, Word, or text document</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors font-medium"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          ) : (
            // View Mode
            <div className="space-y-8">
              {/* Abstract */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-800/50 border border-emerald-600/30 rounded-xl p-8"
              >
                <h2 className="text-2xl font-semibold text-white mb-4">About the Project</h2>
                <p className="text-slate-300 leading-relaxed">{project.abstract}</p>
              </motion.div>

              {/* Outcomes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-800/50 border border-emerald-600/30 rounded-xl p-8"
              >
                <h2 className="text-2xl font-semibold text-white mb-4">Outcome & Impact</h2>
                <p className="text-slate-300 leading-relaxed">{project.outcomes}</p>
              </motion.div>

              {/* Tech Stack */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-800/50 border border-emerald-600/30 rounded-xl p-8"
              >
                <h3 className="text-2xl font-semibold text-white mb-4">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 rounded-lg bg-emerald-600/20 border border-emerald-600/50 text-emerald-400 text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Project Files */}
              {projectFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="bg-slate-800/50 border border-emerald-600/30 rounded-xl p-8"
                >
                  <h3 className="text-2xl font-semibold text-white mb-4">Project Files</h3>
                  <div className="space-y-3">
                    {projectFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-4 bg-slate-700/50 border border-slate-600 rounded-lg hover:border-emerald-600/50 transition"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="p-2 bg-emerald-600/20 rounded-lg">
                            {file.file_type === 'diagram' ? (
                              <span className="text-emerald-400 font-semibold">🖼</span>
                            ) : (
                              <span className="text-emerald-400 font-semibold">📄</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">{file.file_name}</p>
                            <p className="text-slate-400 text-sm capitalize">
                              {file.file_type === 'diagram' ? 'Block Diagram' : 'Report'}
                            </p>
                          </div>
                        </div>
                        <a
                          href={file.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors ml-2"
                        >
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Suggestion */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-800/50 border border-emerald-600/30 rounded-xl p-8"
              >
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="text-emerald-400" size={24} />
                  Suggest an Improvement
                </h2>
                <p className="text-slate-300 mb-4">
                  Have ideas to make this project better? I'd love to hear your suggestions!
                </p>
                <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                  <Link to={`/contact?subject=Suggestion/Inquiry about ${encodeURIComponent(project.title)}`}>Send Suggestion</Link>
                </Button>
              </motion.div>
            </div>
          )}
        </div>
      </SectionWrapper>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-emerald-600/30 rounded-xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-white mb-2">Delete Project?</h3>
            <p className="text-slate-400 mb-6">This action cannot be undone. The project will be permanently deleted.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </Layout>
  );
};

export default ProjectDetails;
