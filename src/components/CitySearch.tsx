import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import type { IndiaStation } from "@/hooks/use-india-aqi";

interface CitySearchProps {
  stations: IndiaStation[] | undefined;
  onSelect: (station: IndiaStation) => void;
}

export function CitySearch({ stations, onSelect }: CitySearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim() || !stations) return [];
    return stations
      .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 8);
  }, [query, stations]);

  return (
    <div className="relative w-full max-w-xs">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        placeholder="Search city…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="pl-9 h-9 bg-background/80 backdrop-blur-sm"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 top-full mt-1 w-full bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
          {filtered.map((s) => (
            <li key={`${s.lat}-${s.lon}`}>
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-accent transition-colors"
                onMouseDown={() => {
                  onSelect(s);
                  setQuery(s.name);
                  setOpen(false);
                }}
              >
                <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="truncate">{s.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
