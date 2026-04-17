import { CityPicker } from "@/components/CityPicker";

interface AqiHeaderProps {
  city: string;
  onCityChange: (slug: string) => void;
}

const AqiHeader = ({ city, onCityChange }: AqiHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border -mx-5 px-5">
      <div className="flex items-center justify-between h-14 gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm font-mono">AQ</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">AirScope</span>
        </div>

        <CityPicker value={city} onChange={onCityChange} />
      </div>
    </header>
  );
};

export default AqiHeader;
