import { PROJECT_TYPES } from "../types";
import { Home } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

const StepProjectType = ({ value, onChange, error }: Props) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <Home className="mx-auto h-10 w-10 text-primary mb-3" />
      <h2 className="text-2xl font-serif font-bold text-foreground">Project Type</h2>
      <p className="text-muted-foreground mt-1">Select the type that best describes your project.</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
      {PROJECT_TYPES.map((pt) => (
        <button
          key={pt.value}
          type="button"
          onClick={() => onChange(pt.value)}
          className={`p-4 rounded-lg border text-left transition-all ${
            value === pt.value
              ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
              : "border-border bg-card hover:border-primary/40"
          }`}
        >
          <span className="font-medium text-sm">{pt.label}</span>
        </button>
      ))}
    </div>
    {error && <p className="text-xs text-destructive text-center mt-2">{error}</p>}
  </div>
);

export default StepProjectType;
