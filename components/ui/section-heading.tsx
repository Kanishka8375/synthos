import { GradientText } from "./gradient-text";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  center?: boolean;
}

export function SectionHeading({ eyebrow, title, highlight, subtitle, center = true }: SectionHeadingProps) {
  return (
    <div className={center ? "text-center" : ""}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">{eyebrow}</p>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
        {title}{" "}
        {highlight && <GradientText>{highlight}</GradientText>}
      </h2>
      {subtitle && (
        <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}
