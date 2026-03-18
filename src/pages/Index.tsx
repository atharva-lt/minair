import AqiHeader from "@/components/AqiHeader";
import MainAqiCard from "@/components/MainAqiCard";
import PollutantCard from "@/components/PollutantCard";
import AqiForecast from "@/components/AqiForecast";
import AqiScaleLegend from "@/components/AqiScaleLegend";
import NearbyStations from "@/components/NearbyStations";
import HealthRecommendations from "@/components/HealthRecommendations";
import { MOCK_CITY } from "@/lib/aqi-data";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <AqiHeader />

      <main className="container py-6 space-y-6">
        {/* Main AQI Display */}
        <MainAqiCard />

        {/* Pollutants Grid */}
        <section>
          <h2 className="text-base font-semibold text-foreground mb-3">Pollutant Breakdown</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {MOCK_CITY.pollutants.map((p, i) => (
              <PollutantCard key={p.name} pollutant={p} index={i} />
            ))}
          </div>
        </section>

        {/* Forecast + Scale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <AqiForecast />
          </div>
          <AqiScaleLegend />
        </div>

        {/* Nearby + Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <NearbyStations />
          <HealthRecommendations />
        </div>

        {/* Footer */}
        <footer className="text-center py-6 text-xs text-muted-foreground">
          <p>Data is simulated for demonstration purposes. AirScope © 2026</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
