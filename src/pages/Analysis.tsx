import { FlaskConical } from "lucide-react";

export default function Analysis() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-3rem)] px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <FlaskConical className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Analysis</h1>
        <p className="text-muted-foreground max-w-md">
          Coming Soon — Advanced pollutant analysis and comparison tools will be available here.
        </p>
      </div>
    </div>
  );
}
