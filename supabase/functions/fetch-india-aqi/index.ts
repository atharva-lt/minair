const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Restricted to 4 cities — kept in sync with src/lib/cities.ts
const INDIAN_CITIES = ["delhi", "mumbai", "hyderabad", "chennai"];

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

    const results = await Promise.allSettled(
      INDIAN_CITIES.map(async (city) => {
        const res = await fetch(`https://api.waqi.info/feed/${city}/?token=${token}`);
        const data = await res.json();
        if (data.status === "ok" && data.data?.city?.geo) {
          const d = data.data;
          return {
            name: d.city.name?.split(",")[0] || city,
            lat: d.city.geo[0],
            lon: d.city.geo[1],
            aqi: typeof d.aqi === "number" ? d.aqi : parseInt(d.aqi) || 0,
          };
        }
        return null;
      })
    );

    const stations = results
      .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled" && r.value !== null)
      .map((r) => r.value);

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
