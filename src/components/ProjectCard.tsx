import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  id: string;
  title: string;
  synopsis: string;
  techStack: string[];
  image?: string;
  github?: string;
  live?: string;
  index: number;
}

const ProjectCard = ({ id, title, synopsis, techStack, image, github, live, index }: ProjectCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group glass-card rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-300"
    >
      {/* Project Image */}
      <div className="relative h-48 bg-secondary/30 overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl font-bold gradient-text">
            {title.charAt(0)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        
        {/* Hover overlay with links */}
        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-secondary text-foreground hover:text-primary hover:scale-110 transition-all"
            >
              <Github size={20} />
            </a>
          )}
          {live && (
            <a
              href={live}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-secondary text-foreground hover:text-primary hover:scale-110 transition-all"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>

      {/* Project Info */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {synopsis}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium"
            >
              {tech}
            </span>
          ))}
          {techStack.length > 4 && (
            <span className="px-2 py-1 text-xs rounded-full bg-secondary text-muted-foreground">
              +{techStack.length - 4} more
            </span>
          )}
        </div>

        {/* View Details Link */}
        <Link
          to={`/projects/${id}`}
          className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:gap-3 transition-all"
        >
          View Details <ArrowRight size={16} />
        </Link>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
