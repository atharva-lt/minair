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
    const { city } = await req.json();
    const token = Deno.env.get("WAQI_API_TOKEN");

    if (!token) {
      return new Response(
        JSON.stringify({ error: "WAQI_API_TOKEN not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const keyword = city || "delhi";

    // Fetch main city data
    const feedRes = await fetch(
      `https://api.waqi.info/feed/${encodeURIComponent(keyword)}/?token=${token}`
    );
    const feedData = await feedRes.json();

    if (feedData.status !== "ok") {
      // Try search endpoint as fallback
      const searchRes = await fetch(
        `https://api.waqi.info/search/?keyword=${encodeURIComponent(keyword)}&token=${token}`
      );
      const searchData = await searchRes.json();

      if (searchData.status === "ok" && searchData.data?.length > 0) {
        const stationId = searchData.data[0].uid;
        const stationRes = await fetch(
          `https://api.waqi.info/feed/@${stationId}/?token=${token}`
        );
        const stationData = await stationRes.json();

        if (stationData.status === "ok") {
          return new Response(
            JSON.stringify(transformWaqiData(stationData.data, keyword)),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      return new Response(
        JSON.stringify({ error: "City not found", details: feedData.data }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Also fetch nearby stations via search
    const searchRes = await fetch(
      `https://api.waqi.info/search/?keyword=${encodeURIComponent(keyword)}&token=${token}`
    );
    const searchData = await searchRes.json();
    const nearby =
      searchData.status === "ok"
        ? searchData.data.slice(0, 6).map((s: any) => ({
            name: s.station?.name?.split(",")[0] || s.station?.name || "Unknown",
            aqi: typeof s.aqi === "number" ? s.aqi : parseInt(s.aqi) || 0,
          }))
        : [];

    const result = transformWaqiData(feedData.data, keyword);
    result.nearby = nearby;

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function transformWaqiData(data: any, cityQuery: string) {
  const iaqi = data.iaqi || {};

  const pollutants = [
    {
      name: "PM2.5",
      fullName: "Fine Particulate Matter",
      value: iaqi.pm25?.v ?? 0,
      unit: "µg/m³",
    },
    {
      name: "PM10",
      fullName: "Coarse Particulate Matter",
      value: iaqi.pm10?.v ?? 0,
      unit: "µg/m³",
    },
    {
      name: "O₃",
      fullName: "Ozone",
      value: iaqi.o3?.v ?? 0,
      unit: "ppb",
    },
    {
      name: "NO₂",
      fullName: "Nitrogen Dioxide",
      value: iaqi.no2?.v ?? 0,
      unit: "ppb",
    },
    {
      name: "SO₂",
      fullName: "Sulfur Dioxide",
      value: iaqi.so2?.v ?? 0,
      unit: "ppb",
    },
    {
      name: "CO",
      fullName: "Carbon Monoxide",
      value: iaqi.co?.v ?? 0,
      unit: "mg/m³",
    },
  ];

  // Build forecast from WAQI forecast data if available
  const forecast: { hour: string; aqi: number }[] = [];
  if (data.forecast?.daily?.pm25) {
    const pm25Forecast = data.forecast.daily.pm25.slice(0, 8);
    pm25Forecast.forEach((f: any, i: number) => {
      forecast.push({
        hour: i === 0 ? "Today" : `Day ${i + 1}`,
        aqi: f.avg ?? f.max ?? 0,
      });
    });
  }

  const cityName =
    data.city?.name?.split(",")[0] ||
    cityQuery.charAt(0).toUpperCase() + cityQuery.slice(1);
  const country =
    data.city?.name?.split(",").slice(1).join(",").trim() || "";

  const timeDiff = data.time?.iso
    ? getTimeDiff(data.time.iso)
    : "recently";

  return {
    name: cityName,
    country,
    aqi: data.aqi ?? 0,
    temperature: iaqi.t?.v ?? null,
    humidity: iaqi.h?.v ?? null,
    wind: iaqi.w?.v ?? null,
    lastUpdated: timeDiff,
    pollutants,
    forecast,
    nearby: [],
  };
}

function getTimeDiff(isoString: string): string {
  const then = new Date(isoString).getTime();
  const now = Date.now();
  const diffMin = Math.floor((now - then) / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `${diffHr} hr ago`;
}
