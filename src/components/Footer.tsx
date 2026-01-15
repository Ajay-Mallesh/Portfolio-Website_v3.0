import { Github, Linkedin, Instagram, Mail, Heart } from "lucide-react";

const socialLinks = [
  { icon: Github, href: "https://github.com/ajaymallesh", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/ajaymallesh", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com/ajaymallesh", label: "Instagram" },
  { icon: Mail, href: "mailto:ajaynew96326@gmail.com", label: "Email" },
];

const Footer = () => {
  return (
    <footer className="border-t border-slate-700 bg-slate-900">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Branding */}
          <div className="text-center md:text-left">
            <p className="text-2xl font-bold mb-2">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Ajay</span>
              <span className="text-white">Mallesh</span>
            </p>
            <p className="text-slate-400 text-sm">
              Full Stack Developer | Portfolio Website
            </p>
          </div>

          {/* Contact Info */}
          <div className="text-center">
            <p className="text-slate-300 text-sm mb-2">
              <span className="block mb-1">📧 <a href="mailto:ajaynew96326@gmail.com" className="text-emerald-400 hover:text-emerald-300 transition">ajaynew96326@gmail.com</a></span>
              <span className="text-slate-500">📍 Malavalli, Karnataka</span>
            </p>
          </div>

          {/* Social Links */}
          <div className="text-center md:text-right">
            <p className="text-slate-400 text-sm mb-3">Follow Me</p>
            <div className="flex items-center justify-center md:justify-end gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-emerald-400 hover:bg-slate-700 transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-700 text-center">
          <p className="text-slate-400 text-sm flex items-center justify-center gap-2 mb-3">
            Designed & Developed with <Heart size={16} className="text-red-500 fill-red-500" /> by Ajay Mallesh © {new Date().getFullYear()}
          </p>
          <p className="text-emerald-400 text-sm font-medium mb-2">
            ವಿನ್ಯಾಸ : ಅಜಯ್ ಮಲ್ಲೇಶ್ ©️ | ಎರಡನೇ ಆವೃತ್ತಿ | ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ ❤️💛
          </p>
          <p className="text-slate-400 text-sm">
            <strong>India | ಭಾರತ ❤️</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
