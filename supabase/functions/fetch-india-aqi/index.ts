const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// India bounding box (lat1,lng1,lat2,lng2) — covers mainland + islands.
// WAQI map-bounds endpoint returns ALL stations inside the box.
const INDIA_BOUNDS = "6.0,67.0,37.5,98.0";

interface Station {
  uid: number;
  name: string;
  lat: number;
  lon: number;
  aqi: number;
  station?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const token = Deno.env.get("WAQI_API_TOKEN");
    if (!token) {
      return new Response(
        JSON.stringify({ error: "WAQI_API_TOKEN not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch ALL stations within India bounds in a single request
    const url = `https://api.waqi.info/map/bounds/?latlng=${INDIA_BOUNDS}&token=${token}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "ok" || !Array.isArray(data.data)) {
      return new Response(
        JSON.stringify({ error: data.data || "WAQI returned no data", stations: [] }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stations: Station[] = data.data
      .map((s: any) => {
        const aqiNum = typeof s.aqi === "number" ? s.aqi : parseInt(s.aqi);
        if (!Number.isFinite(aqiNum)) return null;
        return {
          uid: s.uid,
          name: s.station?.name?.split(",")[0] || `Station ${s.uid}`,
          station: s.station?.name || "",
          lat: Number(s.lat),
          lon: Number(s.lon),
          aqi: aqiNum,
        };
      })
      .filter((s: Station | null): s is Station => s !== null);

    return new Response(
      JSON.stringify({ stations, count: stations.length, updated: new Date().toISOString() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message, stations: [] }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
