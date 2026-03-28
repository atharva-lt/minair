import { useRef } from "react";
import L from "leaflet";
import { MapView } from "@/components/MapView";

export default function Hypro() {
  const mapRef = useRef<L.Map | null>(null);

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      <div className="px-6 py-4 border-b border-border bg-card/60 backdrop-blur-sm">
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          HYPRO — India AQI Zone Map
        </h1>
        <p className="text-sm text-muted-foreground">
          Zone-based air quality visualization across India
        </p>
      </div>
      <div className="flex-1 p-4">
        <MapView onMapReady={(map) => { mapRef.current = map; }} />
      </div>
    </div>
  );
}
