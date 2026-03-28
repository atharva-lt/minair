import { useRef, useState } from "react";
import L from "leaflet";
import { MapView } from "@/components/MapView";
import { CitySearch } from "@/components/CitySearch";
import type { IndiaStation } from "@/hooks/use-india-aqi";

export default function Hypro() {
  const mapRef = useRef<L.Map | null>(null);
  const [stations, setStations] = useState<IndiaStation[]>([]);

  const handleSelect = (station: IndiaStation) => {
    mapRef.current?.flyTo([station.lat, station.lon], 11, { duration: 1.2 });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      <div className="px-6 py-4 border-b border-border bg-card/60 backdrop-blur-sm flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">HYPRO — India AQI Map</h1>
          <p className="text-sm text-muted-foreground">Live air quality stations across India</p>
        </div>
        <CitySearch stations={stations} onSelect={handleSelect} />
      </div>
      <div className="flex-1 p-4">
        <MapView
          onMapReady={(map) => { mapRef.current = map; }}
          onStationsLoaded={setStations}
        />
      </div>
    </div>
  );
}
