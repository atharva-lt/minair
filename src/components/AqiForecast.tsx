import { getAqiLevel, MOCK_CITY } from "@/lib/aqi-data";

const AqiForecast = () => {
  const forecast = MOCK_CITY.forecast;
  const maxAqi = Math.max(...forecast.map((f) => f.aqi));

  return (
    <div className="bg-card rounded-xl shadow-card border border-border/50 p-5">
      <h2 className="text-base font-semibold text-foreground mb-4">24-Hour Forecast</h2>
      <div className="flex items-end gap-2 h-32">
        {forecast.map((item, i) => {
          const level = getAqiLevel(item.aqi);
          const height = (item.aqi / maxAqi) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-xs font-mono font-medium text-muted-foreground">{item.aqi}</span>
              <div
                className={`w-full rounded-t-md ${level.color} transition-all duration-500`}
                style={{ height: `${height}%`, minHeight: "8px" }}
              />
              <span className="text-[10px] text-muted-foreground">{item.hour}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AqiForecast;
