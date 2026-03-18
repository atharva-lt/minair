import { AQI_LEVELS } from "@/lib/aqi-data";

const AqiScaleLegend = () => {
  return (
    <div className="bg-card rounded-xl shadow-card border border-border/50 p-5">
      <h2 className="text-base font-semibold text-foreground mb-4">AQI Scale</h2>
      <div className="flex rounded-lg overflow-hidden h-3 mb-3">
        {AQI_LEVELS.map((level) => (
          <div key={level.level} className={`flex-1 ${level.color}`} />
        ))}
      </div>
      <div className="space-y-2">
        {AQI_LEVELS.map((level) => (
          <div key={level.level} className="flex items-center gap-3 text-sm">
            <div className={`w-3 h-3 rounded-sm flex-shrink-0 ${level.color}`} />
            <span className="font-medium text-foreground min-w-[60px] font-mono text-xs">{level.range}</span>
            <span className="text-muted-foreground text-xs">{level.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AqiScaleLegend;
