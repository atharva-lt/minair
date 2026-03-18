import { Wind, Droplets, Thermometer, Clock } from "lucide-react";
import { getAqiLevel, MOCK_CITY } from "@/lib/aqi-data";
import heroCity from "@/assets/hero-city.jpg";

const MainAqiCard = () => {
  const data = MOCK_CITY;
  const level = getAqiLevel(data.aqi);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-elevated">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroCity} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/40" />
      </div>

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          {/* Left - Location & AQI */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-3.5 h-3.5 text-primary-foreground/60" />
                <span className="text-xs text-primary-foreground/60">Updated {data.lastUpdated}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground">{data.name}</h1>
              <p className="text-primary-foreground/70 text-sm">{data.country}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-primary-foreground/70 text-sm">
                <Thermometer className="w-4 h-4" />
                <span>{data.temperature}°C</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/70 text-sm">
                <Droplets className="w-4 h-4" />
                <span>{data.humidity}%</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/70 text-sm">
                <Wind className="w-4 h-4" />
                <span>{data.wind} km/h</span>
              </div>
            </div>
          </div>

          {/* Right - AQI Number */}
          <div className="flex flex-col items-center">
            <div className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full ${level.color} flex flex-col items-center justify-center shadow-lg`}>
              <span className="text-4xl sm:text-5xl font-bold text-primary-foreground font-mono">{data.aqi}</span>
              <span className="text-xs font-medium text-primary-foreground/90 uppercase tracking-wider">US AQI</span>
            </div>
            <div className={`mt-3 px-4 py-1.5 rounded-full ${level.color}`}>
              <span className="text-sm font-semibold text-primary-foreground">{level.label}</span>
            </div>
          </div>
        </div>

        {/* Health message */}
        <div className="mt-6 p-3 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/10">
          <p className="text-sm text-primary-foreground/90">
            <span className="font-semibold">Health Advisory:</span> {level.description}. 
            Consider reducing prolonged outdoor exertion. Sensitive groups should limit outdoor activity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainAqiCard;
