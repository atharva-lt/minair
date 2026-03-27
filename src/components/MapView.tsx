import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getAqiColor, getAqiLabel } from "@/lib/zone-data";
import { AqiMapLegend } from "./AqiMapLegend";
import { useIndiaAqi } from "@/hooks/use-india-aqi";
import { Loader2 } from "lucide-react";

export function MapView() {
  const { data: stations, isLoading, error } = useIndiaAqi();

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <MapContainer
        center={[22.5, 78.9]}
        zoom={5}
        className="w-full h-full rounded-xl z-0"
        style={{ minHeight: "500px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stations?.map((station, i) => (
          <CircleMarker
            key={`${station.lat}-${station.lon}-${i}`}
            center={[station.lat, station.lon]}
            radius={8}
            pathOptions={{
              fillColor: getAqiColor(station.aqi),
              color: getAqiColor(station.aqi),
              fillOpacity: 0.6,
              weight: 1.5,
            }}
          >
            <Popup>
              <div className="text-sm space-y-1 min-w-[160px]">
                <p className="font-bold text-base">{station.name}</p>
                <p>
                  <span className="font-semibold">AQI:</span>{" "}
                  <span style={{ color: getAqiColor(station.aqi) }} className="font-bold">
                    {station.aqi} — {getAqiLabel(station.aqi)}
                  </span>
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
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
