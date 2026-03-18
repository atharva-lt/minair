import { type PollutantData, AQI_LEVELS } from "@/lib/aqi-data";

interface PollutantCardProps {
  pollutant: PollutantData;
  index: number;
}

const levelStyles: Record<string, { bg: string; text: string; dot: string }> = {
  good: { bg: "bg-aqi-good/10", text: "text-aqi-good", dot: "bg-aqi-good" },
  moderate: { bg: "bg-aqi-moderate/10", text: "text-aqi-moderate", dot: "bg-aqi-moderate" },
  "unhealthy-sensitive": { bg: "bg-aqi-unhealthy-sensitive/10", text: "text-aqi-unhealthy-sensitive", dot: "bg-aqi-unhealthy-sensitive" },
  unhealthy: { bg: "bg-aqi-unhealthy/10", text: "text-aqi-unhealthy", dot: "bg-aqi-unhealthy" },
  "very-unhealthy": { bg: "bg-aqi-very-unhealthy/10", text: "text-aqi-very-unhealthy", dot: "bg-aqi-very-unhealthy" },
  hazardous: { bg: "bg-aqi-hazardous/10", text: "text-aqi-hazardous", dot: "bg-aqi-hazardous" },
};

const PollutantCard = ({ pollutant, index }: PollutantCardProps) => {
  const style = levelStyles[pollutant.level] || levelStyles.good;
  const levelInfo = AQI_LEVELS.find((l) => l.level === pollutant.level);

  return (
    <div
      className="bg-card rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 p-4 border border-border/50 animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{pollutant.name}</h3>
          <p className="text-xs text-muted-foreground">{pollutant.fullName}</p>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${style.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
          <span className={`text-xs font-medium ${style.text}`}>{levelInfo?.label}</span>
        </div>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={`text-2xl font-bold font-mono ${style.text}`}>{pollutant.value}</span>
        <span className="text-xs text-muted-foreground">{pollutant.unit}</span>
      </div>
    </div>
  );
};

export default PollutantCard;
