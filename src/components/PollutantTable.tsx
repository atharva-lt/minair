import { getAqiLevel, AQI_LEVELS, type AqiLevel } from "@/lib/aqi-data";

interface Pollutant {
  name: string;
  fullName: string;
  value: number;
  unit: string;
  level: AqiLevel;
}

interface PollutantTableProps {
  pollutants: Pollutant[];
}

const levelBadge: Record<AqiLevel, { bg: string; text: string; label: string }> = {
  good: { bg: "bg-aqi-good/15", text: "text-aqi-good", label: "Good" },
  moderate: { bg: "bg-aqi-moderate/15", text: "text-aqi-moderate", label: "Moderate" },
  "unhealthy-sensitive": { bg: "bg-aqi-unhealthy-sensitive/15", text: "text-aqi-unhealthy-sensitive", label: "USG" },
  unhealthy: { bg: "bg-aqi-unhealthy/15", text: "text-aqi-unhealthy", label: "Unhealthy" },
  "very-unhealthy": { bg: "bg-aqi-very-unhealthy/15", text: "text-aqi-very-unhealthy", label: "Very Unhealthy" },
  hazardous: { bg: "bg-aqi-hazardous/15", text: "text-aqi-hazardous", label: "Hazardous" },
};

const PollutantTable = ({ pollutants }: PollutantTableProps) => {
  return (
    <div className="bg-card rounded-xl shadow-card border border-border/50 p-5">
      <h2 className="text-sm font-semibold text-foreground mb-4">Pollutant Details</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pollutant</th>
              <th className="text-right py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Value</th>
              <th className="text-right py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Unit</th>
              <th className="text-right py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {pollutants.map((p, i) => {
              const badge = levelBadge[p.level] || levelBadge.good;
              return (
                <tr key={p.name} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-3">
                    <div>
                      <span className="font-semibold text-foreground">{p.name}</span>
                      <span className="block text-[11px] text-muted-foreground">{p.fullName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="font-mono font-bold text-foreground">{p.value}</span>
                  </td>
                  <td className="py-3 px-3 text-right text-xs text-muted-foreground">{p.unit}</td>
                  <td className="py-3 px-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PollutantTable;
