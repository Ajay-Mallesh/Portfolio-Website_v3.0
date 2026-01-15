import { motion } from "framer-motion";
import { Award, Calendar, Building, Plus, Edit2, Trash2, X, Download, FileText, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import SectionWrapper from "@/components/SectionWrapper";
import { useAuth } from "@/contexts/AuthContext";
import { useCertifications } from "@/hooks/useCertifications";
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

interface CertificationWithDetails {
  id: number;
  title: string;
  provider_name: string;
  issued_to: string;
  issued_by: string;
  issued_on: string;
  validation: string;
  expiry_date?: string;
  skills_acquired: string;
  certificate_link: string;
  badge_url?: string | null;
  file_url?: string | null;
  overview?: string | null;
  created_at?: string;
}

interface EditFormData {
  title: string;
  provider_name: string;
  issued_to: string;
  issued_by: string;
  issued_on: string;
  validation: string;
  expiry_date: string;
  skills_acquired: string;
  certificate_link: string;
  badge_url: string;
  overview: string;
}

const Certifications = () => {
  const { role } = useAuth();
  const { certifications, loading, error, createCertification, updateCertification, deleteCertification } = useCertifications();
  
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificationWithDetails | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const badgeFileInputRef = useRef<HTMLInputElement>(null);
  const certificateFileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<EditFormData>({
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
    overview: "",
  });

  useEffect(() => {
    if (certifications && certifications.length > 0) {
      // Certifications loaded
    }
  }, [certifications]);

  const openEditModal = (cert: CertificationWithDetails) => {
    setEditingCert(cert);
    setFormData({
      title: cert.title,
      provider_name: cert.provider_name,
      issued_to: cert.issued_to,
      issued_by: cert.issued_by,
      issued_on: cert.issued_on,
      validation: cert.validation,
      expiry_date: cert.expiry_date || "",
      skills_acquired: cert.skills_acquired,
      certificate_link: cert.certificate_link,
      badge_url: cert.badge_url || "",
      overview: cert.overview || "",
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingCert(null);
    setFormData({
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
      overview: "",
    });
  };

  const handleSaveCertification = async () => {
    if (!formData.title || !formData.provider_name) {
      toast.error("Title and Provider are required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCert) {
        await updateCertification(editingCert.id, {
          ...formData,
        });
      } else {
        await createCertification({
          ...formData,
        });
      }
      closeEditModal();
    } catch (err: any) {
      toast.error(err.message || "Failed to save certification");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCertification = async (id: number) => {
    setIsSubmitting(true);
    try {
      await deleteCertification(id);
      setShowDeleteConfirm(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete certification");
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
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const cert = certifications as unknown as CertificationWithDetails[];

  return (
    <Layout>
      <SectionWrapper>
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
          {/* Header - Centered */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-full">
                <Award className="w-8 h-8 text-amber-400" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
              Certifications
            </h1>
            <p className="text-slate-400 text-lg">
              Industry-recognized certifications validating expertise
            </p>
          </motion.div>

          {/* Admin Add Button */}
          {role === "admin" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end mb-8"
            >
              <Button
                onClick={() => setShowEditModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Certification
              </Button>
            </motion.div>
          )}

          {/* Certifications Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-400">Loading certifications...</p>
              </div>
            ) : cert && cert.length > 0 ? (
              cert.map((certification) => (
                <motion.div
                  key={certification.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className={`transition-all duration-300 ${
                    expandedId === certification.id ? "col-span-1 md:col-span-2 lg:col-span-3" : ""
                  }`}
                >
                  {/* Collapsed View */}
                  {expandedId !== certification.id ? (
                    <motion.div
                      layout
                      onClick={() => setExpandedId(certification.id)}
                      className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-700/50 rounded-xl p-6 hover:border-amber-500/50 shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        {/* Badge Thumbnail */}
                        <div className="flex-shrink-0">
                          {certification.badge_url ? (
                            <img
                              src={certification.badge_url}
                              alt={certification.title}
                              className="w-16 h-16 rounded-lg object-cover border border-amber-500/30"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center border border-amber-500/30">
                              <Award className="w-8 h-8 text-amber-400" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white hover:text-amber-400 transition-colors">
                            {certification.title}
                          </h3>
                          <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                            <Building className="w-4 h-4" />
                            {certification.provider_name}
                          </p>
                          <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                            <Calendar className="w-4 h-4" />
                            {certification.issued_on}
                          </p>
                        </div>

                        {/* Expand Icon */}
                        <motion.div
                          initial={{ rotate: 0 }}
                          animate={{ rotate: expandedId === certification.id ? 180 : 0 }}
                          className="flex-shrink-0 text-amber-400"
                        >
                          <ChevronDown className="w-5 h-5" />
                        </motion.div>
                      </div>
                    </motion.div>
                  ) : (
                    /* Expanded View */
                    <motion.div
                      layout
                      className="bg-gradient-to-br from-slate-800 to-slate-700 border border-amber-500/50 rounded-xl shadow-xl"
                    >
                      <div className="p-8">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex-1">
                            <h2 className="text-2xl font-bold text-white mb-2">
                              {certification.title}
                            </h2>
                            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                              <span className="flex items-center gap-1">
                                <Building className="w-4 h-4" />
                                {certification.provider_name}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {certification.issued_on}
                              </span>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setExpandedId(null)}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5 text-slate-400" />
                          </motion.button>
                        </div>

                        {/* Badge and Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                          {/* Badge */}
                          <div>
                            {certification.badge_url ? (
                              <img
                                src={certification.badge_url}
                                alt={certification.title}
                                className="w-40 h-40 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-40 h-40 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center border-2 border-amber-500/30">
                                <Award className="w-20 h-20 text-amber-400" />
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="space-y-4">
                            <div>
                              <p className="text-slate-400 text-sm">Issued To</p>
                              <p className="text-white font-medium">{certification.issued_to}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 text-sm">Issued By</p>
                              <p className="text-white font-medium">{certification.issued_by}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 text-sm">Expires</p>
                              <p className="text-white font-medium">
                                {certification.expiry_date || "No expiration"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Skills */}
                        {certification.skills_acquired && (
                          <div className="mb-6">
                            <p className="text-slate-400 text-sm mb-2">Skills Acquired</p>
                            <div className="flex flex-wrap gap-2">
                              {certification.skills_acquired.split(",").map((skill) => (
                                <span
                                  key={skill.trim()}
                                  className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm border border-amber-500/30"
                                >
                                  {skill.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Overview */}
                        {certification.overview && (
                          <div className="mb-6">
                            <p className="text-slate-400 text-sm mb-2">Overview</p>
                            <p className="text-slate-300 leading-relaxed">
                              {certification.overview}
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-700">
                          {certification.certificate_link && (
                            <Button
                              onClick={() => window.open(certification.certificate_link, "_blank")}
                              className="flex items-center gap-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                            >
                              <FileText className="w-4 h-4" />
                              View Certificate
                            </Button>
                          )}
                          {certification.file_url && (
                            <Button
                              onClick={() => window.open(certification.file_url, "_blank")}
                              className="flex items-center gap-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                            >
                              <Download className="w-4 h-4" />
                              Download PDF
                            </Button>
                          )}
                          {role === "admin" && (
                            <>
                              <Button
                                onClick={() => openEditModal(certification)}
                                className="flex items-center gap-2 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                              >
                                <Edit2 className="w-4 h-4" />
                                Edit
                              </Button>
                              <Button
                                onClick={() => setShowDeleteConfirm(certification.id)}
                                className="flex items-center gap-2 bg-red-500/20 text-red-400 hover:bg-red-500/30"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Award className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400">No certifications yet</p>
              </div>
            )}
          </motion.div>

          {/* Edit Dialog */}
          <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingCert ? "Edit Certification" : "Add New Certification"}
                </DialogTitle>
                <DialogDescription>
                  Add or update your professional certifications
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Certification title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Provider Name
                    </label>
                    <Input
                      value={formData.provider_name}
                      onChange={(e) =>
                        setFormData({ ...formData, provider_name: e.target.value })
                      }
                      placeholder="Issuing organization"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Issued On
                    </label>
                    <Input
                      type="date"
                      value={formData.issued_on}
                      onChange={(e) =>
                        setFormData({ ...formData, issued_on: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Expiry Date (Optional)
                    </label>
                    <Input
                      type="date"
                      value={formData.expiry_date}
                      onChange={(e) =>
                        setFormData({ ...formData, expiry_date: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Issued To
                    </label>
                    <Input
                      value={formData.issued_to}
                      onChange={(e) =>
                        setFormData({ ...formData, issued_to: e.target.value })
                      }
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Issued By
                    </label>
                    <Input
                      value={formData.issued_by}
                      onChange={(e) =>
                        setFormData({ ...formData, issued_by: e.target.value })
                      }
                      placeholder="Organization"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Certificate Link / Validation URL
                  </label>
                  <Input
                    type="url"
                    value={formData.certificate_link}
                    onChange={(e) =>
                      setFormData({ ...formData, certificate_link: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>

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
                    Overview / Description
                  </label>
                  <Textarea
                    value={formData.overview}
                    onChange={(e) =>
                      setFormData({ ...formData, overview: e.target.value })
                    }
                    placeholder="Details about this certification"
                    className="min-h-24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Badge URL
                  </label>
                  <Input
                    value={formData.badge_url}
                    onChange={(e) =>
                      setFormData({ ...formData, badge_url: e.target.value })
                    }
                    placeholder="Image URL for badge"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSaveCertification}
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600"
                  >
                    {isSubmitting ? "Saving..." : "Save Certification"}
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
                  Are you sure you want to delete this certification?
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() =>
                      handleDeleteCertification(showDeleteConfirm)
                    }
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

export default Certifications;
