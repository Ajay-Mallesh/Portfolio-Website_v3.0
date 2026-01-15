import { useState, useEffect } from 'react';
import { Building2, ExternalLink, Plus, Edit2, Trash2, FileText, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Layout from '@/components/Layout';
import SectionWrapper from '@/components/SectionWrapper';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useInternships } from '@/hooks/useInternships';

interface InternshipFormData {
  id?: string;
  company_name: string;
  designation: string;
  from_date: string;
  to_date: string;
  duration_months: number;
  location: string;
  description: string;
  skills_acquired: string;
  certificate_url?: string;
  certificate_upload?: string;
}

const Internships = () => {
  const { role } = useAuth();
  const { internships, loading, error, createInternship, updateInternship, deleteInternship } = useInternships();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<InternshipFormData>({
    company_name: '',
    designation: '',
    from_date: '',
    to_date: '',
    duration_months: 0,
    location: '',
    description: '',
    skills_acquired: '',
    certificate_url: '',
    certificate_upload: '',
  });

  const handleEdit = (internship: any) => {
    setFormData({
      id: internship.id,
      company_name: internship.company_name,
      designation: internship.designation,
      from_date: internship.from_date,
      to_date: internship.to_date,
      duration_months: internship.duration_months,
      location: internship.location,
      description: internship.description,
      skills_acquired: internship.skills_acquired,
      certificate_url: internship.certificate_url || '',
      certificate_upload: internship.certificate_upload || '',
    });
    setEditingId(internship.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.company_name || !formData.designation) {
      toast.error('Please fill in company name and designation');
      return;
    }

    try {
      if (editingId) {
        await updateInternship(editingId, formData);
        toast.success('Internship updated successfully');
      } else {
        await createInternship(formData);
        toast.success('Internship added successfully');
      }
      resetForm();
    } catch (error) {
      toast.error('Failed to save internship');
    }
  };

  const resetForm = () => {
    setFormData({
      company_name: '',
      designation: '',
      from_date: '',
      to_date: '',
      duration_months: 0,
      location: '',
      description: '',
      skills_acquired: '',
      certificate_url: '',
      certificate_upload: '',
    });
    setEditingId(null);
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInternship(id);
      setShowDeleteConfirm(null);
      toast.success('Internship deleted successfully');
    } catch (error) {
      toast.error('Failed to delete internship');
    }
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return (
      <Layout>
        <SectionWrapper id="internships">
          <div className="text-center text-gray-400">Loading internships...</div>
        </SectionWrapper>
      </Layout>
    );
  }

  return (
    <Layout>
      <SectionWrapper id="internships">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-2">My Internships</h2>
          <p className="text-gray-400">Professional experience and learning journey</p>
        </motion.div>

        {role === 'admin' && (
          <div className="flex justify-end mb-6">
            <Button onClick={openAddModal} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Internship
            </Button>
          </div>
        )}

        {internships && internships.length > 0 ? (
          <div className="space-y-4">
            {internships.map((internship: any) => (
              <motion.div
                key={internship.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="border border-emerald-500/30 rounded-lg bg-slate-900/50 backdrop-blur overflow-hidden hover:border-emerald-500/60 transition-colors"
              >
                {/* Collapsed View */}
                {expandedId !== internship.id ? (
                  <motion.div
                    onClick={() => setExpandedId(internship.id)}
                    className="p-6 cursor-pointer hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <Building2 className="w-8 h-8 text-emerald-400 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white">{internship.company_name}</h3>
                          <p className="text-gray-300">{internship.designation}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {internship.location} • {internship.duration_months} months
                          </p>
                        </div>
                      </div>
                      <ChevronDown className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    </div>
                  </motion.div>
                ) : (
                  /* Expanded View */
                  <motion.div className="p-6 bg-slate-800/50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <Building2 className="w-8 h-8 text-emerald-400 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white">{internship.company_name}</h3>
                          <p className="text-gray-300">{internship.designation}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {internship.location} • {internship.duration_months} months
                          </p>
                        </div>
                      </div>
                      <ChevronDown className="w-5 h-5 text-emerald-400 transform rotate-180 flex-shrink-0" />
                    </div>

                    <div className="ml-12 space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Description</h4>
                        <p className="text-gray-400">{internship.description}</p>
                      </div>

                      {internship.skills_acquired && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">Skills Acquired</h4>
                          <div className="flex flex-wrap gap-2">
                            {internship.skills_acquired.split(',').map((skill: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm"
                              >
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {(internship.certificate_url || internship.certificate_upload) && (
                        <div className="flex gap-2 flex-wrap">
                          {internship.certificate_url && (
                            <a
                              href={internship.certificate_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              View Certificate
                            </a>
                          )}
                          {internship.certificate_upload && (
                            <a
                              href={internship.certificate_upload}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                            >
                              <FileText className="w-4 h-4" />
                              Download Certificate
                            </a>
                          )}
                        </div>
                      )}

                      {role === 'admin' && (
                        <div className="flex gap-2 mt-6 pt-4 border-t border-slate-700">
                          <Button
                            onClick={() => {
                              handleEdit(internship);
                              setExpandedId(null);
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => {
                              setShowDeleteConfirm(internship.id);
                              setExpandedId(null);
                            }}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>No internships added yet</p>
          </div>
        )}

        {/* Add/Edit Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="bg-slate-900 border-slate-700 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Internship' : 'Add Internship'}</DialogTitle>
              <DialogDescription>Fill in the internship details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Company Name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="bg-slate-800 border-slate-700"
              />
              <Input
                placeholder="Designation"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="bg-slate-800 border-slate-700"
              />
              <Input
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-slate-800 border-slate-700"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={formData.from_date}
                  onChange={(e) => setFormData({ ...formData, from_date: e.target.value })}
                  className="bg-slate-800 border-slate-700"
                />
                <Input
                  type="date"
                  value={formData.to_date}
                  onChange={(e) => setFormData({ ...formData, to_date: e.target.value })}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <Input
                type="number"
                placeholder="Duration (months)"
                value={formData.duration_months}
                onChange={(e) => setFormData({ ...formData, duration_months: parseInt(e.target.value) || 0 })}
                className="bg-slate-800 border-slate-700"
              />
              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-slate-800 border-slate-700"
              />
              <Input
                placeholder="Skills Acquired (comma separated)"
                value={formData.skills_acquired}
                onChange={(e) => setFormData({ ...formData, skills_acquired: e.target.value })}
                className="bg-slate-800 border-slate-700"
              />
              <Input
                placeholder="Certificate URL"
                value={formData.certificate_url || ''}
                onChange={(e) => setFormData({ ...formData, certificate_url: e.target.value })}
                className="bg-slate-800 border-slate-700"
              />
              <div className="flex gap-2 justify-end">
                <Button onClick={resetForm} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div className="bg-slate-900 border border-slate-700 rounded-lg p-6 max-w-sm">
              <h3 className="text-lg font-semibold text-white mb-2">Confirm Delete</h3>
              <p className="text-gray-400 mb-6">Are you sure you want to delete this internship?</p>
              <div className="flex gap-2 justify-end">
                <Button onClick={() => setShowDeleteConfirm(null)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={() => handleDelete(showDeleteConfirm)} className="bg-red-600 hover:bg-red-700">
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </SectionWrapper>
    </Layout>
  );
};

export default Internships;
