import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  if (role !== "admin") {
    return <div className="p-8">Access denied. Admins only.</div>;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="flex items-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/admin/projects" className="dashboard-tile">Projects</Link>
        <Link to="/admin/experience" className="dashboard-tile">Experience</Link>
        <Link to="/admin/internships" className="dashboard-tile">Internships</Link>
        <Link to="/admin/certifications" className="dashboard-tile">Certifications</Link>
        <Link to="/admin/education" className="dashboard-tile">Education</Link>
        <Link to="/admin/skills" className="dashboard-tile">Skills</Link>
        <Link to="/admin/messages" className="dashboard-tile">Messages</Link>
      </div>
      <style>{`
        .dashboard-tile {
          padding: 2rem;
          border-radius: 0.75rem;
          text-align: center;
          background: #fafbfc;
          box-shadow: 0 1px 6px #0001;
          font-size: 1.2rem;
          font-weight: 600;
          transition: box-shadow 0.2s, background 0.2s;
        }
        .dashboard-tile:hover {
          box-shadow: 0 4px 16px #0002;
          background: #f3f4f6;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;

