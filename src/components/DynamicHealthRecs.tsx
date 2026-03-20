import { Heart, PersonStanding, Baby, TreePine, ShieldCheck, AlertTriangle } from "lucide-react";
import { getAqiLevel, type AqiLevel } from "@/lib/aqi-data";

interface DynamicHealthRecsProps {
  aqi: number;
}

const recsByLevel: Record<AqiLevel, { icon: typeof Heart; title: string; advice: string }[]> = {
  good: [
    { icon: ShieldCheck, title: "Everyone", advice: "Air quality is ideal. Enjoy outdoor activities freely." },
    { icon: PersonStanding, title: "Exercise", advice: "Great conditions for outdoor sports and exercise." },
  ],
  moderate: [
    { icon: PersonStanding, title: "General Public", advice: "Air quality is acceptable. Unusually sensitive people should limit prolonged outdoor exertion." },
    { icon: Heart, title: "Sensitive Groups", advice: "Consider reducing intense outdoor activities if you experience symptoms." },
  ],
  "unhealthy-sensitive": [
    { icon: Heart, title: "Heart & Lung Disease", advice: "Reduce prolonged outdoor exertion. Keep rescue medications available." },
    { icon: Baby, title: "Children & Elderly", advice: "Limit outdoor play and activities. Stay indoors when possible." },
    { icon: PersonStanding, title: "General Public", advice: "Consider reducing prolonged outdoor exertion." },
  ],
  unhealthy: [
    { icon: AlertTriangle, title: "Everyone", advice: "Reduce prolonged outdoor exertion. Take more breaks during outdoor activities." },
    { icon: Heart, title: "Heart & Lung Disease", advice: "Avoid all outdoor exertion. Keep windows closed." },
    { icon: Baby, title: "Children & Elderly", advice: "Stay indoors. Use air purifiers if available." },
    { icon: TreePine, title: "Outdoor Workers", advice: "Wear N95 masks. Take frequent breaks in clean air." },
  ],
  "very-unhealthy": [
    { icon: AlertTriangle, title: "Health Alert", advice: "Everyone may experience serious health effects. Avoid outdoor activities." },
    { icon: Heart, title: "Sensitive Groups", advice: "Remain indoors. Keep air purifiers running continuously." },
    { icon: TreePine, title: "Outdoor Workers", advice: "Minimize outdoor work. Mandatory mask usage required." },
  ],
  hazardous: [
    { icon: AlertTriangle, title: "Emergency", advice: "Health warning: everyone should avoid all outdoor activities." },
    { icon: Heart, title: "All Groups", advice: "Stay indoors with windows sealed. Use air purifiers on maximum." },
  ],
};

const DynamicHealthRecs = ({ aqi }: DynamicHealthRecsProps) => {
  const level = getAqiLevel(aqi);
  const recs = recsByLevel[level.level] || recsByLevel.good;

  return (
    <div className="bg-card rounded-xl shadow-card border border-border/50 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground">Health Recommendations</h2>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${level.bgClass} ${level.textClass}`}>
          {level.label}
        </span>
      </div>
      <div className="space-y-2.5">
        {recs.map((rec, i) => (
          <div key={i} className="flex gap-3 p-3 rounded-lg bg-secondary/40 border border-border/30">
            <rec.icon className={`w-4 h-4 shrink-0 mt-0.5 ${level.textClass}`} />
            <div>
              <p className="text-xs font-semibold text-foreground">{rec.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{rec.advice}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicHealthRecs;
