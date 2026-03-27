const legendItems = [
  { range: "0–50", color: "#22c55e", label: "Good" },
  { range: "51–100", color: "#eab308", label: "Moderate" },
  { range: "101–150", color: "#f97316", label: "Unhealthy (Sensitive)" },
  { range: "151+", color: "#ef4444", label: "Unhealthy" },
];

export function AqiMapLegend() {
  return (
    <div className="absolute bottom-6 right-6 z-[1000] rounded-xl border border-border bg-card/95 backdrop-blur-sm p-4 shadow-lg">
      <h4 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">AQI Legend</h4>
      <div className="space-y-1.5">
        {legendItems.map((item) => (
          <div key={item.range} className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-muted-foreground font-medium">{item.range}</span>
            <span className="text-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
