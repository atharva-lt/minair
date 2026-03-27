import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getAqiColor, getAqiLabel } from "@/lib/zone-data";
import { AqiMapLegend } from "./AqiMapLegend";
import { useIndiaAqi } from "@/hooks/use-india-aqi";
import { Loader2 } from "lucide-react";

export function MapView() {
  const { data: stations, isLoading, error } = useIndiaAqi();
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current).setView([22.5, 78.9], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when data changes
  useEffect(() => {
    if (!mapRef.current || !stations) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    stations.forEach((station) => {
      const color = getAqiColor(station.aqi);
      const marker = L.circleMarker([station.lat, station.lon], {
        radius: 8,
        fillColor: color,
        color: color,
        fillOpacity: 0.6,
        weight: 1.5,
      }).addTo(mapRef.current!);

      marker.bindPopup(
        `<div style="min-width:160px">
          <p style="font-weight:bold;font-size:14px;margin:0 0 4px">${station.name}</p>
          <p style="margin:0"><strong>AQI:</strong> <span style="color:${color};font-weight:bold">${station.aqi} — ${getAqiLabel(station.aqi)}</span></p>
        </div>`
      );

      markersRef.current.push(marker);
    });
  }, [stations]);

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <div
        ref={containerRef}
        className="w-full h-full rounded-xl z-0"
        style={{ minHeight: "500px" }}
      />
      <AqiMapLegend />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-xl z-[1000]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-lg text-sm z-[1000]">
          Failed to load AQI data
        </div>
      )}
    </div>
  );
}
