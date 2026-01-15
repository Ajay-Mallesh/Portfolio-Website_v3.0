import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TimelineItemProps {
  title: string;
  subtitle: string;
  date: string;
  description?: string;
  icon?: ReactNode;
  index: number;
}

const TimelineItem = ({ title, subtitle, date, description, icon, index }: TimelineItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-8 pb-12 last:pb-0"
    >
      {/* Timeline line */}
      <div className="absolute left-0 top-0 bottom-0 w-px timeline-line" />
      
      {/* Timeline dot */}
      <div className="absolute left-0 top-0 w-3 h-3 -translate-x-[5px] rounded-full bg-primary glow-effect" />
      
      <div className="glass-card rounded-xl p-6 ml-4 hover:scale-[1.02] transition-transform duration-300">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {icon}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg text-foreground">{title}</h3>
              <p className="text-primary text-sm">{subtitle}</p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground font-mono whitespace-nowrap bg-secondary/50 px-3 py-1 rounded-full">
            {date}
          </span>
        </div>
        {description && (
          <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default TimelineItem;
