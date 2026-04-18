import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getAqiColor, getAqiLabel } from "@/lib/zone-data";
import { AqiMapLegend } from "./AqiMapLegend";
import { useIndiaAqi, type IndiaStation } from "@/hooks/use-india-aqi";
import { Loader2 } from "lucide-react";

interface MapViewProps {
  onMapReady?: (map: L.Map) => void;
  onStationsLoaded?: (stations: IndiaStation[]) => void;
}

export function MapView({ onMapReady, onStationsLoaded }: MapViewProps = {}) {
  const { data: stations, isLoading, error } = useIndiaAqi();
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      preferCanvas: true, // canvas renderer = far better perf for hundreds of markers
    }).setView([22.5, 78.9], 5);

    // Dark basemap (CartoDB) to match the reference image
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(mapRef.current);

    layerRef.current = L.layerGroup().addTo(mapRef.current);

    onMapReady?.(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !layerRef.current || !stations) return;

    layerRef.current.clearLayers();

    stations.forEach((station) => {
      const color = getAqiColor(station.aqi);
      const marker = L.circleMarker([station.lat, station.lon], {
        radius: 5,
        fillColor: color,
        color: "#0f172a",
        fillOpacity: 0.85,
        weight: 0.5,
      });

      marker.bindTooltip(`${station.aqi}`, {
        permanent: false,
        direction: "top",
        className: "aqi-tooltip",
      });

      marker.bindPopup(
        `<div style="min-width:200px;font-family:system-ui">
          <p style="font-weight:600;font-size:13px;margin:0 0 6px;line-height:1.3">${station.station || station.name}</p>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color}"></span>
            <span style="font-size:12px;color:#475569">AQI</span>
            <span style="font-weight:700;color:${color};font-size:15px">${station.aqi}</span>
            <span style="font-size:11px;color:#64748b">${getAqiLabel(station.aqi)}</span>
          </div>
        </div>`
      );

      layerRef.current!.addLayer(marker);
    });

    onStationsLoaded?.(stations);
  }, [stations]);

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <div
        ref={containerRef}
        className="w-full h-full rounded-xl z-0"
        style={{ minHeight: "500px" }}
      />
      <AqiMapLegend />
      {stations && (
        <div className="absolute top-4 left-4 z-[1000] rounded-lg bg-card/90 backdrop-blur-sm border border-border px-3 py-1.5 text-xs font-medium shadow-md">
          <span className="text-muted-foreground">Live stations: </span>
          <span className="text-foreground font-bold">{stations.length}</span>
        </div>
      )}
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
