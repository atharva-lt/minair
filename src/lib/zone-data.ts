import type { LatLngTuple } from "leaflet";

export interface ZoneData {
  id: string;
  name: string;
  aqi: number;
  healthMessage: string;
  boundary: LatLngTuple[];
}

export const INDIA_ZONES: ZoneData[] = [
  {
    id: "north",
    name: "North India",
    aqi: 178,
    healthMessage: "Unhealthy. Everyone may experience health effects; sensitive groups face serious risk.",
    boundary: [
      [36.5, 73.5], [36.5, 82.0], [32.0, 82.0], [28.5, 84.0],
      [28.5, 80.5], [26.5, 80.5], [26.5, 73.5],
    ],
  },
  {
    id: "northwest",
    name: "Northwest India",
    aqi: 145,
    healthMessage: "Unhealthy for sensitive groups. Limit prolonged outdoor exertion.",
    boundary: [
      [26.5, 68.0], [26.5, 73.5], [36.5, 73.5], [35.0, 70.0],
      [30.0, 66.5], [24.5, 68.0],
    ],
  },
  {
    id: "central-north",
    name: "Central-North India",
    aqi: 132,
    healthMessage: "Unhealthy for sensitive groups. Consider reducing outdoor activities.",
    boundary: [
      [26.5, 73.5], [26.5, 80.5], [23.5, 80.5], [23.5, 73.5],
    ],
  },
  {
    id: "west",
    name: "West India",
    aqi: 88,
    healthMessage: "Moderate. Air quality is acceptable but may be a concern for sensitive individuals.",
    boundary: [
      [24.5, 68.0], [26.5, 73.5], [23.5, 73.5], [23.5, 72.0],
      [20.0, 72.5], [18.0, 72.8], [16.0, 73.5], [15.0, 73.8],
    ],
  },
  {
    id: "central",
    name: "Central India",
    aqi: 105,
    healthMessage: "Unhealthy for sensitive groups. Sensitive individuals should limit outdoor time.",
    boundary: [
      [23.5, 73.5], [23.5, 80.5], [20.0, 80.5], [18.0, 78.0],
      [16.0, 73.5],
    ],
  },
  {
    id: "east",
    name: "East India",
    aqi: 62,
    healthMessage: "Moderate. Air quality is acceptable; enjoy outdoor activities with awareness.",
    boundary: [
      [28.5, 84.0], [28.5, 88.5], [26.0, 90.0], [22.0, 90.0],
      [20.0, 87.5], [20.0, 80.5], [23.5, 80.5], [26.5, 80.5],
      [28.5, 80.5],
    ],
  },
  {
    id: "northeast",
    name: "Northeast India",
    aqi: 38,
    healthMessage: "Good. Air quality is satisfactory with little or no risk.",
    boundary: [
      [28.5, 88.5], [29.5, 97.5], [27.0, 97.5], [22.0, 97.5],
      [22.0, 90.0], [26.0, 90.0],
    ],
  },
  {
    id: "southeast",
    name: "Southeast India",
    aqi: 72,
    healthMessage: "Moderate. Unusually sensitive people should consider limiting prolonged outdoor exertion.",
    boundary: [
      [20.0, 80.5], [20.0, 87.5], [16.0, 82.5], [13.5, 80.3],
      [11.0, 80.0], [8.0, 77.5], [8.0, 78.5], [11.0, 80.5],
      [13.0, 80.5], [18.0, 78.0],
    ],
  },
  {
    id: "southwest",
    name: "Southwest India",
    aqi: 42,
    healthMessage: "Good. Air quality is satisfactory; ideal for outdoor activities.",
    boundary: [
      [16.0, 73.5], [18.0, 78.0], [13.0, 80.5], [11.0, 80.5],
      [8.0, 78.5], [8.0, 77.5], [8.5, 76.5], [10.0, 76.0],
      [12.5, 74.8], [15.0, 73.8],
    ],
  },
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
