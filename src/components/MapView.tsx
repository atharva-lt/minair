import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CHENNAI_ZONES, getAqiColor, getAqiLabel } from "@/lib/zone-data";
import { AqiMapLegend } from "./AqiMapLegend";

export function MapView() {
  return (
    <div className="relative w-full h-full min-h-[500px]">
      <MapContainer
        center={[13.08, 80.27]}
        zoom={12}
        className="w-full h-full rounded-xl z-0"
        style={{ minHeight: "500px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {CHENNAI_ZONES.map((zone) => (
          <CircleMarker
            key={zone.name}
            center={[zone.lat, zone.lon]}
            radius={20}
            pathOptions={{
              fillColor: getAqiColor(zone.aqi),
              color: getAqiColor(zone.aqi),
              fillOpacity: 0.55,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-sm space-y-1 min-w-[180px]">
                <p className="font-bold text-base">{zone.name}</p>
                <p>
                  <span className="font-semibold">AQI:</span>{" "}
                  <span style={{ color: getAqiColor(zone.aqi) }} className="font-bold">
                    {zone.aqi} — {getAqiLabel(zone.aqi)}
                  </span>
                </p>
                <p className="text-muted-foreground text-xs leading-relaxed">{zone.healthMessage}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      <AqiMapLegend />
    </div>
  );
}
