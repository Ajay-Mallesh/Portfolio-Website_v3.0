import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";

interface Certificate {
  id: string;
  title: string;
  provider: string;
  date: string;
  skills: string[];
}

interface MovingCardsProps {
  certificates: Certificate[];
}

const MovingCards = ({ certificates }: MovingCardsProps) => {
  // Duplicate cards for seamless loop
  const duplicatedCards = [...certificates, ...certificates];

  return (
    <div className="relative overflow-hidden py-8">
      {/* Gradient overlays for smooth fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
      
      <motion.div
        className="flex gap-6"
        animate={{ x: [0, "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
        whileHover={{ animationPlayState: "paused" }}
      >
        {duplicatedCards.map((cert, index) => (
          <div
            key={`${cert.id}-${index}`}
            className="flex-shrink-0 w-80 glass-card rounded-xl p-6 hover:scale-105 transition-transform duration-300 cursor-pointer group"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <Award size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {cert.title}
                </h3>
                <p className="text-sm text-muted-foreground">{cert.provider}</p>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mb-4">{cert.date}</p>
            
            <div className="flex flex-wrap gap-2">
              {cert.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <span>View Certificate</span>
              <ExternalLink size={14} />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default MovingCards;
