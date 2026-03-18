import { MapPin } from "lucide-react";
import { getAqiLevel, MOCK_CITY } from "@/lib/aqi-data";

const NearbyStations = () => {
  return (
    <div className="bg-card rounded-xl shadow-card border border-border/50 p-5">
      <h2 className="text-base font-semibold text-foreground mb-4">Nearby Stations</h2>
      <div className="space-y-2.5">
        {MOCK_CITY.nearby.map((station, i) => {
          const level = getAqiLevel(station.aqi);
          return (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{station.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold font-mono ${level.textClass}`}>{station.aqi}</span>
                <div className={`w-2.5 h-2.5 rounded-full ${level.color}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NearbyStations;
