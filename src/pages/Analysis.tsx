import { useState, useMemo } from "react";
import { FlaskConical, ArrowRightLeft, Search } from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { useAqiData } from "@/hooks/use-aqi-data";
import { getAqiLevel } from "@/lib/aqi-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { SUPPORTED_CITY_LABELS } from "@/lib/cities";

const PRESET_CITIES = SUPPORTED_CITY_LABELS;

const CHART_COLORS = [
  "hsl(210, 70%, 45%)",
  "hsl(185, 60%, 42%)",
  "hsl(25, 95%, 55%)",
  "hsl(280, 60%, 45%)",
];

function CityPicker({ selected, onToggle }: { selected: string[]; onToggle: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {PRESET_CITIES.map((city) => {
        const active = selected.includes(city);
        return (
          <button
            key={city}
            onClick={() => onToggle(city)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
              active
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            {city}
          </button>
        );
      })}
    </div>
  );
}

function CityDataPanel({ city, color }: { city: string; color: string }) {
  const { data, isLoading, isError } = useAqiData(city);

  if (isLoading) return <Skeleton className="h-20 rounded-lg" />;
  if (isError || !data) return <div className="text-xs text-destructive">Failed to load {city}</div>;

  const level = getAqiLevel(data.aqi);

  return (
    <div className="bg-card rounded-xl border border-border/50 shadow-card p-4 flex items-center gap-4">
      <div className="w-2 h-12 rounded-full" style={{ backgroundColor: color }} />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground truncate">{data.name}</h3>
        <p className="text-xs text-muted-foreground">{data.country}</p>
      </div>
      <div className="text-right">
        <span className="text-2xl font-bold font-mono text-foreground">{data.aqi}</span>
        <p className={`text-xs font-medium ${level.textClass}`}>{level.label}</p>
      </div>
    </div>
  );
}

export default function Analysis() {
  const [selected, setSelected] = useState<string[]>(["Delhi", "Mumbai"]);

  const toggle = (city: string) => {
    setSelected((prev) =>
      prev.includes(city)
        ? prev.filter((c) => c !== city)
        : prev.length < 4
        ? [...prev, city]
        : prev
    );
  };

  // Fetch data for all selected cities
  const city1 = useAqiData(selected[0] || "");
  const city2 = useAqiData(selected[1] || "");
  const city3 = useAqiData(selected[2] || "");
  const city4 = useAqiData(selected[3] || "");

  const cityDataArr = [city1, city2, city3, city4]
    .slice(0, selected.length)
    .map((q, i) => ({ query: q, name: selected[i], color: CHART_COLORS[i] }));

  const allLoaded = cityDataArr.every((c) => c.query.data);

  // Pollutant comparison radar data
  const radarData = useMemo(() => {
    if (!allLoaded) return [];
    const pollutantNames = ["PM2.5", "PM10", "O₃", "NO₂", "SO₂", "CO"];
    return pollutantNames.map((pName) => {
      const entry: Record<string, any> = { pollutant: pName };
      cityDataArr.forEach((c) => {
        const p = c.query.data?.pollutants.find((pp) => pp.name === pName);
        entry[c.name] = p?.value ?? 0;
      });
      return entry;
    });
  }, [allLoaded, cityDataArr.map((c) => c.query.data).join()]);

  // Pollutant bar comparison
  const barData = useMemo(() => {
    if (!allLoaded) return [];
    const pollutantNames = ["PM2.5", "PM10", "O₃", "NO₂", "SO₂", "CO"];
    return pollutantNames.map((pName) => {
      const entry: Record<string, any> = { pollutant: pName };
      cityDataArr.forEach((c) => {
        const p = c.query.data?.pollutants.find((pp) => pp.name === pName);
        entry[c.name] = p?.value ?? 0;
      });
      return entry;
    });
  }, [allLoaded, cityDataArr.map((c) => c.query.data).join()]);

  // Forecast comparison line data
  const forecastData = useMemo(() => {
    if (!allLoaded) return [];
    const maxLen = Math.max(...cityDataArr.map((c) => c.query.data?.forecast.length || 0));
    return Array.from({ length: maxLen }, (_, i) => {
      const entry: Record<string, any> = { hour: cityDataArr[0]?.query.data?.forecast[i]?.hour || `H${i}` };
      cityDataArr.forEach((c) => {
        entry[c.name] = c.query.data?.forecast[i]?.aqi ?? null;
      });
      return entry;
    });
  }, [allLoaded, cityDataArr.map((c) => c.query.data).join()]);

  const isLoading = cityDataArr.some((c) => c.query.isLoading);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-primary" />
          City Comparison &amp; Pollutant Analysis
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Select up to 4 cities to compare AQI, pollutants, and forecasts side by side
        </p>
      </div>

      {/* City Picker */}
      <div className="bg-card rounded-xl border border-border/50 shadow-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Select Cities (max 4)</span>
        </div>
        <CityPicker selected={selected} onToggle={toggle} />
      </div>

      {/* City Summary Cards */}
      {selected.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cityDataArr.map((c) => (
            <CityDataPanel key={c.name} city={c.name} color={c.color} />
          ))}
        </div>
      )}

      {isLoading && (
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
      )}

      {allLoaded && selected.length >= 2 && (
        <>
          {/* Charts Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <div className="bg-card rounded-xl border border-border/50 shadow-card p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Pollutant Radar</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis
                      dataKey="pollutant"
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <PolarRadiusAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
                    {cityDataArr.map((c) => (
                      <Radar
                        key={c.name}
                        name={c.name}
                        dataKey={c.name}
                        stroke={c.color}
                        fill={c.color}
                        fillOpacity={0.15}
                        strokeWidth={2}
                      />
                    ))}
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-card rounded-xl border border-border/50 shadow-card p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Pollutant Levels Comparison</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis
                      dataKey="pollutant"
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
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
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    {cityDataArr.map((c) => (
                      <Bar key={c.name} dataKey={c.name} fill={c.color} radius={[4, 4, 0, 0]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Forecast Comparison */}
          {forecastData.length > 0 && (
            <div className="bg-card rounded-xl border border-border/50 shadow-card p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">AQI Forecast Comparison</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecastData} margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis
                      dataKey="hour"
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
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
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    {cityDataArr.map((c) => (
                      <Line
                        key={c.name}
                        type="monotone"
                        dataKey={c.name}
                        stroke={c.color}
                        strokeWidth={2}
                        dot={{ r: 3, fill: c.color }}
                        connectNulls
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Detailed Pollutant Table */}
          <div className="bg-card rounded-xl border border-border/50 shadow-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Detailed Pollutant Values</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-2 font-medium">Pollutant</th>
                    {cityDataArr.map((c) => (
                      <th key={c.name} className="pb-2 font-medium text-right">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                          {c.name}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {["PM2.5", "PM10", "O₃", "NO₂", "SO₂", "CO"].map((pName) => (
                    <tr key={pName} className="border-b border-border/30 last:border-0">
                      <td className="py-2 font-medium text-foreground">{pName}</td>
                      {cityDataArr.map((c) => {
                        const p = c.query.data?.pollutants.find((pp) => pp.name === pName);
                        return (
                          <td key={c.name} className="py-2 text-right font-mono">
                            {p ? `${p.value} ${p.unit}` : "—"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {selected.length < 2 && !isLoading && (
        <div className="bg-card rounded-xl border border-border/50 shadow-card p-12 text-center">
          <ArrowRightLeft className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Select at least 2 cities above to compare pollutant data</p>
        </div>
      )}
    </div>
  );
}
