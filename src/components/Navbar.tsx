import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github, LogOut } from "lucide-react";
import { Button } from "./ui/button";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Experience", path: "/experience" },
  { name: "Projects", path: "/projects" },
  { name: "Internships", path: "/internships" },
  { name: "Certifications", path: "/certifications" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { role, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 border-b border-slate-700 backdrop-blur-md"
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold hover:opacity-80 transition">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Ajay</span>
            <span className="text-white">Mallesh</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link py-2 px-3 rounded-lg transition-all duration-200 ${
                  location.pathname === link.path 
                    ? "text-emerald-400 bg-slate-800" 
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white transition p-2"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            {role === "admin" ? (
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-red-600/10 py-2 px-4 rounded-lg transition-all duration-200"
                title="Logout"
              >
                <LogOut size={20} className="mr-2" />
                Logout
              </Button>
            ) : (
              <Link
                to="/admin-login"
                className={`nav-link py-2 px-4 rounded-lg transition-all duration-200 ml-2 ${
                  location.pathname === "/admin-login"
                    ? "text-white bg-emerald-600"
                    : "text-slate-300 hover:text-white border border-emerald-600 hover:bg-emerald-600/10"
                }`}
              >
                Admin Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 hover:bg-slate-800 rounded-lg transition"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden mt-4"
            >
              <div className="py-4 space-y-3 border-t border-slate-700">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block py-2 px-4 rounded-lg transition-colors ${
                      location.pathname === link.path
                        ? "bg-emerald-600/20 text-emerald-400"
                        : "text-slate-300 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 px-4 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
                >
                  GitHub
                </a>
                {role === "admin" ? (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left py-2 px-4 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-red-600/10 flex items-center"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/admin-login"
                    onClick={() => setIsOpen(false)}
                    className={`block py-2 px-4 rounded-lg transition-colors ${
                      location.pathname === "/admin-login"
                        ? "bg-emerald-600/20 text-emerald-400"
                        : "text-slate-300 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    Admin Login
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Navbar;
