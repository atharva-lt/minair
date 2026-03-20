import { useState, useMemo } from "react";
import {
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  Activity,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

interface SliderFieldProps {
  label: string;
  icon: React.ElementType;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}

const SliderField = ({ label, icon: Icon, value, min, max, step, unit, onChange }: SliderFieldProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <span className="text-sm font-mono font-bold text-foreground">
        {value}
        <span className="text-xs text-muted-foreground ml-0.5">{unit}</span>
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 rounded-full appearance-none cursor-pointer bg-secondary accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-card"
    />
    <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
      <span>{min}</span>
      <span>{max}</span>
    </div>
  </div>
);

type RiskLevel = "low" | "medium" | "high";

interface PredictionResult {
  risk: RiskLevel;
  score: number;
  explanation: string;
  features: { name: string; importance: number }[];
}

function computePrediction(
  temperature: number,
  humidity: number,
  rainfall: number,
  windSpeed: number,
  aqi: number
): PredictionResult {
  // Weighted risk scoring model
  const tempScore = temperature > 40 ? 0.9 : temperature > 35 ? 0.6 : temperature > 25 ? 0.3 : 0.1;
  const humidityScore = humidity < 30 ? 0.7 : humidity > 80 ? 0.6 : 0.2;
  const rainfallScore = rainfall > 50 ? 0.1 : rainfall > 10 ? 0.3 : 0.6;
  const windScore = windSpeed < 5 ? 0.8 : windSpeed < 15 ? 0.4 : 0.15;
  const aqiScore = aqi > 200 ? 1.0 : aqi > 150 ? 0.75 : aqi > 100 ? 0.5 : aqi > 50 ? 0.25 : 0.05;

  const weights = { temperature: 0.15, humidity: 0.1, rainfall: 0.1, wind: 0.15, aqi: 0.5 };
  const totalScore =
    tempScore * weights.temperature +
    humidityScore * weights.humidity +
    rainfallScore * weights.rainfall +
    windScore * weights.wind +
    aqiScore * weights.aqi;

  const risk: RiskLevel = totalScore > 0.6 ? "high" : totalScore > 0.35 ? "medium" : "low";

  const explanations: Record<RiskLevel, string> = {
    low: "Conditions suggest low air quality risk. Outdoor activities are safe for most people.",
    medium: "Moderate risk detected. Sensitive groups should consider reducing prolonged outdoor exertion.",
    high: "High risk predicted. Everyone should limit outdoor exposure. Use air purifiers indoors.",
  };

  const features = [
    { name: "AQI Level", importance: Math.round(aqiScore * weights.aqi * 100) },
    { name: "Temperature", importance: Math.round(tempScore * weights.temperature * 100) },
    { name: "Wind Speed", importance: Math.round(windScore * weights.wind * 100) },
    { name: "Humidity", importance: Math.round(humidityScore * weights.humidity * 100) },
    { name: "Rainfall", importance: Math.round(rainfallScore * weights.rainfall * 100) },
  ].sort((a, b) => b.importance - a.importance);

  return { risk, score: Math.round(totalScore * 100), explanation: explanations[risk], features };
}

const riskConfig: Record<RiskLevel, { bg: string; border: string; text: string; icon: typeof ShieldCheck; label: string; badgeBg: string }> = {
  low: { bg: "bg-aqi-good/10", border: "border-aqi-good/30", text: "text-aqi-good", icon: ShieldCheck, label: "Low Risk", badgeBg: "bg-aqi-good" },
  medium: { bg: "bg-aqi-moderate/10", border: "border-aqi-moderate/30", text: "text-aqi-moderate", icon: ShieldAlert, label: "Medium Risk", badgeBg: "bg-aqi-moderate" },
  high: { bg: "bg-aqi-unhealthy/10", border: "border-aqi-unhealthy/30", text: "text-aqi-unhealthy", icon: AlertTriangle, label: "High Risk", badgeBg: "bg-aqi-unhealthy" },
};

const barColors: Record<RiskLevel, string> = {
  low: "hsl(var(--aqi-good))",
  medium: "hsl(var(--aqi-moderate))",
  high: "hsl(var(--aqi-unhealthy))",
};

const Simulation = () => {
  const [temperature, setTemperature] = useState(32);
  const [humidity, setHumidity] = useState(55);
  const [rainfall, setRainfall] = useState(0);
  const [windSpeed, setWindSpeed] = useState(8);
  const [aqi, setAqi] = useState(120);

  const prediction = useMemo(
    () => computePrediction(temperature, humidity, rainfall, windSpeed, aqi),
    [temperature, humidity, rainfall, windSpeed, aqi]
  );

  const config = riskConfig[prediction.risk];
  const RiskIcon = config.icon;

  return (
    <main className="container py-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">AQI Risk Simulation</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Adjust environmental parameters to predict air quality risk levels.
        </p>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left — Input Panel (2 cols) */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl shadow-card border border-border/50 p-5 space-y-6">
            <h2 className="text-sm font-semibold text-foreground">Input Parameters</h2>
            <SliderField
              label="Temperature"
              icon={Thermometer}
              value={temperature}
              min={-10}
              max={50}
              step={1}
              unit="°C"
              onChange={setTemperature}
            />
            <SliderField
              label="Humidity"
              icon={Droplets}
              value={humidity}
              min={0}
              max={100}
              step={1}
              unit="%"
              onChange={setHumidity}
            />
            <SliderField
              label="Rainfall"
              icon={CloudRain}
              value={rainfall}
              min={0}
              max={100}
              step={1}
              unit="mm"
              onChange={setRainfall}
            />
            <SliderField
              label="Wind Speed"
              icon={Wind}
              value={windSpeed}
              min={0}
              max={60}
              step={1}
              unit="km/h"
              onChange={setWindSpeed}
            />
            <SliderField
              label="AQI (optional)"
              icon={Activity}
              value={aqi}
              min={0}
              max={500}
              step={5}
              unit=""
              onChange={setAqi}
            />
          </div>
        </div>

        {/* Right — Prediction Result (3 cols) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Risk Card */}
          <div className={`rounded-xl border ${config.border} ${config.bg} p-6 transition-colors duration-300`}>
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-full ${config.badgeBg} flex items-center justify-center shadow-md shrink-0`}>
                <RiskIcon className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className={`text-2xl font-bold ${config.text}`}>{config.label}</h2>
                  <span className={`text-sm font-mono font-bold px-2 py-0.5 rounded-md ${config.bg} ${config.text} border ${config.border}`}>
                    Score: {prediction.score}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{prediction.explanation}</p>
              </div>
            </div>

            {/* Risk meter */}
            <div className="mt-5">
              <div className="flex rounded-full overflow-hidden h-3 bg-secondary">
                <div
                  className={`${config.badgeBg} transition-all duration-500 rounded-full`}
                  style={{ width: `${prediction.score}%` }}
                />
              </div>
              <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground font-mono">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>
          </div>

          {/* Feature Importance Chart */}
          <div className="bg-card rounded-xl shadow-card border border-border/50 p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">What Influenced This Prediction</h2>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={prediction.features}
                  layout="vertical"
                  margin={{ top: 0, right: 8, bottom: 0, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 50]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                      boxShadow: "var(--shadow-elevated)",
                    }}
                    formatter={(value: number) => [`${value}%`, "Importance"]}
                  />
                  <Bar dataKey="importance" radius={[0, 4, 4, 0]} barSize={20}>
                    {prediction.features.map((_, i) => (
                      <Cell key={i} fill={barColors[prediction.risk]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Simulation;
