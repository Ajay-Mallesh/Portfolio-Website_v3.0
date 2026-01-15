import { useState } from 'react';
import { GraduationCap, Plus, Edit2, Trash2, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useEducation } from '@/hooks/useEducation';

interface EducationFormData {
  id?: number;
  qualification: string;
  college: string;
  university: string;
  year_from: number;
  year_to: number;
  percentage: string;
  location: string;
}

const Education = () => {
  const { role } = useAuth();
  const { education, createEducation, updateEducation, deleteEducation, loading } = useEducation();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [formData, setFormData] = useState<EducationFormData>({
    qualification: '',
    college: '',
    university: '',
    year_from: new Date().getFullYear(),
    year_to: new Date().getFullYear(),
    percentage: '',
    location: '',
  });

  const handleEdit = (edu: any) => {
    setFormData({
      id: edu.id,
      qualification: edu.qualification,
      college: edu.college,
      university: edu.university,
      year_from: edu.year_from,
      year_to: edu.year_to,
      percentage: edu.percentage,
      location: edu.location,
    });
    setEditingId(edu.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.qualification || !formData.university) {
      toast.error('Please fill in qualification and university');
      return;
    }

    try {
      if (editingId) {
        await updateEducation(editingId, formData);
        toast.success('Education updated successfully');
      } else {
        await createEducation(formData);
        toast.success('Education added successfully');
      }
      resetForm();
    } catch (error) {
      toast.error('Failed to save education');
    }
  };

  const resetForm = () => {
    setFormData({
      qualification: '',
      college: '',
      university: '',
      year_from: new Date().getFullYear(),
      year_to: new Date().getFullYear(),
      percentage: '',
      location: '',
    });
    setEditingId(null);
    setShowModal(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEducation(id);
      setShowDeleteConfirm(null);
      toast.success('Education deleted successfully');
    } catch (error) {
      toast.error('Failed to delete education');
    }
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return (
      <Layout>
        <SectionWrapper id="education">
          <div className="text-center text-gray-400">Loading education...</div>
        </SectionWrapper>
      </Layout>
    );
  }

  return (
    <Layout>
      <SectionWrapper id="education">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-2">My Academic Journey</h2>
          <p className="text-gray-400">Education and qualifications</p>
        </motion.div>

        {role === 'admin' && (
          <div className="flex justify-end mb-6">
            <Button onClick={openAddModal} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </div>
        )}

        {education && education.length > 0 ? (
          <div className="space-y-4">
            {education.map((edu: any) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="border border-cyan-500/30 rounded-lg bg-slate-900/50 backdrop-blur overflow-hidden hover:border-cyan-500/60 transition-colors"
              >
                {/* Collapsed View */}
                {expandedId !== edu.id ? (
                  <motion.div
                    onClick={() => setExpandedId(edu.id)}
                    className="p-6 cursor-pointer hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <GraduationCap className="w-8 h-8 text-cyan-400 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white">{edu.qualification}</h3>
                          <p className="text-gray-300">{edu.university}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {edu.year_from} - {edu.year_to}
                          </p>
                        </div>
                      </div>
                      <ChevronDown className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    </div>
                  </motion.div>
                ) : (
                  /* Expanded View */
                  <motion.div className="p-6 bg-slate-800/50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <GraduationCap className="w-8 h-8 text-cyan-400 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white">{edu.qualification}</h3>
                          <p className="text-gray-300">{edu.university}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {edu.year_from} - {edu.year_to}
                          </p>
                        </div>
                      </div>
                      <ChevronDown className="w-5 h-5 text-cyan-400 transform rotate-180 flex-shrink-0" />
                    </div>

                    <div className="ml-12 space-y-4">
                      {edu.college && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-1">College</h4>
                          <p className="text-gray-400">{edu.college}</p>
                        </div>
                      )}

                      {edu.percentage && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-1">Percentage / CGPA</h4>
                          <p className="text-gray-400">{edu.percentage}</p>
                        </div>
                      )}

                      {edu.location && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-1">Location</h4>
                          <p className="text-gray-400">{edu.location}</p>
                        </div>
                      )}

                      {role === 'admin' && (
                        <div className="flex gap-2 mt-6 pt-4 border-t border-slate-700">
                          <Button
                            onClick={() => {
                              handleEdit(edu);
                              setExpandedId(null);
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => {
                              setShowDeleteConfirm(edu.id);
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
            <p>No education added yet</p>
          </div>
        )}

        {/* Add/Edit Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Education' : 'Add Education'}</DialogTitle>
              <DialogDescription>Fill in your education details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Qualification (e.g., B.E, B.Tech, M.Tech)"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                className="bg-slate-800 border-slate-700"
              />
              <Input
                placeholder="University"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className="bg-slate-800 border-slate-700"
              />
              <Input
                placeholder="College"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="bg-slate-800 border-slate-700"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Year From"
                  value={formData.year_from}
                  onChange={(e) => setFormData({ ...formData, year_from: parseInt(e.target.value) || 0 })}
                  className="bg-slate-800 border-slate-700"
                />
                <Input
                  type="number"
                  placeholder="Year To"
                  value={formData.year_to}
                  onChange={(e) => setFormData({ ...formData, year_to: parseInt(e.target.value) || 0 })}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <Input
                placeholder="Percentage / CGPA"
                value={formData.percentage}
                onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                className="bg-slate-800 border-slate-700"
              />
              <Input
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
              <p className="text-gray-400 mb-6">Are you sure you want to delete this education entry?</p>
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

export default Education;
