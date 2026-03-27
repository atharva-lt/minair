const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

    // India bounding box: lat 6-37, lon 68-98
    const url = `https://api.waqi.info/v2/map/bounds?latlng=6,68,37,98&networks=all&token=${token}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "ok") {
      return new Response(
        JSON.stringify({ error: "Failed to fetch India AQI data", details: data }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Map to simplified station objects
    const stations = (data.data || [])
      .filter((s: any) => typeof s.aqi === "number" && s.aqi > 0)
      .map((s: any) => ({
        name: s.station?.name || "Unknown",
        lat: s.lat,
        lon: s.lon,
        aqi: s.aqi,
      }));

    return new Response(JSON.stringify({ stations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
