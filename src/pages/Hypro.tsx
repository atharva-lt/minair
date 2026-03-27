import { MapView } from "@/components/MapView";

export default function Hypro() {
  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      <div className="px-6 py-4 border-b border-border bg-card/60 backdrop-blur-sm">
        <h1 className="text-xl font-bold text-foreground tracking-tight">HYPRO — India AQI Map</h1>
        <p className="text-sm text-muted-foreground">Live air quality stations across India</p>
      </div>
      <div className="flex-1 p-4">
        <MapView />
      </div>
    </div>
  );
}
