import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface IndiaStation {
  name: string;
  lat: number;
  lon: number;
  aqi: number;
}

async function fetchIndiaAqi(): Promise<IndiaStation[]> {
  const { data, error } = await supabase.functions.invoke("fetch-india-aqi");

  if (error) throw new Error(error.message);
  if (!data || data.error) throw new Error(data?.error || "No data returned");

  return data.stations || [];
}

export function useIndiaAqi() {
  return useQuery<IndiaStation[]>({
    queryKey: ["india-aqi"],
    queryFn: fetchIndiaAqi,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    retry: 2,
  });
}
