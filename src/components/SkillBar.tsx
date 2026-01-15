import { motion } from "framer-motion";

interface SkillBarProps {
  name: string;
  level: number;
  delay?: number;
}

const SkillBar = ({ name, level, delay = 0 }: SkillBarProps) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <span className="text-foreground font-medium">{name}</span>
        <span className="text-primary font-mono text-sm">{level}/10</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level * 10}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
          className="h-full skill-bar rounded-full"
        />
      </div>
    </div>
  );
};

export default SkillBar;
