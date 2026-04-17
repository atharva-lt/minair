// Single source of truth for the 4 cities supported across the app.
// Real-time AQI is fetched from the WAQI API via Supabase Edge Functions.

export interface SupportedCity {
  /** WAQI API slug (lowercase) */
  slug: string;
  /** Display label */
  label: string;
}

export const SUPPORTED_CITIES: SupportedCity[] = [
  { slug: "delhi", label: "Delhi" },
  { slug: "mumbai", label: "Mumbai" },
  { slug: "hyderabad", label: "Hyderabad" },
  { slug: "chennai", label: "Chennai" },
];

export const SUPPORTED_CITY_SLUGS = SUPPORTED_CITIES.map((c) => c.slug);
export const SUPPORTED_CITY_LABELS = SUPPORTED_CITIES.map((c) => c.label);

export function getCityLabel(slug: string): string {
  return SUPPORTED_CITIES.find((c) => c.slug === slug.toLowerCase())?.label ?? slug;
}
