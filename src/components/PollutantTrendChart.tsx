import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface PollutantTrendChartProps {
  forecast: { hour: string; aqi: number }[];
  pollutants: { name: string; value: number }[];
}

const PollutantTrendChart = ({ forecast, pollutants }: PollutantTrendChartProps) => {
  const pm25Val = pollutants.find((p) => p.name === "PM2.5")?.value ?? 0;
  const pm10Val = pollutants.find((p) => p.name === "PM10")?.value ?? 0;

  // Simulate trend from current values across forecast periods
  const chartData = forecast.length > 0
    ? forecast.map((f, i) => {
        const factor = 0.8 + Math.random() * 0.4;
        const factor2 = 0.8 + Math.random() * 0.4;
        return {
          label: f.hour,
          "PM2.5": Math.round(pm25Val * factor * 10) / 10,
          "PM10": Math.round(pm10Val * factor2 * 10) / 10,
        };
      })
    : [
        { label: "Now", "PM2.5": pm25Val, "PM10": pm10Val },
      ];

  return (
    <div className="bg-card rounded-xl shadow-card border border-border/50 p-5">
      <h2 className="text-sm font-semibold text-foreground mb-4">Pollutant Trends — PM2.5 & PM10</h2>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
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
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "var(--shadow-elevated)",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px" }}
              iconType="circle"
              iconSize={8}
            />
            <Line
              type="monotone"
              dataKey="PM2.5"
              stroke="hsl(var(--aqi-unhealthy))"
              strokeWidth={2}
              dot={{ r: 2.5, strokeWidth: 0, fill: "hsl(var(--aqi-unhealthy))" }}
            />
            <Line
              type="monotone"
              dataKey="PM10"
              stroke="hsl(var(--aqi-unhealthy-sensitive))"
              strokeWidth={2}
              dot={{ r: 2.5, strokeWidth: 0, fill: "hsl(var(--aqi-unhealthy-sensitive))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PollutantTrendChart;
