import { getAqiLevel } from "@/lib/aqi-data";
import { CityPicker } from "@/components/CityPicker";

interface StickyTopBarProps {
  cityName: string;
  aqi: number | null;
  city: string;
  onCityChange: (slug: string) => void;
}

const StickyTopBar = ({ cityName, aqi, city, onCityChange }: StickyTopBarProps) => {
  const level = aqi != null ? getAqiLevel(aqi) : null;

  return (
    <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-xl border-b border-border">
      <div className="container flex items-center justify-between h-14 gap-4 flex-wrap py-2">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs font-mono">AQ</span>
          </div>
          <span className="text-base font-bold tracking-tight text-foreground hidden sm:block">AirScope</span>
        </div>

        {/* City picker */}
        <CityPicker value={city} onChange={onCityChange} className="flex-1 justify-center" />

        {/* City + AQI badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm text-foreground font-medium max-w-[140px] truncate">{cityName}</span>
          {level && aqi != null && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${level.color}`}>
              <span className="text-xs font-bold font-mono text-primary-foreground">{aqi}</span>
              <span className="text-xs font-semibold text-primary-foreground hidden sm:inline">{level.label}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default StickyTopBar;
