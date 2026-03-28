export interface ZoneData {
  name: string;
  lat: number;
  lon: number;
  aqi: number;
  healthMessage: string;
}

export const CHENNAI_ZONES: ZoneData[] = [
  { name: "North Chennai", lat: 13.15, lon: 80.26, aqi: 142, healthMessage: "Unhealthy for sensitive groups. Limit prolonged outdoor exertion." },
  { name: "South Chennai", lat: 13.00, lon: 80.25, aqi: 68, healthMessage: "Moderate air quality. Unusually sensitive people should consider limiting prolonged outdoor exertion." },
  { name: "East Chennai", lat: 13.07, lon: 80.30, aqi: 45, healthMessage: "Good air quality. Air quality is satisfactory with little or no risk." },
  { name: "West Chennai", lat: 13.07, lon: 80.18, aqi: 165, healthMessage: "Unhealthy. Everyone may begin to experience health effects." },
  { name: "Central Chennai", lat: 13.08, lon: 80.27, aqi: 98, healthMessage: "Moderate. Air quality is acceptable but may pose a risk for sensitive individuals." },
];

export function getAqiColor(aqi: number): string {
  if (aqi <= 50) return "#22c55e";
  if (aqi <= 100) return "#eab308";
  if (aqi <= 150) return "#f97316";
  return "#ef4444";
}

export function getAqiLabel(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive";
  return "Unhealthy";
}
