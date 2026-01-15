import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import Index from "./pages/Index";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Internships from "./pages/Internships";
import Certifications from "./pages/Certifications";
import Education from "./pages/Education";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ProjectsAdmin from "./pages/admin/ProjectsAdmin";
import ExperienceAdmin from "./pages/admin/ExperienceAdmin";
import InternshipsAdmin from "./pages/admin/InternshipsAdmin";
import CertificationsAdmin from "./pages/admin/CertificationsAdmin";
import EducationAdmin from "./pages/admin/EducationAdmin";
import SkillsAdmin from "./pages/admin/SkillsAdmin";
import MessagesAdmin from "./pages/admin/MessagesAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/education" element={<Education />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin/projects" element={<ProjectsAdmin />} />
          <Route path="/admin/experience" element={<ExperienceAdmin />} />
          <Route path="/admin/internships" element={<InternshipsAdmin />} />
          <Route path="/admin/certifications" element={<CertificationsAdmin />} />
          <Route path="/admin/education" element={<EducationAdmin />} />
          <Route path="/admin/skills" element={<SkillsAdmin />} />
          <Route path="/admin/messages" element={<MessagesAdmin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
