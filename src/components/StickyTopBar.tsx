import { Search, MapPin } from "lucide-react";
import { useState } from "react";
import { getAqiLevel } from "@/lib/aqi-data";

interface StickyTopBarProps {
  cityName: string;
  aqi: number | null;
  onSearch: (query: string) => void;
}

const StickyTopBar = ({ cityName, aqi, onSearch }: StickyTopBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const level = aqi != null ? getAqiLevel(aqi) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-xl border-b border-border">
      <div className="container flex items-center justify-between h-14 gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs font-mono">AQ</span>
          </div>
          <span className="text-base font-bold tracking-tight text-foreground hidden sm:block">AirScope</span>
        </div>

        {/* Search */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city..."
              className="w-full pl-8 pr-3 py-1.5 rounded-md bg-secondary text-secondary-foreground placeholder:text-muted-foreground text-sm border-none outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>
        </form>

        {/* City + AQI badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-sm text-foreground font-medium">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="max-w-[120px] truncate">{cityName}</span>
          </div>
          {level && aqi != null && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${level.color}`}>
              <span className="text-xs font-bold font-mono text-primary-foreground">{aqi}</span>
              <span className="text-xs font-semibold text-primary-foreground hidden sm:inline">{level.label}</span>
            </div>
          )}
          <button
            onClick={() => {
              navigator.geolocation?.getCurrentPosition(
                (pos) => onSearch(`geo:${pos.coords.latitude};${pos.coords.longitude}`),
                () => {}
              );
            }}
            className="p-1.5 rounded-md hover:bg-secondary transition-colors"
            title="Use my location"
          >
            <MapPin className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default StickyTopBar;
