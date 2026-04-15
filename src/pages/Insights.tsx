import { useMemo } from "react";
import { BarChart3, TrendingUp, TrendingDown, Wind, Droplets, ThermometerSun, Activity } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useIndiaAqi, type IndiaStation } from "@/hooks/use-india-aqi";
import { getAqiLevel, AQI_LEVELS } from "@/lib/aqi-data";
import { Skeleton } from "@/components/ui/skeleton";

const AQI_COLORS: Record<string, string> = {
  good: "hsl(142, 70%, 45%)",
  moderate: "hsl(45, 95%, 50%)",
  "unhealthy-sensitive": "hsl(25, 95%, 55%)",
  unhealthy: "hsl(0, 80%, 50%)",
  "very-unhealthy": "hsl(280, 60%, 45%)",
  hazardous: "hsl(345, 80%, 30%)",
};

function StatCard({ icon: Icon, label, value, sub, trend }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; trend?: "up" | "down" | "neutral";
}) {
  return (
    <div className="bg-card rounded-xl border border-border/50 shadow-card p-5 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        {trend === "up" && <TrendingUp className="h-4 w-4 text-destructive mb-1" />}
        {trend === "down" && <TrendingDown className="h-4 w-4 text-aqi-good mb-1" />}
      </div>
      {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
    </div>
  );
}

export default function Insights() {
  const { data: stations, isLoading } = useIndiaAqi();

  const stats = useMemo(() => {
    if (!stations?.length) return null;

    const aqis = stations.map((s) => s.aqi);
    const avg = Math.round(aqis.reduce((a, b) => a + b, 0) / aqis.length);
    const max = Math.max(...aqis);
    const min = Math.min(...aqis);
    const worst = stations.find((s) => s.aqi === max);
    const best = stations.find((s) => s.aqi === min);

    // Distribution by level
    const distribution = AQI_LEVELS.map((lvl) => ({
      name: lvl.label,
      level: lvl.level,
      count: stations.filter((s) => getAqiLevel(s.aqi).level === lvl.level).length,
    })).filter((d) => d.count > 0);

    // Sorted by AQI for bar chart (top 15 worst)
    const topWorst = [...stations].sort((a, b) => b.aqi - a.aqi).slice(0, 15);
    const topBest = [...stations].sort((a, b) => a.aqi - b.aqi).slice(0, 15);

    return { avg, max, min, worst, best, distribution, topWorst, topBest, total: stations.length };
  }, [stations]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3rem)]">
        <p className="text-muted-foreground">No data available. Please try again later.</p>
      </div>
    );
  }

  const avgLevel = getAqiLevel(stats.avg);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Air Quality Insights
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Live summary across {stats.total} monitoring stations in India
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Activity} label="Average AQI" value={stats.avg} sub={avgLevel.label} />
        <StatCard icon={TrendingUp} label="Worst AQI" value={stats.max} sub={stats.worst?.name} trend="up" />
        <StatCard icon={TrendingDown} label="Best AQI" value={stats.min} sub={stats.best?.name} trend="down" />
        <StatCard icon={Wind} label="Stations Monitored" value={stats.total} sub="Across India" />
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Distribution Pie */}
        <div className="bg-card rounded-xl border border-border/50 shadow-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">AQI Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.distribution}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={3}
                  label={({ name, count }) => `${name} (${count})`}
                >
                  {stats.distribution.map((entry) => (
                    <Cell key={entry.level} fill={AQI_COLORS[entry.level]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 15 Most Polluted Bar */}
        <div className="bg-card rounded-xl border border-border/50 shadow-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Most Polluted Cities</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topWorst} layout="vertical" margin={{ left: 60, right: 16, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  width={56}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="aqi" radius={[0, 4, 4, 0]}>
                  {stats.topWorst.map((entry) => (
                    <Cell key={entry.name} fill={AQI_COLORS[getAqiLevel(entry.aqi).level]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cleanest Cities */}
      <div className="bg-card rounded-xl border border-border/50 shadow-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Cleanest Cities</h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.topBest} margin={{ left: 4, right: 16, top: 4, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                angle={-35}
                textAnchor="end"
              />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="aqi" radius={[4, 4, 0, 0]}>
                {stats.topBest.map((entry) => (
                  <Cell key={entry.name} fill={AQI_COLORS[getAqiLevel(entry.aqi).level]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* City Table */}
      <div className="bg-card rounded-xl border border-border/50 shadow-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">All Stations</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2 font-medium">#</th>
                <th className="pb-2 font-medium">City</th>
                <th className="pb-2 font-medium text-right">AQI</th>
                <th className="pb-2 font-medium">Level</th>
              </tr>
            </thead>
            <tbody>
              {[...stations!].sort((a, b) => b.aqi - a.aqi).map((s, i) => {
                const lvl = getAqiLevel(s.aqi);
                return (
                  <tr key={s.name} className="border-b border-border/30 last:border-0">
                    <td className="py-2 text-muted-foreground">{i + 1}</td>
                    <td className="py-2 font-medium text-foreground">{s.name}</td>
                    <td className="py-2 text-right font-mono font-semibold">{s.aqi}</td>
                    <td className="py-2">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${lvl.color} text-primary-foreground`}>
                        {lvl.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
