import { useState } from "react";
import StickyTopBar from "@/components/StickyTopBar";
import AqiTrendChart from "@/components/AqiTrendChart";
import PollutantTrendChart from "@/components/PollutantTrendChart";
import AqiBreakdownCard from "@/components/AqiBreakdownCard";
import DynamicHealthRecs from "@/components/DynamicHealthRecs";
import WeatherDetailsCard from "@/components/WeatherDetailsCard";
import PollutantTable from "@/components/PollutantTable";
import { useAqiData } from "@/hooks/use-aqi-data";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const [city, setCity] = useState("delhi");
  const { data, isLoading, error } = useAqiData(city);

  const handleSearch = (query: string) => {
    if (query.trim()) setCity(query.trim());
  };

  return (
    <>
      <StickyTopBar cityName={data?.name || city} aqi={data?.aqi ?? null} onSearch={handleSearch} />
      <main className="container py-5 space-y-5">
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
      </main>
    </>
  );
};

export default Dashboard;
