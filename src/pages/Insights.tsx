import { BarChart3 } from "lucide-react";

export default function Insights() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-3rem)] px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <BarChart3 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Insights</h1>
        <p className="text-muted-foreground max-w-md">
          Coming Soon — Detailed air quality insights and data-driven reports will be available here.
        </p>
      </div>
    </div>
  );
}
