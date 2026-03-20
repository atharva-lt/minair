import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import AqiTrendChart from "@/components/AqiTrendChart";
import PollutantTrendChart from "@/components/PollutantTrendChart";
import AqiBreakdownCard from "@/components/AqiBreakdownCard";
import DynamicHealthRecs from "@/components/DynamicHealthRecs";
import WeatherDetailsCard from "@/components/WeatherDetailsCard";
import PollutantTable from "@/components/PollutantTable";
import { useAqiData } from "@/hooks/use-aqi-data";
import { Skeleton } from "@/components/ui/skeleton";
import { getAqiLevel } from "@/lib/aqi-data";

const Dashboard = () => {
  const [city, setCity] = useState("delhi");
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, error } = useAqiData(city);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCity(searchQuery.trim());
      setSearchQuery("");
    }
  };

  const level = data ? getAqiLevel(data.aqi) : null;

  return (
    <div className="p-5 space-y-5">
      {/* Inline search + city badge */}
      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city..."
              className="w-full pl-8 pr-3 py-1.5 rounded-md bg-secondary text-secondary-foreground placeholder:text-muted-foreground text-sm border-none outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>
        </form>
        {data && level && (
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{data.name}</span>
            <div className={`px-2.5 py-1 rounded-full ${level.color}`}>
              <span className="text-xs font-bold font-mono text-primary-foreground">{data.aqi} — {level.label}</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
          Failed to load data: {error.message}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {isLoading ? (
            <>
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
            </>
          ) : data ? (
            <>
              <AqiTrendChart forecast={data.forecast} />
              <PollutantTrendChart forecast={data.forecast} pollutants={data.pollutants} />
            </>
          ) : null}
        </div>
        <div className="space-y-5">
          {isLoading ? (
            <>
              <Skeleton className="h-48 rounded-xl" />
              <Skeleton className="h-56 rounded-xl" />
              <Skeleton className="h-48 rounded-xl" />
            </>
          ) : data ? (
            <>
              <AqiBreakdownCard aqi={data.aqi} />
              <DynamicHealthRecs aqi={data.aqi} />
              <WeatherDetailsCard temperature={data.temperature} humidity={data.humidity} wind={data.wind} />
            </>
          ) : null}
        </div>
      </div>
      {isLoading ? <Skeleton className="h-48 rounded-xl" /> : data ? <PollutantTable pollutants={data.pollutants} /> : null}
      <footer className="text-center py-4 text-xs text-muted-foreground">
        <p>Powered by WAQI.info — AirScope © 2026</p>
      </footer>
    </div>
  );
};

export default Dashboard;
