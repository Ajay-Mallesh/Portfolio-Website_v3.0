import { useState, FormEvent, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Github, Linkedin, Instagram, Send, Trash2, Edit2, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Layout from '@/components/Layout';
import SectionWrapper from '@/components/SectionWrapper';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
}

interface SocialLink {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface SocialFormData {
  label: string;
  href: string;
}

const Contact = () => {
  const { user, role } = useAuth();
  const [searchParams] = useSearchParams();
  const querySubject = searchParams.get('subject') || '';
  
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    {
      id: '1',
      label: 'GitHub',
      href: 'https://github.com/ajaymalesh',
      icon: Github,
      color: 'hover:text-white hover:bg-slate-700',
    },
    {
      id: '2',
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/ajaymalesh',
      icon: Linkedin,
      color: 'hover:text-blue-400 hover:bg-blue-400/10',
    },
    {
      id: '3',
      label: 'Instagram',
      href: 'https://instagram.com/ajay_malesh_',
      icon: Instagram,
      color: 'hover:text-pink-400 hover:bg-pink-400/10',
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Project Inquiry',
      message: 'I would like to discuss a new project opportunity.',
      timestamp: new Date(Date.now() - 86400000).toLocaleString(),
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      subject: 'Collaboration',
      message: 'Great work on your portfolio! Would love to collaborate.',
      timestamp: new Date().toLocaleString(),
    },
  ]);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: querySubject,
    message: '',
  });

  useEffect(() => {
    if (querySubject) {
      setFormData((prev) => ({
        ...prev,
        subject: querySubject,
      }));
    }
  }, [querySubject]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
  const [socialFormData, setSocialFormData] = useState<SocialFormData>({
    label: '',
    href: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newMessage: Message = {
        id: Date.now().toString(),
        ...formData,
        timestamp: new Date().toLocaleString(),
      };

      setMessages([newMessage, ...messages]);
      toast.success('Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(messages.filter((m) => m.id !== id));
    setShowDeleteConfirm(null);
    toast.success('Message deleted successfully');
  };

  const handleSaveSocial = () => {
    if (!socialFormData.label || !socialFormData.href) {
      toast.error('Please fill in all fields');
      return;
    }

    if (editingSocial) {
      setSocialLinks(
        socialLinks.map((s) =>
          s.id === editingSocial.id
            ? { ...s, label: socialFormData.label, href: socialFormData.href }
            : s
        )
      );
      toast.success('Social link updated successfully');
    } else {
      const newSocial: SocialLink = {
        id: Date.now().toString(),
        label: socialFormData.label,
        href: socialFormData.href,
        icon: Github,
        color: 'hover:text-slate-400 hover:bg-slate-700',
      };
      setSocialLinks([...socialLinks, newSocial]);
      toast.success('Social link added successfully');
    }

    resetSocialForm();
  };

  const handleDeleteSocial = (id: string) => {
    setSocialLinks(socialLinks.filter((s) => s.id !== id));
    toast.success('Social link deleted successfully');
  };

  const openSocialModal = (social?: SocialLink) => {
    if (social) {
      setEditingSocial(social);
      setSocialFormData({
        label: social.label,
        href: social.href,
      });
    } else {
      setEditingSocial(null);
      setSocialFormData({ label: '', href: '' });
    }
    setShowSocialModal(true);
  };

  const resetSocialForm = () => {
    setShowSocialModal(false);
    setEditingSocial(null);
    setSocialFormData({ label: '', href: '' });
  };

  return (
    <Layout>
      <SectionWrapper>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              Get In Touch
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Have a project in mind? Let's connect and create something amazing together!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-8"
            >
              <div className="group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-colors">
                    <Mail className="text-emerald-400" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Email</p>
                    <p className="text-white font-medium">ajaymalesh2003@gmail.com</p>
                  </div>
                </div>
              </div>

              <motion.div
                className="group cursor-pointer"
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-colors">
                    <Phone className="text-emerald-400" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Phone</p>
                    <p className="text-white font-medium">+91 7899787875</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="group cursor-pointer"
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-colors">
                    <MapPin className="text-emerald-400" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Location</p>
                    <p className="text-white font-medium">Malavalli, Karnataka, India</p>
                  </div>
                </div>
              </motion.div>

              {/* Social Links */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Follow Me</h3>
                  {role === 'admin' && (
                    <button
                      onClick={() => openSocialModal()}
                      className="p-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 transition-colors"
                      title="Add social link"
                    >
                      <Plus size={18} />
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((social) => (
                    <div key={social.id} className="relative group">
                      <motion.a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-4 bg-slate-800/50 border border-emerald-600/30 rounded-xl text-slate-300 ${social.color} transition-all`}
                        aria-label={social.label}
                      >
                        <social.icon size={24} />
                      </motion.a>
                      {role === 'admin' && (
                        <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openSocialModal(social)}
                            className="p-1.5 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteSocial(social.id)}
                            className="p-1.5 bg-red-600 rounded hover:bg-red-700 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-emerald-600/30 rounded-xl p-8 space-y-6">
                <h2 className="text-2xl font-semibold text-white">Send a Message</h2>
                <p className="text-slate-300 text-sm">
                  Fill out the form below and I'll get back to you as soon as possible.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-200 mb-2">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                      Your Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-200 mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project Inquiry"
                    required
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-200 mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project or just say hello..."
                    rows={4}
                    required
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin">⏳</span> Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} /> Send Message
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>

          {/* Admin Messages Section */}
          {role === 'admin' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-16"
            >
              <div className="bg-slate-900 border border-emerald-600/30 rounded-xl p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    Received Messages <span className="text-emerald-400 text-lg">({messages.length})</span>
                  </h2>
                  <p className="text-slate-400">Manage contact form submissions</p>
                </div>

                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <Mail className="mx-auto text-slate-600 mb-4" size={48} />
                    <p className="text-slate-400">No messages yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="group bg-slate-800/50 border border-slate-700/50 hover:border-emerald-600/50 rounded-lg p-6 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{msg.name}</h3>
                            <p className="text-sm text-slate-400">{msg.email}</p>
                            <p className="text-xs text-slate-500 mt-1">{msg.timestamp}</p>
                          </div>
                          <button
                            onClick={() => setShowDeleteConfirm(msg.id)}
                            className="p-2 rounded opacity-0 group-hover:opacity-100 bg-red-600/20 hover:bg-red-600/40 text-red-400 transition-all"
                            title="Delete message"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm font-medium text-emerald-400 mb-1">Subject</p>
                          <p className="text-slate-200">{msg.subject}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-emerald-400 mb-1">Message</p>
                          <p className="text-slate-300 whitespace-pre-wrap">{msg.message}</p>
                        </div>

                        {/* Delete Confirmation Modal */}
                        {showDeleteConfirm === msg.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                            onClick={() => setShowDeleteConfirm(null)}
                          >
                            <motion.div
                              className="bg-slate-900 border border-emerald-600/30 rounded-xl p-6 max-w-sm w-full"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <h3 className="text-xl font-semibold text-white mb-2">Delete Message?</h3>
                              <p className="text-slate-400 mb-6">This action cannot be undone.</p>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => setShowDeleteConfirm(null)}
                                  className="flex-1 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors font-medium"
                                >
                                  Delete
                                </button>
                              </div>
                            </motion.div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </SectionWrapper>

      {/* Social Link Modal */}
      {showSocialModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={resetSocialForm}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-emerald-600/30 rounded-xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">
                {editingSocial ? 'Edit Social Link' : 'Add Social Link'}
              </h2>
              <button
                onClick={resetSocialForm}
                className="p-1 rounded hover:bg-slate-800 transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Platform Name
                </label>
                <Input
                  value={socialFormData.label}
                  onChange={(e) => setSocialFormData({ ...socialFormData, label: e.target.value })}
                  placeholder="e.g., GitHub, LinkedIn"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Profile URL
                </label>
                <Input
                  value={socialFormData.href}
                  onChange={(e) => setSocialFormData({ ...socialFormData, href: e.target.value })}
                  placeholder="https://..."
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={resetSocialForm}
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSocial}
                  className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors font-medium"
                >
                  {editingSocial ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </Layout>
  );
};

export default Contact;

