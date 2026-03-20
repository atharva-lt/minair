import { Thermometer, Droplets, Wind, Eye } from "lucide-react";

interface WeatherDetailsCardProps {
  temperature: number | null;
  humidity: number | null;
  wind: number | null;
}

const WeatherDetailsCard = ({ temperature, humidity, wind }: WeatherDetailsCardProps) => {
  const items = [
    { icon: Thermometer, label: "Temperature", value: temperature != null ? `${Math.round(temperature)}°C` : "—", color: "text-aqi-unhealthy-sensitive" },
    { icon: Droplets, label: "Humidity", value: humidity != null ? `${Math.round(humidity)}%` : "—", color: "text-primary" },
    { icon: Wind, label: "Wind Speed", value: wind != null ? `${wind} km/h` : "—", color: "text-accent" },
    { icon: Eye, label: "Pressure", value: "—", color: "text-muted-foreground" },
  ];

  return (
    <div className="bg-card rounded-xl shadow-card border border-border/50 p-5">
      <h2 className="text-sm font-semibold text-foreground mb-4">Weather Details</h2>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, i) => (
          <div key={i} className="p-3 rounded-lg bg-secondary/50 border border-border/30">
            <div className="flex items-center gap-2 mb-1.5">
              <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
              <span className="text-[11px] text-muted-foreground uppercase tracking-wide">{item.label}</span>
            </div>
            <span className="text-lg font-bold font-mono text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherDetailsCard;
