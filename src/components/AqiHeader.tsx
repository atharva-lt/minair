import { Search, MapPin, Bell } from "lucide-react";
import { useState } from "react";

const AqiHeader = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="container flex items-center justify-between h-16 gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm font-mono">AQ</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              AirScope
            </span>
          </div>
        </div>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city or location..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary text-secondary-foreground placeholder:text-muted-foreground text-sm border-none outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-muted transition-colors">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">My Location</span>
          </button>
          <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-aqi-unhealthy" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AqiHeader;
