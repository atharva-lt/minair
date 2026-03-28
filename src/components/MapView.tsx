import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { INDIA_ZONES, getAqiColor, getAqiLabel } from "@/lib/zone-data";
import { AqiMapLegend } from "./AqiMapLegend";

interface MapViewProps {
  onMapReady?: (map: L.Map) => void;
}

const GREY_TILE =
  "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png";
const LABELS_TILE =
  "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png";

export function MapView({ onMapReady }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
    }).setView([22.5, 79.5], 5);

    L.control.zoom({ position: "topright" }).addTo(map);

    // Grey desaturated base
    L.tileLayer(GREY_TILE, {
      attribution:
        '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    // Subtle labels on top of zones
    const labelsPane = map.createPane("labels");
    labelsPane.style.zIndex = "650";
    labelsPane.style.pointerEvents = "none";
    L.tileLayer(LABELS_TILE, {
      pane: "labels",
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    // Render zones
    INDIA_ZONES.forEach((zone) => {
      const color = getAqiColor(zone.aqi);
      const polygon = L.polygon(zone.boundary, {
        color: "#ffffff",
        weight: 2,
        fillColor: color,
        fillOpacity: 0.45,
        className: "zone-polygon",
      }).addTo(map);

      // Hover effect
      polygon.on("mouseover", () => {
        polygon.setStyle({ fillOpacity: 0.7, weight: 3 });
      });
      polygon.on("mouseout", () => {
        polygon.setStyle({ fillOpacity: 0.45, weight: 2 });
      });

      // Popup
      polygon.bindPopup(
        `<div style="min-width:180px;font-family:system-ui,sans-serif">
          <p style="font-weight:700;font-size:15px;margin:0 0 6px;color:#1a1a2e">${zone.name}</p>
          <p style="margin:0 0 4px">
            <span style="font-weight:600">AQI:</span>
            <span style="color:${color};font-weight:700;font-size:18px;margin-left:4px">${zone.aqi}</span>
            <span style="font-size:12px;color:#666;margin-left:4px">— ${getAqiLabel(zone.aqi)}</span>
          </p>
          <p style="margin:0;font-size:12px;color:#555;line-height:1.4">${zone.healthMessage}</p>
        </div>`,
        { className: "zone-popup" }
      );

      // Zone label
      const center = polygon.getBounds().getCenter();
      const label = L.divIcon({
        className: "zone-label",
        html: `<div style="
          font-size:11px;font-weight:700;color:#1a1a2e;
          text-shadow:0 0 4px rgba(255,255,255,0.9),0 0 8px rgba(255,255,255,0.7);
          white-space:nowrap;pointer-events:none;text-align:center;
          line-height:1.3;
        ">
          ${zone.name.replace(" India", "")}<br/>
          <span style="font-size:13px;color:${color}">${zone.aqi}</span>
        </div>`,
        iconSize: [80, 30],
        iconAnchor: [40, 15],
      });
      L.marker(center, { icon: label, interactive: false }).addTo(map);
    });

    mapRef.current = map;
    onMapReady?.(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <div
        ref={containerRef}
        className="w-full h-full rounded-xl z-0"
        style={{ minHeight: "500px" }}
      />
      <AqiMapLegend />
    </div>
  );
}
