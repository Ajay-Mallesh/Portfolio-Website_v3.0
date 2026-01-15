import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, Plus, Edit2, Trash2, X, ChevronDown, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SectionWrapper from "@/components/SectionWrapper";
import { useAuth } from "@/contexts/AuthContext";
import { useExperiences } from "@/hooks/useExperiences";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface EditFormData {
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

const Experience = () => {
  const { role } = useAuth();
  const { experiences, loading, error, createExperience, updateExperience, deleteExperience } = useExperiences();
  
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingExp, setEditingExp] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<EditFormData>({
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
  });

  const openEditModal = (exp: any) => {
    setEditingExp(exp);
    setFormData({
      company_name: exp.company_name,
      designation: exp.designation,
      total_experience: exp.total_experience,
      from_year: exp.from_year,
      to_year: exp.to_year,
      roles_and_responsibilities: exp.roles_and_responsibilities,
      promotion_details: exp.promotion_details,
      promotion_from_year: exp.promotion_from_year,
      promotion_to_year: exp.promotion_to_year,
      promotion_roles: exp.promotion_roles,
      skills_acquired: exp.skills_acquired,
      tools_utilised: exp.tools_utilised,
      certification_ids: exp.certification_ids,
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingExp(null);
    setFormData({
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
    });
  };

  const handleSaveExperience = async () => {
    if (!formData.company_name || !formData.designation) {
      toast.error("Company name and designation are required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingExp) {
        await updateExperience(editingExp.id, formData);
      } else {
        await createExperience(formData);
      }
      closeEditModal();
    } catch (err: any) {
      toast.error(err.message || "Failed to save experience");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExperience = async (id: number) => {
    setIsSubmitting(true);
    try {
      await deleteExperience(id);
      setShowDeleteConfirm(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete experience");
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
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
              Work <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Experience</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Professional journey and career milestones
            </p>
          </motion.div>

          {/* Add New Experience Button (Admin Only) */}
          {role === "admin" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12 flex justify-end"
            >
              <Button
                onClick={() => {
                  setEditingExp(null);
                  setFormData({
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
                  });
                  setShowEditModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Plus size={18} /> Add Experience
              </Button>
            </motion.div>
          )}

          {/* Experiences Timeline */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-400">Loading experiences...</p>
            </div>
          ) : experiences && experiences.length > 0 ? (
            <div className="max-w-4xl mx-auto mb-12">
              {/* Timeline Container */}
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-[19px] top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500/60 via-teal-500/60 to-emerald-500/60" />

                {/* Experience Cards */}
                <div className="space-y-8">
                  {experiences.map((exp, index) => (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative pl-24"
                    >
                      {/* Timeline Dot */}
                      <div className="absolute left-0 top-6 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full border-4 border-slate-900 flex items-center justify-center shadow-lg shadow-emerald-500/50 cursor-pointer hover:scale-110 transition-transform duration-300"
                        onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                      >
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>

                      {/* Card */}
                      <div 
                        onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                        className="bg-gradient-to-br from-slate-800/70 via-slate-800/50 to-slate-800/70 border border-slate-700/60 rounded-xl p-7 hover:border-emerald-500/80 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:bg-gradient-to-br hover:from-slate-800 hover:via-slate-800/70 hover:to-slate-800 group cursor-pointer"
                      >
                        {/* Header */}
                        <div className="mb-4">
                          <h3 className="text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors duration-300 mb-2">
                            {exp.company_name}
                          </h3>
                          <p className="text-emerald-400 font-semibold text-lg">{exp.designation}</p>
                        </div>

                        {/* Meta Info - Always Visible */}
                        <div className="flex flex-wrap gap-3 mb-5">
                          <span className="px-3 py-1 bg-emerald-500/30 text-emerald-300 rounded-full text-sm font-semibold border border-emerald-500/50 hover:bg-emerald-500/50 transition-colors">
                            Full-time
                          </span>
                          <span className="px-3 py-1 bg-slate-700/60 text-slate-300 rounded-full text-sm font-semibold border border-slate-600/50 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-emerald-400" />
                            {exp.from_year} - {exp.to_year}
                          </span>
                        </div>

                        {/* Expandable Content */}
                        {expandedId === exp.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {/* Description */}
                            {exp.roles_and_responsibilities && (
                              <div className="mb-5 pb-5 border-t border-slate-700/50 pt-5">
                                <p className="text-slate-300 leading-relaxed text-base">
                                  {exp.roles_and_responsibilities}
                                </p>
                              </div>
                            )}

                            {/* Skills Section */}
                            {exp.skills_acquired && (
                              <div className="mb-5">
                                <p className="text-slate-300 font-bold text-sm mb-3">Skills:</p>
                                <div className="flex flex-wrap gap-2">
                                  {exp.skills_acquired.split(",").map((skill) => (
                                    <span
                                      key={skill.trim()}
                                      className="px-3 py-1 bg-emerald-500/30 text-emerald-300 rounded-full text-sm font-semibold border border-emerald-500/50 hover:bg-emerald-500/50 hover:border-emerald-400/80 transition-all duration-300"
                                    >
                                      {skill.trim()}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Promotion Details as Achievements */}
                            {exp.promotion_details && (
                              <div className="mb-5">
                                <p className="text-slate-300 font-bold text-sm mb-3">Key Achievements:</p>
                                <div className="space-y-2">
                                  <div className="flex items-start gap-3">
                                    <ChevronRight className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                                    <p className="text-slate-300 text-sm">{exp.promotion_details}</p>
                                  </div>
                                  {exp.promotion_roles && (
                                    <div className="flex items-start gap-3">
                                      <ChevronRight className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                                      <p className="text-slate-300 text-sm">{exp.promotion_roles}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Tools Section */}
                            {exp.tools_utilised && (
                              <div className="mb-5">
                                <p className="text-slate-300 font-bold text-sm mb-3">Technologies:</p>
                                <div className="flex flex-wrap gap-2">
                                  {exp.tools_utilised.split(",").map((tool) => (
                                    <span
                                      key={tool.trim()}
                                      className="px-3 py-1 bg-teal-500/30 text-teal-300 rounded-full text-sm font-semibold border border-teal-500/50 hover:bg-teal-500/50 hover:border-teal-400/80 transition-all duration-300"
                                    >
                                      {tool.trim()}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Admin Actions */}
                            {role === "admin" && (
                              <div className="flex gap-2 pt-5 border-t border-slate-700/50 mt-5">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditModal(exp);
                                  }}
                                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-500/30 text-yellow-300 hover:bg-yellow-500/50 border border-yellow-500/50 hover:border-yellow-400/80 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20"
                                >
                                  <Edit2 className="w-4 h-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDeleteConfirm(exp.id);
                                  }}
                                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/30 text-red-300 hover:bg-red-500/50 border border-red-500/50 hover:border-red-400/80 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <Briefcase className="w-16 h-16 text-slate-700 mx-auto mb-4 opacity-50" />
              <p className="text-slate-400 text-lg">No experiences yet</p>
            </div>
          )}

          {/* Edit Dialog */}
          <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingExp ? "Edit Experience" : "Add New Experience"}
                </DialogTitle>
                <DialogDescription>
                  Add or update your work experience information
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Company Name</label>
                    <Input
                      value={formData.company_name}
                      onChange={(e) =>
                        setFormData({ ...formData, company_name: e.target.value })
                      }
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Designation</label>
                    <Input
                      value={formData.designation}
                      onChange={(e) =>
                        setFormData({ ...formData, designation: e.target.value })
                      }
                      placeholder="Job title"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Total Experience</label>
                    <Input
                      value={formData.total_experience}
                      onChange={(e) =>
                        setFormData({ ...formData, total_experience: e.target.value })
                      }
                      placeholder="e.g., 2 years"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Duration</label>
                    <div className="flex gap-2">
                      <Input
                        value={formData.from_year}
                        onChange={(e) =>
                          setFormData({ ...formData, from_year: e.target.value })
                        }
                        placeholder="From"
                      />
                      <Input
                        value={formData.to_year}
                        onChange={(e) =>
                          setFormData({ ...formData, to_year: e.target.value })
                        }
                        placeholder="To"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Roles & Responsibilities
                  </label>
                  <Textarea
                    value={formData.roles_and_responsibilities}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        roles_and_responsibilities: e.target.value,
                      })
                    }
                    placeholder="Describe your main responsibilities"
                    className="min-h-20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Promotion Details (Optional)
                  </label>
                  <Textarea
                    value={formData.promotion_details}
                    onChange={(e) =>
                      setFormData({ ...formData, promotion_details: e.target.value })
                    }
                    placeholder="Details about promotion"
                    className="min-h-16"
                  />
                </div>

                {formData.promotion_details && (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Promotion From Year
                      </label>
                      <Input
                        value={formData.promotion_from_year}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            promotion_from_year: e.target.value,
                          })
                        }
                        placeholder="From"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Promotion To Year
                      </label>
                      <Input
                        value={formData.promotion_to_year}
                        onChange={(e) =>
                          setFormData({ ...formData, promotion_to_year: e.target.value })
                        }
                        placeholder="To"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Promotion Roles
                      </label>
                      <Input
                        value={formData.promotion_roles}
                        onChange={(e) =>
                          setFormData({ ...formData, promotion_roles: e.target.value })
                        }
                        placeholder="Roles"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Skills Acquired (comma-separated)
                  </label>
                  <Input
                    value={formData.skills_acquired}
                    onChange={(e) =>
                      setFormData({ ...formData, skills_acquired: e.target.value })
                    }
                    placeholder="Skill 1, Skill 2, Skill 3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tools Utilised (comma-separated)
                  </label>
                  <Input
                    value={formData.tools_utilised}
                    onChange={(e) =>
                      setFormData({ ...formData, tools_utilised: e.target.value })
                    }
                    placeholder="Tool 1, Tool 2, Tool 3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Certification IDs (comma-separated, optional)
                  </label>
                  <Input
                    value={formData.certification_ids}
                    onChange={(e) =>
                      setFormData({ ...formData, certification_ids: e.target.value })
                    }
                    placeholder="1, 2, 3"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSaveExperience}
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600"
                  >
                    {isSubmitting ? "Saving..." : "Save Experience"}
                  </Button>
                  <Button
                    onClick={closeEditModal}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-slate-800 rounded-lg p-6 max-w-sm"
              >
                <p className="text-white mb-4">
                  Are you sure you want to delete this experience?
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleDeleteExperience(showDeleteConfirm)}
                    disabled={isSubmitting}
                    className="flex-1 bg-red-500 hover:bg-red-600"
                  >
                    {isSubmitting ? "Deleting..." : "Delete"}
                  </Button>
                  <Button
                    onClick={() => setShowDeleteConfirm(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </SectionWrapper>
    </Layout>
  );
};

export default Experience;
