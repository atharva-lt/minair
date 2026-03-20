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
  if (data.error) throw new Error(data.error);

  // Attach level to each pollutant
  const pollutants = data.pollutants.map((p: any) => ({
    ...p,
    level: getPollutantLevel(p.name, p.value),
  }));

  return { ...data, pollutants };
}

export function useAqiData(city: string) {
  return useQuery<LiveAqiData>({
    queryKey: ["aqi", city],
    queryFn: () => fetchAqiData(city),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
