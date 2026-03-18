export interface PollutantData {
  name: string;
  fullName: string;
  value: number;
  unit: string;
  level: AqiLevel;
}

export type AqiLevel = "good" | "moderate" | "unhealthy-sensitive" | "unhealthy" | "very-unhealthy" | "hazardous";

export interface AqiLevelInfo {
  level: AqiLevel;
  label: string;
  range: string;
  color: string;
  bgClass: string;
  textClass: string;
  description: string;
}

export const AQI_LEVELS: AqiLevelInfo[] = [
  { level: "good", label: "Good", range: "0-50", color: "bg-aqi-good", bgClass: "bg-aqi-good/10", textClass: "text-aqi-good", description: "Air quality is satisfactory" },
  { level: "moderate", label: "Moderate", range: "51-100", color: "bg-aqi-moderate", bgClass: "bg-aqi-moderate/10", textClass: "text-aqi-moderate", description: "Acceptable air quality" },
  { level: "unhealthy-sensitive", label: "Unhealthy for Sensitive Groups", range: "101-150", color: "bg-aqi-unhealthy-sensitive", bgClass: "bg-aqi-unhealthy-sensitive/10", textClass: "text-aqi-unhealthy-sensitive", description: "Sensitive groups may experience effects" },
  { level: "unhealthy", label: "Unhealthy", range: "151-200", color: "bg-aqi-unhealthy", bgClass: "bg-aqi-unhealthy/10", textClass: "text-aqi-unhealthy", description: "Everyone may begin to experience effects" },
  { level: "very-unhealthy", label: "Very Unhealthy", range: "201-300", color: "bg-aqi-very-unhealthy", bgClass: "bg-aqi-very-unhealthy/10", textClass: "text-aqi-very-unhealthy", description: "Health warnings of emergency conditions" },
  { level: "hazardous", label: "Hazardous", range: "301-500", color: "bg-aqi-hazardous", bgClass: "bg-aqi-hazardous/10", textClass: "text-aqi-hazardous", description: "Health alert: serious risk" },
];

export function getAqiLevel(aqi: number): AqiLevelInfo {
  if (aqi <= 50) return AQI_LEVELS[0];
  if (aqi <= 100) return AQI_LEVELS[1];
  if (aqi <= 150) return AQI_LEVELS[2];
  if (aqi <= 200) return AQI_LEVELS[3];
  if (aqi <= 300) return AQI_LEVELS[4];
  return AQI_LEVELS[5];
}

export function getPollutantLevel(name: string, value: number): AqiLevel {
  // Simplified thresholds
  const thresholds: Record<string, number[]> = {
    "PM2.5": [12, 35.4, 55.4, 150.4, 250.4],
    "PM10": [54, 154, 254, 354, 424],
    "O₃": [54, 70, 85, 105, 200],
    "NO₂": [53, 100, 360, 649, 1249],
    "SO₂": [35, 75, 185, 304, 604],
    "CO": [4.4, 9.4, 12.4, 15.4, 30.4],
  };
  const t = thresholds[name] || [50, 100, 150, 200, 300];
  if (value <= t[0]) return "good";
  if (value <= t[1]) return "moderate";
  if (value <= t[2]) return "unhealthy-sensitive";
  if (value <= t[3]) return "unhealthy";
  if (value <= t[4]) return "very-unhealthy";
  return "hazardous";
}

// Mock data for demonstration
export const MOCK_CITY = {
  name: "New Delhi",
  country: "India",
  aqi: 168,
  temperature: 32,
  humidity: 45,
  wind: 12,
  lastUpdated: "2 minutes ago",
  pollutants: [
    { name: "PM2.5", fullName: "Fine Particulate Matter", value: 82.3, unit: "µg/m³", level: "unhealthy" as AqiLevel },
    { name: "PM10", fullName: "Coarse Particulate Matter", value: 156.7, unit: "µg/m³", level: "unhealthy-sensitive" as AqiLevel },
    { name: "O₃", fullName: "Ozone", value: 38.2, unit: "ppb", level: "good" as AqiLevel },
    { name: "NO₂", fullName: "Nitrogen Dioxide", value: 67.4, unit: "ppb", level: "moderate" as AqiLevel },
    { name: "SO₂", fullName: "Sulfur Dioxide", value: 12.8, unit: "ppb", level: "good" as AqiLevel },
    { name: "CO", fullName: "Carbon Monoxide", value: 1.2, unit: "mg/m³", level: "good" as AqiLevel },
  ],
  forecast: [
    { hour: "Now", aqi: 168 },
    { hour: "3PM", aqi: 175 },
    { hour: "6PM", aqi: 162 },
    { hour: "9PM", aqi: 148 },
    { hour: "12AM", aqi: 135 },
    { hour: "3AM", aqi: 120 },
    { hour: "6AM", aqi: 110 },
    { hour: "9AM", aqi: 142 },
  ],
  nearby: [
    { name: "Connaught Place", aqi: 172 },
    { name: "Anand Vihar", aqi: 210 },
    { name: "IGI Airport", aqi: 155 },
    { name: "Dwarka", aqi: 148 },
    { name: "Noida", aqi: 185 },
    { name: "Gurgaon", aqi: 162 },
  ],
};
