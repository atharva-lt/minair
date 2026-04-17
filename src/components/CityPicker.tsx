import { MapPin } from "lucide-react";
import { SUPPORTED_CITIES } from "@/lib/cities";

interface CityPickerProps {
  value: string;
  onChange: (slug: string) => void;
  className?: string;
}

/**
 * Compact pill-style selector restricted to the 4 supported cities.
 * Used everywhere the user picks a city.
 */
export function CityPicker({ value, onChange, className }: CityPickerProps) {
  return (
    <div className={`flex items-center gap-2 flex-wrap ${className ?? ""}`}>
      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
      {SUPPORTED_CITIES.map((c) => {
        const active = c.slug === value.toLowerCase();
        return (
          <button
            key={c.slug}
            type="button"
            onClick={() => onChange(c.slug)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
              active
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
