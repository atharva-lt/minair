import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { getAqiLevel } from "@/lib/aqi-data";

interface AqiTrendChartProps {
  forecast: { hour: string; aqi: number }[];
}

const AqiTrendChart = ({ forecast }: AqiTrendChartProps) => {
  const [range, setRange] = useState<"24h" | "7d">("24h");

  // Use available forecast data, label accordingly
  const chartData = forecast.map((f, i) => ({
    label: f.hour,
    aqi: f.aqi,
  }));

  if (chartData.length === 0) {
    return (
      <div className="bg-card rounded-xl shadow-card border border-border/50 p-5">
        <h2 className="text-sm font-semibold text-foreground">AQI Trend</h2>
        <p className="text-xs text-muted-foreground mt-4">No trend data available.</p>
      </div>
    );
  }

  const maxAqi = Math.max(...chartData.map((d) => d.aqi));
  const avgAqi = Math.round(chartData.reduce((s, d) => s + d.aqi, 0) / chartData.length);
  const avgLevel = getAqiLevel(avgAqi);

  return (
    <div className="bg-card rounded-xl shadow-card border border-border/50 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">AQI Trend</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Avg: <span className={`font-mono font-semibold ${avgLevel.textClass}`}>{avgAqi}</span>
          </p>
        </div>
        <div className="flex gap-1 bg-secondary rounded-md p-0.5">
          {(["24h", "7d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                range === r
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              domain={[0, Math.ceil(maxAqi * 1.2)]}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "var(--shadow-elevated)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="aqi"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#aqiGradient)"
              dot={{ r: 3, fill: "hsl(var(--primary))", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "hsl(var(--card))" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AqiTrendChart;
