import { useState } from "react";
import AqiHeader from "@/components/AqiHeader";
import MainAqiCard from "@/components/MainAqiCard";
import PollutantCard from "@/components/PollutantCard";
import AqiForecast from "@/components/AqiForecast";
import AqiScaleLegend from "@/components/AqiScaleLegend";
import NearbyStations from "@/components/NearbyStations";
import HealthRecommendations from "@/components/HealthRecommendations";
import { useAqiData } from "@/hooks/use-aqi-data";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
  const [city, setCity] = useState("delhi");
  const { data, isLoading, error } = useAqiData(city);

  const handleSearch = (query: string) => {
    if (query.trim()) setCity(query.trim());
  };

  return (
    <>
      <AqiHeader onSearch={handleSearch} />
      <main className="container py-6 space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            Failed to load air quality data: {error.message}.
          </div>
        )}
        {isLoading ? (
          <Skeleton className="h-64 w-full rounded-2xl" />
        ) : data ? (
          <MainAqiCard data={data} />
        ) : null}

        <section>
          <h2 className="text-base font-semibold text-foreground mb-3">Pollutant Breakdown</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
              : data?.pollutants.map((p, i) => <PollutantCard key={p.name} pollutant={p} index={i} />)}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            {isLoading ? (
              <Skeleton className="h-48 rounded-xl" />
            ) : data && data.forecast.length > 0 ? (
              <AqiForecast forecast={data.forecast} />
            ) : (
              <div className="bg-card rounded-xl shadow-card border border-border/50 p-5">
                <h2 className="text-base font-semibold text-foreground mb-4">Forecast</h2>
                <p className="text-sm text-muted-foreground">No forecast data available.</p>
              </div>
            )}
          </div>
          <AqiScaleLegend />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {isLoading ? <Skeleton className="h-64 rounded-xl" /> : <NearbyStations stations={data?.nearby || []} />}
          <HealthRecommendations />
        </div>

        <footer className="text-center py-6 text-xs text-muted-foreground">
          <p>Powered by WAQI.info — AirScope © 2026</p>
        </footer>
      </main>
    </>
  );
};

export default Home;
