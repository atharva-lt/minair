import { Heart, PersonStanding, Baby, TreePine } from "lucide-react";

const recommendations = [
  { icon: PersonStanding, title: "General Public", advice: "Reduce prolonged outdoor exertion. Take more breaks during outdoor activities.", color: "text-aqi-unhealthy" },
  { icon: Heart, title: "Heart & Lung Disease", advice: "Avoid prolonged outdoor exertion. Keep rescue medications available.", color: "text-aqi-very-unhealthy" },
  { icon: Baby, title: "Children & Elderly", advice: "Limit outdoor activities. Keep windows closed and use air purifiers indoors.", color: "text-aqi-unhealthy-sensitive" },
  { icon: TreePine, title: "Outdoor Workers", advice: "Wear N95 masks. Take frequent breaks in clean air environments.", color: "text-aqi-moderate" },
];

const HealthRecommendations = () => {
  return (
    <div className="bg-card rounded-xl shadow-card border border-border/50 p-5">
      <h2 className="text-base font-semibold text-foreground mb-4">Health Recommendations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {recommendations.map((rec, i) => (
          <div key={i} className="p-3 rounded-lg bg-secondary/50 border border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <rec.icon className={`w-4 h-4 ${rec.color}`} />
              <span className="text-sm font-semibold text-foreground">{rec.title}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{rec.advice}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthRecommendations;
