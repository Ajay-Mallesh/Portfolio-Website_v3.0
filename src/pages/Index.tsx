import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Download, Eye, GraduationCap, MapPin, Calendar, Code, Wrench, Database, Edit, Trash2, Plus, Upload, Image as ImageIcon, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import SectionWrapper from "@/components/SectionWrapper";
import SkillBar from "@/components/SkillBar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useResume } from "@/hooks/useResume";
import { useProfileImage } from "@/hooks/useProfileImage";
import { useTechnicalSkills, useOtherSkills } from "@/hooks/useSkills";
import { useEducation } from "@/hooks/useEducation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const technicalSkills = [
  { name: "React / React Native", level: 9 },
  { name: "TypeScript / JavaScript", level: 9 },
  { name: "Python", level: 8 },
  { name: "Node.js / Express", level: 8 },
  { name: "SQL / PostgreSQL", level: 8 },
];

const otherSkills = [
  { name: "Problem Solving", level: 9 },
  { name: "Team Collaboration", level: 9 },
  { name: "Communication", level: 8 },
  { name: "Leadership", level: 8 },
];

const tools = ["Git", "VS Code", "Docker", "AWS", "Supabase", "Firebase", "Figma", "Postman"];
const frameworks = ["React", "Next.js", "Tailwind CSS", "Bootstrap", "Express.js", "Django"];

const Home = () => {
  const { role } = useAuth();
  console.log('Home page - admin role:', role);
  
  // Resume Hook
  const { fetchResumes, resumes, openResume, createResume, updateResume, deleteResume, loading: resumeLoading, uploadResumeFile } = useResume();
  
  // Profile Image Hook
  const { images: profileImages, fetchImages, getPrimaryImage, createImage, deleteImage, uploadImageFile } = useProfileImage();
  
  // Skills Hooks
  const { skills: technicalSkillsDB, fetchSkills: fetchTechnicalSkills, createSkill: createTechnicalSkill, deleteSkill: deleteTechnicalSkill, loading: techSkillsLoading } = useTechnicalSkills();
  const { skills: otherSkillsDB, fetchSkills: fetchOtherSkills, createSkill: createOtherSkill, deleteSkill: deleteOtherSkill, loading: otherSkillsLoading } = useOtherSkills();

  // Education Hook
  const { education: educationData, createEducation, updateEducation, deleteEducation, loading: educationLoading } = useEducation();

  // Fetch data on mount
  useEffect(() => {
    fetchResumes();
    fetchImages();
    fetchTechnicalSkills();
    fetchOtherSkills();
  }, []);
  
  // Hero/Profile State
  const [heroData, setHeroData] = useState({
    firstName: "Ajay",
    lastName: "Mallesh",
    title: "Full Stack Developer",
    description: "Passionate software developer with expertise in building modern web applications. I love turning complex problems into elegant, user-friendly solutions.",
    profileInitials: "AM",
    status: "Open to work 🚀",
    resumeLink: "https://drive.google.com/file/d/YOUR_RESUME_ID/view",
  });

  const [technicalSkillsData, setTechnicalSkillsData] = useState(technicalSkills);
  const [otherSkillsData, setOtherSkillsData] = useState(otherSkills);
  const [toolsData, setToolsData] = useState(tools);
  const [frameworksData, setFrameworksData] = useState(frameworks);

  // Dialog States
  const [editingEducation, setEditingEducation] = useState<any>(null);
  const [showEducationDialog, setShowEducationDialog] = useState(false);
  const [showHeroDialog, setShowHeroDialog] = useState(false);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [showProfileImageDialog, setShowProfileImageDialog] = useState(false);
  const [showTechnicalSkillsDialog, setShowTechnicalSkillsDialog] = useState(false);
  const [showOtherSkillsDialog, setShowOtherSkillsDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: string; index?: number; id?: string } | null>(null);
  
  // File refs
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const resumeFileInputRef = useRef<HTMLInputElement>(null);
  
  const [newEducationForm, setNewEducationForm] = useState({
    qualification: "",
    college: "",
    university: "",
    year_from: "",
    year_to: "",
    percentage: "",
    location: "",
  });

  const [newResumeForm, setNewResumeForm] = useState({
    title: "",
    type: "link" as "link" | "pdf" | "word",
    file_url: "",
    is_primary: false,
    file_name: "",
  });

  const [newHeroForm, setNewHeroForm] = useState(heroData);
  
  const [newProfileImageForm, setNewProfileImageForm] = useState({
    image_url: "",
    image_type: "link" as "jpeg" | "png" | "link",
    file_name: "",
  });
  
  const [newTechnicalSkillForm, setNewTechnicalSkillForm] = useState({
    name: "",
    level: 5,
    category: "Programming Languages",
  });
  
  const [newOtherSkillForm, setNewOtherSkillForm] = useState({
    name: "",
    level: 5,
    category: "Soft Skills",
  });
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  // Resume File Upload Handler
  const handleResumeFileUpload = async (file: File) => {
    setUploadingResume(true);
    const publicUrl = await uploadResumeFile(file);
    if (publicUrl) {
      setNewResumeForm({
        ...newResumeForm,
        file_url: publicUrl,
        file_name: file.name,
        type: file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'word'
      });
    }
    setUploadingResume(false);
  };

  // Refetch images when profile image dialog opens
  useEffect(() => {
    if (showProfileImageDialog) {
      fetchImages();
    }
  }, [showProfileImageDialog]);

  const handleSaveEducation = async () => {
    const yearFrom = parseInt(newEducationForm.year_from);
    const yearTo = parseInt(newEducationForm.year_to);

    if (isNaN(yearFrom) || isNaN(yearTo)) {
      toast.error("Years must be valid numbers");
      return;
    }

    if (editingEducation !== null) {
      await updateEducation(editingEducation.id, {
        ...newEducationForm,
        year_from: yearFrom,
        year_to: yearTo,
      });
    } else {
      await createEducation({
        ...newEducationForm,
        year_from: yearFrom,
        year_to: yearTo,
      });
    }
    setShowEducationDialog(false);
    setEditingEducation(null);
    setNewEducationForm({ qualification: "", college: "", university: "", year_from: "", year_to: "", percentage: "", location: "" });
  };

  const handleDeleteEducation = async (id: number) => {
    await deleteEducation(id);
    setShowDeleteConfirm(null);
  };

  // Removed handleAddSkill and handleDeleteSkill as they are replaced by specific handlers

  const handleDeleteTool = (index: number) => {
    setToolsData(toolsData.filter((_, i) => i !== index));
    toast.success("Tool deleted!");
    setShowDeleteConfirm(null);
  };

  const handleDeleteFramework = (index: number) => {
    setFrameworksData(frameworksData.filter((_, i) => i !== index));
    toast.success("Framework deleted!");
    setShowDeleteConfirm(null);
  };

  const handleAddTool = (toolName: string) => {
    if (toolName && !toolsData.includes(toolName)) {
      setToolsData([...toolsData, toolName]);
      toast.success("Tool added!");
    }
  };

  const handleAddFramework = (frameworkName: string) => {
    if (frameworkName && !frameworksData.includes(frameworkName)) {
      setFrameworksData([...frameworksData, frameworkName]);
      toast.success("Framework added!");
    }
  };

  const handleDownloadResume = () => {
    // Open primary resume or first available
    const primaryResume = resumes.find(r => r.is_primary) || resumes[0];
    if (primaryResume) {
      openResume(primaryResume);
    } else {
      toast.error("No resume available");
    }
  };

  const handleSaveHero = () => {
    setHeroData(newHeroForm);
    setShowHeroDialog(false);
    toast.success("Profile updated!");
  };

  const handleSaveResume = async () => {
    if (!newResumeForm.title || !newResumeForm.file_url) {
      toast.error("Please fill in all fields");
      return;
    }

    const result = await createResume(newResumeForm);
    if (result) {
      setNewResumeForm({
        title: "",
        type: "link",
        file_url: "",
        is_primary: false,
        file_name: "",
      });
      setShowResumeDialog(false);
    }
  };

  const handleDeleteResume = async (id: number) => {
    await deleteResume(id);
  };

  // Profile Image Handlers
  const handleProfileImageFileUpload = async (file: File) => {
    setUploadingImage(true);
    const publicUrl = await uploadImageFile(file);
    if (publicUrl) {
      setNewProfileImageForm({
        image_url: publicUrl,
        image_type: file.type === "image/png" ? "png" : "jpeg",
        file_name: file.name,
      });
    }
    setUploadingImage(false);
  };

  const handleSaveProfileImage = async () => {
    if (!newProfileImageForm.image_url) {
      toast.error("Please upload or enter an image URL");
      return;
    }

    // Set as primary if it's the first image
    const isPrimary = profileImages.length === 0;

    const result = await createImage(
      newProfileImageForm.image_url,
      newProfileImageForm.image_type,
      newProfileImageForm.file_name,
      isPrimary
    );
    
    if (result) {
      setNewProfileImageForm({
        image_url: "",
        image_type: "link",
        file_name: "",
      });
      // Refetch images to ensure the new image displays
      await fetchImages();
      setShowProfileImageDialog(false);
    }
  };

  const handleDeleteProfileImage = async (id: number) => {
    await deleteImage(id);
  };

  // Technical Skills Handlers
  const handleSaveTechnicalSkill = async () => {
    if (!newTechnicalSkillForm.name) {
      toast.error("Please enter a skill name");
      return;
    }

    const result = await createTechnicalSkill({
      name: newTechnicalSkillForm.name,
      level: newTechnicalSkillForm.level,
      category: newTechnicalSkillForm.category
    });

    if (result) {
      setNewTechnicalSkillForm({
        name: "",
        level: 5,
        category: "Programming Languages",
      });
      setShowTechnicalSkillsDialog(false);
    }
  };

  const handleDeleteTechnicalSkill = async (id: number) => {
    await deleteTechnicalSkill(id);
  };

  // Other Skills Handlers
  const handleSaveOtherSkill = async () => {
    if (!newOtherSkillForm.name) {
      toast.error("Please enter a skill name");
      return;
    }

    const result = await createOtherSkill({
      name: newOtherSkillForm.name,
      level: newOtherSkillForm.level,
      category: newOtherSkillForm.category
    });

    if (result) {
      setNewOtherSkillForm({
        name: "",
        level: 5,
        category: "Soft Skills",
      });
      setShowOtherSkillsDialog(false);
    }
  };

  const handleDeleteOtherSkill = async (id: number) => {
    await deleteOtherSkill(id);
  };

  return (
    <Layout>
      {/* Hero/Portfolio Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.08),transparent_50%)]" />
        
        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-emerald-500/10 blur-xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-cyan-500/10 blur-xl"
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative group"
            >
              <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-emerald-500/30 shadow-2xl shadow-emerald-500/20 relative">
                {profileImages.find(img => img.is_primary)?.image_url ? (
                  <img 
                    src={profileImages.find(img => img.is_primary)?.image_url} 
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-6xl font-bold">
                    <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{heroData.profileInitials}</span>
                  </div>
                )}
                {role === "admin" && (
                  <button
                    onClick={() => setShowProfileImageDialog(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                    title="Edit profile image"
                  >
                    <ImageIcon size={32} className="text-white" />
                  </button>
                )}
              </div>
              <div className="absolute -bottom-4 -right-4 p-4 bg-slate-800/90 backdrop-blur-md rounded-xl border border-emerald-500/30 shadow-xl">
                <p className="text-emerald-400 font-mono text-sm">{heroData.status}</p>
              </div>
            </motion.div>

            {/* Hero Content */}
            <div className="text-center lg:text-left flex-1">
              {role === "admin" && (
                <button
                  onClick={() => {
                    setNewHeroForm(heroData);
                    setShowHeroDialog(true);
                  }}
                  className="mb-4 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded text-sm flex items-center gap-2 mx-auto lg:mx-0"
                >
                  <Edit size={14} /> Edit Details
                </button>
              )}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-emerald-400 font-mono text-sm mb-4"
              >
                Hello, I'm
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl lg:text-7xl font-bold mb-4"
              >
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{heroData.firstName}</span>{" "}
                <span className="text-white">{heroData.lastName}</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl lg:text-2xl text-slate-300 mb-6 h-8"
              >
                <TypeAnimation
                  sequence={[
                    heroData.title,
                    2000,
                    "React Enthusiast",
                    2000,
                    "Problem Solver",
                    2000,
                    "Tech Explorer",
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                  className="text-emerald-400"
                />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-slate-400 max-w-xl mb-8 text-lg"
              >
                {heroData.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4 justify-center lg:justify-start"
              >
                <button className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2">
                  <Eye size={18} /> View Resume
                </button>
                <button 
                  onClick={handleDownloadResume}
                  className="px-8 py-3 border-2 border-emerald-600 text-emerald-400 hover:bg-emerald-600/10 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <Download size={18} /> Download CV
                </button>
                {role === "admin" && (
                  <button
                    onClick={() => setShowResumeDialog(true)}
                    className="px-8 py-3 border-2 border-blue-600 text-blue-400 hover:bg-blue-600/10 rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <Edit size={18} /> Edit Resume
                  </button>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <SectionWrapper id="skills" className="bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-3">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Skills & Expertise</span>
            </h2>
            <p className="text-slate-400 text-lg">Technologies and tools I work with</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto mb-12">
            {/* Technical Skills */}
            <div className="bg-slate-700/40 backdrop-blur-sm border border-slate-600 rounded-xl p-8 hover:border-emerald-500/50 transition-all">
              <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => {
                const el = document.getElementById('tech-skills-list');
                if (el) el.classList.toggle('hidden');
              }}>
                <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                  <Code className="text-emerald-400" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white">Technical Skills</h3>
                {role === "admin" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTechnicalSkillsDialog(true);
                    }}
                    className="ml-auto p-1 hover:bg-emerald-500/20 rounded"
                    title="Add skill"
                  >
                    <Plus size={18} className="text-emerald-400" />
                  </button>
                )}
              </div>
              <div id="tech-skills-list" className="hidden">
                {technicalSkillsDB.length > 0 ? (
                  technicalSkillsDB.map((skill) => (
                    <div key={skill.id} className="group">
                      <div className="flex items-center justify-between">
                        <SkillBar name={skill.name} level={skill.level} delay={0} />
                        {role === "admin" && (
                          <button
                            onClick={() => handleDeleteTechnicalSkill(skill.id)}
                            className="ml-2 p-1 hover:bg-red-500/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete skill"
                          >
                            <Trash2 size={16} className="text-red-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm">No technical skills yet. {role === "admin" && "Click the + button to add one."}</p>
                )}
              </div>
            </div>

            {/* Other Skills */}
            <div className="bg-slate-700/40 backdrop-blur-sm border border-slate-600 rounded-xl p-8 hover:border-cyan-500/50 transition-all">
              <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => {
                const el = document.getElementById('other-skills-list');
                if (el) el.classList.toggle('hidden');
              }}>
                <div className="p-3 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                  <Wrench className="text-cyan-400" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white">Other Skills</h3>
                {role === "admin" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowOtherSkillsDialog(true);
                    }}
                    className="ml-auto p-1 hover:bg-cyan-500/20 rounded"
                    title="Add skill"
                  >
                    <Plus size={18} className="text-cyan-400" />
                  </button>
                )}
              </div>
              <div id="other-skills-list" className="hidden">
                {otherSkillsDB.length > 0 ? (
                  otherSkillsDB.map((skill) => (
                    <div key={skill.id} className="group">
                      <div className="flex items-center justify-between">
                        <SkillBar name={skill.name} level={skill.level} delay={0} />
                        {role === "admin" && (
                          <button
                            onClick={() => handleDeleteOtherSkill(skill.id)}
                            className="ml-2 p-1 hover:bg-red-500/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete skill"
                          >
                            <Trash2 size={16} className="text-red-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm">No other skills yet. {role === "admin" && "Click the + button to add one."}</p>
                )}
              </div>
            </div>
          </div>

          {/* Tools & Frameworks */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-700/40 backdrop-blur-sm border border-slate-600 rounded-xl p-6 hover:border-emerald-500/50 transition-all"
            >
              <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => {
                const el = document.getElementById('tools-list');
                if (el) el.classList.toggle('hidden');
              }}>
                <Database className="text-emerald-400" size={20} />
                <h4 className="font-semibold text-white">Tools & Technologies</h4>
                {role === "admin" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const toolName = prompt("Enter tool name:");
                      if (toolName) handleAddTool(toolName);
                    }}
                    className="ml-auto p-1 hover:bg-emerald-500/20 rounded"
                    title="Add tool"
                  >
                    <Plus size={18} className="text-emerald-400" />
                  </button>
                )}
              </div>
              <div id="tools-list" className="hidden flex flex-wrap gap-2">
                {toolsData.map((tool, index) => (
                  <div key={tool} className="group relative">
                    <span className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-300 text-sm border border-emerald-500/30 hover:border-emerald-500 transition-colors block">
                      {tool}
                    </span>
                    {role === "admin" && (
                      <button
                        onClick={() => handleDeleteTool(index)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete"
                      >
                        <Trash2 size={12} className="text-white" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-slate-700/40 backdrop-blur-sm border border-slate-600 rounded-xl p-6 hover:border-cyan-500/50 transition-all"
            >
              <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => {
                const el = document.getElementById('frameworks-list');
                if (el) el.classList.toggle('hidden');
              }}>
                <Code className="text-cyan-400" size={20} />
                <h4 className="font-semibold text-white">Frameworks & Libraries</h4>
                {role === "admin" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const frameworkName = prompt("Enter framework name:");
                      if (frameworkName) handleAddFramework(frameworkName);
                    }}
                    className="ml-auto p-1 hover:bg-cyan-500/20 rounded"
                    title="Add framework"
                  >
                    <Plus size={18} className="text-cyan-400" />
                  </button>
                )}
              </div>
              <div id="frameworks-list" className="hidden flex flex-wrap gap-2">
                {frameworksData.map((framework, index) => (
                  <div key={framework} className="group relative">
                    <span className="px-3 py-2 rounded-lg bg-cyan-500/10 text-cyan-300 text-sm border border-cyan-500/30 hover:border-cyan-500 transition-colors block">
                      {framework}
                    </span>
                    {role === "admin" && (
                      <button
                        onClick={() => handleDeleteFramework(index)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete"
                      >
                        <Trash2 size={12} className="text-white" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>

      {/* Education Section */}
      <SectionWrapper id="education" className="bg-slate-800/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3">
              <h2 className="text-4xl lg:text-5xl font-bold">
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Education</span>
              </h2>
              {role === "admin" && (
                <button
                  onClick={() => {
                    setEditingEducation(null);
                    setNewEducationForm({ qualification: "", college: "", university: "", year_from: "", year_to: "", percentage: "", location: "" });
                    setShowEducationDialog(true);
                  }}
                  className="p-2 hover:bg-emerald-500/20 rounded-lg transition-colors"
                  title="Add education"
                >
                  <Plus size={20} className="text-emerald-400" />
                </button>
              )}
            </div>
            <p className="text-slate-400 text-lg">My academic journey</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="grid gap-6">
              {educationData.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="bg-slate-700/40 backdrop-blur-sm border border-slate-600 rounded-xl p-6 hover:border-emerald-500/50 transition-all group cursor-pointer"
                  onClick={() => {
                    const el = document.getElementById(`edu-details-${edu.id}`);
                    if (el) el.classList.toggle('hidden');
                  }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{edu.qualification}</h3>
                      <p className="text-emerald-400">{edu.university}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-2 text-sm text-slate-400">
                        <Calendar size={14} className="text-emerald-400" /> {edu.year_from} - {edu.year_to}
                      </span>
                      {role === "admin" && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingEducation(edu);
                              setNewEducationForm({
                                qualification: edu.qualification,
                                college: edu.college,
                                university: edu.university,
                                year_from: edu.year_from.toString(),
                                year_to: edu.year_to.toString(),
                                percentage: edu.percentage,
                                location: edu.location
                              });
                              setShowEducationDialog(true);
                            }}
                            className="p-1 hover:bg-blue-500/20 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} className="text-blue-400" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteConfirm({ type: "education", id: edu.id.toString() });
                            }}
                            className="p-1 hover:bg-red-500/20 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} className="text-red-400" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div id={`edu-details-${edu.id}`} className="hidden mt-4 pt-4 border-t border-slate-600">
                    <p className="text-slate-300 mb-3 font-semibold">{edu.college}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-mono border border-emerald-500/30">
                        {edu.percentage}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin size={14} className="text-emerald-400" /> {edu.location}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Education Dialog */}
      <Dialog open={showEducationDialog} onOpenChange={setShowEducationDialog}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle>{editingEducation !== null ? "Edit Education" : "Add Education"}</DialogTitle>
            <DialogDescription>Update your education information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Qualification (e.g. BE, B.Tech)"
              value={newEducationForm.qualification}
              onChange={(e) => setNewEducationForm({ ...newEducationForm, qualification: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
            />
            <input
              type="text"
              placeholder="University"
              value={newEducationForm.university}
              onChange={(e) => setNewEducationForm({ ...newEducationForm, university: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
            />
            <input
              type="text"
              placeholder="College"
              value={newEducationForm.college}
              onChange={(e) => setNewEducationForm({ ...newEducationForm, college: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
            />
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Year From"
                value={newEducationForm.year_from}
                onChange={(e) => setNewEducationForm({ ...newEducationForm, year_from: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
              />
              <input
                type="number"
                placeholder="Year To"
                value={newEducationForm.year_to}
                onChange={(e) => setNewEducationForm({ ...newEducationForm, year_to: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
              />
            </div>
            <input
              type="text"
              placeholder="Percentage / CGPA"
              value={newEducationForm.percentage}
              onChange={(e) => setNewEducationForm({ ...newEducationForm, percentage: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
            />
            <input
              type="text"
              placeholder="Location"
              value={newEducationForm.location}
              onChange={(e) => setNewEducationForm({ ...newEducationForm, location: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
            />
            <button
              onClick={handleSaveEducation}
              className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
            >
              {editingEducation !== null ? "Update" : "Add"}
            </button>
          </div>
        </DialogContent>
      </Dialog>


      {/* Hero/Profile Dialog */}
      <Dialog open={showHeroDialog} onOpenChange={setShowHeroDialog}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle>Edit Profile & Details</DialogTitle>
            <DialogDescription>Update your profile information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-300">First Name</label>
              <input
                type="text"
                placeholder="First Name"
                value={newHeroForm.firstName}
                onChange={(e) => setNewHeroForm({ ...newHeroForm, firstName: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300">Last Name</label>
              <input
                type="text"
                placeholder="Last Name"
                value={newHeroForm.lastName}
                onChange={(e) => setNewHeroForm({ ...newHeroForm, lastName: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300">Profile Initials (e.g., AM)</label>
              <input
                type="text"
                placeholder="Initials"
                value={newHeroForm.profileInitials}
                onChange={(e) => setNewHeroForm({ ...newHeroForm, profileInitials: e.target.value.toUpperCase().slice(0, 2) })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                maxLength={2}
              />
            </div>
            <div>
              <label className="text-sm text-slate-300">Title</label>
              <input
                type="text"
                placeholder="e.g., Full Stack Developer"
                value={newHeroForm.title}
                onChange={(e) => setNewHeroForm({ ...newHeroForm, title: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300">Description</label>
              <textarea
                placeholder="Your bio..."
                value={newHeroForm.description}
                onChange={(e) => setNewHeroForm({ ...newHeroForm, description: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 h-24"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300">Status</label>
              <input
                type="text"
                placeholder="e.g., Open to work 🚀"
                value={newHeroForm.status}
                onChange={(e) => setNewHeroForm({ ...newHeroForm, status: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
              />
            </div>
            <button
              onClick={handleSaveHero}
              className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
            >
              Save Changes
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Resume Dialog */}
      <Dialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Resumes</DialogTitle>
            <DialogDescription>Add or manage your resume files and links</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Add New Resume */}
            <div className="border-b border-slate-600 pb-4">
              <h3 className="text-sm font-semibold text-white mb-3">Add New Resume</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-slate-300">Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Main Resume"
                    value={newResumeForm.title}
                    onChange={(e) => setNewResumeForm({ ...newResumeForm, title: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300">Type</label>
                  <select
                    value={newResumeForm.type}
                    onChange={(e) => setNewResumeForm({ ...newResumeForm, type: e.target.value as "pdf" | "word" | "link" })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="link">Link (Google Drive, etc.)</option>
                    <option value="pdf">PDF File</option>
                    <option value="word">Word Document</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-slate-300">URL</label>
                  <input
                    type="text"
                    placeholder="https://drive.google.com/... or https://example.com/resume.pdf"
                    value={newResumeForm.file_url}
                    onChange={(e) => setNewResumeForm({ ...newResumeForm, file_url: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                  />
                  <p className="text-xs text-slate-400 mt-1">Direct URL to your resume file or Google Drive link</p>
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={newResumeForm.is_primary}
                    onChange={(e) => setNewResumeForm({ ...newResumeForm, is_primary: e.target.checked })}
                    className="w-4 h-4"
                  />
                  Set as primary (default for download)
                </label>

                <button
                  onClick={handleSaveResume}
                  disabled={resumeLoading}
                  className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
                >
                  {resumeLoading ? "Adding..." : "Add Resume"}
                </button>
              </div>
            </div>

            {/* Existing Resumes */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Your Resumes</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {resumes.length === 0 ? (
                  <p className="text-sm text-slate-400">No resumes added yet</p>
                ) : (
                  resumes.map((resume) => (
                    <div key={resume.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{resume.title}</p>
                        <p className="text-xs text-slate-400">
                          {resume.type.toUpperCase()} {resume.is_primary && "• Primary"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openResume(resume)}
                          className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                          title="Open resume"
                        >
                          <Eye size={14} />
                        </button>
                        {role === "admin" && (
                          <button
                            onClick={() => handleDeleteResume(resume.id)}
                            className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Image Dialog */}
      <Dialog open={showProfileImageDialog} onOpenChange={setShowProfileImageDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Profile Image</DialogTitle>
            <DialogDescription>Upload or manage your profile photo</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Add New Profile Image */}
            <div className="border-b border-slate-600 pb-4">
              <h3 className="text-sm font-semibold text-white mb-3">Add Profile Image</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-slate-300">Image Source</label>
                  <div className="flex gap-2">
                    <input
                      ref={profileImageInputRef}
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleProfileImageFileUpload(file);
                      }}
                      className="hidden"
                    />
                    <button
                      onClick={() => profileImageInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Upload size={16} />
                      {uploadingImage ? "Uploading..." : "Upload Image"}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">JPEG or PNG (max 5MB)</p>
                </div>

                {newProfileImageForm.image_url && (
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Image Preview</label>
                    <div className="w-full h-40 rounded-lg overflow-hidden border border-slate-600">
                      <img 
                        src={newProfileImageForm.image_url} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSaveProfileImage}
                  disabled={!newProfileImageForm.image_url}
                  className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Add Profile Image
                </button>
              </div>
            </div>

            {/* Existing Profile Images */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Your Images</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {profileImages.length === 0 ? (
                  <p className="text-sm text-slate-400">No profile images uploaded yet</p>
                ) : (
                  profileImages.map((img) => (
                    <div key={img.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{img.file_name || "Profile Image"}</p>
                        <p className="text-xs text-slate-400">
                          {img.image_type.toUpperCase()} {img.is_primary && "• Primary"}
                        </p>
                      </div>
                      {role === "admin" && (
                        <button
                          onClick={() => handleDeleteProfileImage(img.id)}
                          className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Technical Skills Dialog */}
      <Dialog open={showTechnicalSkillsDialog} onOpenChange={setShowTechnicalSkillsDialog}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle>Add Technical Skill</DialogTitle>
            <DialogDescription>Add a new technical skill to your profile</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-300">Skill Name</label>
              <input
                type="text"
                placeholder="e.g., React, Python, AWS"
                value={newTechnicalSkillForm.name}
                onChange={(e) => setNewTechnicalSkillForm({ ...newTechnicalSkillForm, name: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Proficiency Level (1-10)</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newTechnicalSkillForm.level}
                  onChange={(e) => setNewTechnicalSkillForm({ ...newTechnicalSkillForm, level: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-white font-semibold w-8 text-center">{newTechnicalSkillForm.level}</span>
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-300">Category</label>
              <select
                value={newTechnicalSkillForm.category}
                onChange={(e) => setNewTechnicalSkillForm({ ...newTechnicalSkillForm, category: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              >
                <option>Programming Languages</option>
                <option>Web Development</option>
                <option>Databases</option>
                <option>Cloud Services</option>
                <option>Tools & Frameworks</option>
                <option>VLSI</option>
                <option>Electrical and Electronics</option>
              </select>
            </div>

            <button
              onClick={handleSaveTechnicalSkill}
              disabled={techSkillsLoading}
              className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
            >
              {techSkillsLoading ? "Adding..." : "Add Skill"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Other Skills Dialog */}
      <Dialog open={showOtherSkillsDialog} onOpenChange={setShowOtherSkillsDialog}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle>Add Soft Skill</DialogTitle>
            <DialogDescription>Add a new soft skill to your profile</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-300">Skill Name</label>
              <input
                type="text"
                placeholder="e.g., Leadership, Communication"
                value={newOtherSkillForm.name}
                onChange={(e) => setNewOtherSkillForm({ ...newOtherSkillForm, name: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Proficiency Level (1-10)</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newOtherSkillForm.level}
                  onChange={(e) => setNewOtherSkillForm({ ...newOtherSkillForm, level: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-white font-semibold w-8 text-center">{newOtherSkillForm.level}</span>
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-300">Category</label>
              <select
                value={newOtherSkillForm.category}
                onChange={(e) => setNewOtherSkillForm({ ...newOtherSkillForm, category: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              >
                <option>Soft Skills</option>
                <option>Management</option>
                <option>Communication</option>
                <option>Problem Solving</option>
              </select>
            </div>

            <button
              onClick={handleSaveOtherSkill}
              disabled={otherSkillsLoading}
              className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
            >
              {otherSkillsLoading ? "Adding..." : "Add Skill"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle>Delete Confirmation</DialogTitle>
            <DialogDescription>Are you sure you want to delete this item?</DialogDescription>
          </DialogHeader>
          <div className="flex gap-4">
            <button
              onClick={() => {
                if (showDeleteConfirm?.type === "education" && showDeleteConfirm.id) {
                  handleDeleteEducation(parseInt(showDeleteConfirm.id));
                }
              }}
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
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Home;
