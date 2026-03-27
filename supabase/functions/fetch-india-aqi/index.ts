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

    // India bounding box: lat1,lng1,lat2,lng2
    const url = `https://api.waqi.info/v2/map/bounds/?latlng=6,68,37,98&networks=all&token=${token}`;
    console.log("Fetching:", url.replace(token, "***"));
    const res = await fetch(url);
    const text = await res.text();
    console.log("Response status:", res.status, "body length:", text.length, "preview:", text.substring(0, 200));

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON from WAQI API", preview: text.substring(0, 200) }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (data.status !== "ok") {
      console.log("WAQI error:", JSON.stringify(data));
      
      // Fallback: use search for major Indian cities
      const cities = ["delhi", "mumbai", "bangalore", "chennai", "kolkata", "hyderabad", "pune", "ahmedabad", "jaipur", "lucknow", "kanpur", "nagpur", "patna", "indore", "bhopal", "visakhapatnam", "vadodara", "ludhiana", "agra", "varanasi", "chandigarh", "guwahati", "thiruvananthapuram", "coimbatore", "kochi", "surat", "rajkot", "jodhpur", "amritsar", "ranchi"];
      
      const stations = [];
      for (const city of cities) {
        try {
          const cityRes = await fetch(`https://api.waqi.info/feed/${city}/?token=${token}`);
          const cityData = await cityRes.json();
          if (cityData.status === "ok" && cityData.data) {
            const d = cityData.data;
            if (d.city?.geo) {
              stations.push({
                name: d.city.name?.split(",")[0] || city,
                lat: d.city.geo[0],
                lon: d.city.geo[1],
                aqi: typeof d.aqi === "number" ? d.aqi : parseInt(d.aqi) || 0,
              });
            }
          }
        } catch {
          // skip failed city
        }
      }
      
      return new Response(JSON.stringify({ stations }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
