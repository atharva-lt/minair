import { getAqiLevel, AQI_LEVELS } from "@/lib/aqi-data";

interface AqiBreakdownCardProps {
  aqi: number;
}

const AqiBreakdownCard = ({ aqi }: AqiBreakdownCardProps) => {
  const level = getAqiLevel(aqi);

  return (
    <div className="bg-card rounded-xl shadow-card border border-border/50 p-5">
      <h2 className="text-sm font-semibold text-foreground mb-4">AQI Breakdown</h2>

      {/* Current AQI circle */}
      <div className="flex items-center gap-4 mb-5">
        <div className={`w-20 h-20 rounded-full ${level.color} flex flex-col items-center justify-center shadow-md`}>
          <span className="text-2xl font-bold font-mono text-primary-foreground">{aqi}</span>
          <span className="text-[9px] font-medium text-primary-foreground/80 uppercase tracking-wider">US AQI</span>
        </div>
        <div>
          <p className={`text-base font-bold ${level.textClass}`}>{level.label}</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{level.description}</p>
        </div>
      </div>

      {/* Scale bar */}
      <div className="space-y-2">
        <div className="flex rounded-md overflow-hidden h-2.5">
          {AQI_LEVELS.map((l) => (
            <div key={l.level} className={`flex-1 ${l.color} relative`}>
              {l.level === level.level && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-card bg-foreground" />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
          <span>0</span>
          <span>50</span>
          <span>100</span>
          <span>150</span>
          <span>200</span>
          <span>300</span>
          <span>500</span>
        </div>
      </div>
    </div>
  );
};

export default AqiBreakdownCard;
