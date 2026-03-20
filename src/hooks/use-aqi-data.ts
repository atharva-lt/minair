import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getPollutantLevel, type AqiLevel } from "@/lib/aqi-data";

export interface LiveAqiData {
  name: string;
  country: string;
  aqi: number;
  temperature: number | null;
  humidity: number | null;
  wind: number | null;
  lastUpdated: string;
  pollutants: {
    name: string;
    fullName: string;
    value: number;
    unit: string;
    level: AqiLevel;
  }[];
  forecast: { hour: string; aqi: number }[];
  nearby: { name: string; aqi: number }[];
}

async function fetchAqiData(city: string): Promise<LiveAqiData> {
  const { data, error } = await supabase.functions.invoke("fetch-aqi", {
    body: { city },
  });

  if (error) throw new Error(error.message);
  if (!data || data.error) throw new Error(data?.error || "No data returned");

  // Attach level to each pollutant
  const pollutants = (data.pollutants || []).map((p: any) => ({
    ...p,
    level: getPollutantLevel(p.name, p.value),
  }));

  return {
    name: data.name || city,
    country: data.country || "",
    aqi: data.aqi ?? 0,
    temperature: data.temperature ?? null,
    humidity: data.humidity ?? null,
    wind: data.wind ?? null,
    lastUpdated: data.lastUpdated || "unknown",
    pollutants,
    forecast: data.forecast || [],
    nearby: data.nearby || [],
  };
}

export function useAqiData(city: string) {
  return useQuery<LiveAqiData>({
    queryKey: ["aqi", city],
    queryFn: () => fetchAqiData(city),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    retry: 2,
  });
}
