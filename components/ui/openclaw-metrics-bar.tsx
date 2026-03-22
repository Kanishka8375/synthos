interface Metric {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
}

interface SynthosMetricsBarProps {
  metrics: Metric[];
}

export function SynthosMetricsBar({ metrics }: SynthosMetricsBarProps) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {metrics.map((m, i) => (
        <span key={i} className="flex items-center gap-1 bg-white/5 rounded-lg px-2.5 py-1 text-xs">
          <span className="text-gray-500">{m.label}</span>
          <span className={`font-semibold ${m.color ?? "text-indigo-300"}`}>
            {m.value}{m.unit ?? ""}
          </span>
        </span>
      ))}
    </div>
  );
}

/** @deprecated use SynthosMetricsBar */
export const OpenClawMetricsBar = SynthosMetricsBar;
