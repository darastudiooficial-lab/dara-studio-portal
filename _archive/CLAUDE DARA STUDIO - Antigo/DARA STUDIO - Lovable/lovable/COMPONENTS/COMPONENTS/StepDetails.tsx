import { SIZE_OPTIONS, SIZE_OPTIONS_BR, FLOOR_OPTIONS } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Ruler } from "lucide-react";

interface Props {
  country: string;
  projectSize: string;
  customSqft: number | undefined;
  floors: string[];
  lotSize: string;
  onFieldChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}

const StepDetails = ({ country, projectSize, customSqft, floors, lotSize, onFieldChange, errors }: Props) => {
  const isBR = country === "BR";
  const sizeOptions = isBR ? SIZE_OPTIONS_BR : SIZE_OPTIONS;
  const unitLabel = isBR ? "m²" : "sqft";

  const toggleFloor = (value: string) => {
    const current = floors || [];
    const updated = current.includes(value)
      ? current.filter(f => f !== value)
      : [...current, value];
    onFieldChange("floors", updated);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Ruler className="mx-auto h-10 w-10 text-primary mb-3" />
        <h2 className="text-2xl font-serif font-bold text-foreground">Project Details</h2>
        <p className="text-muted-foreground mt-1">Size and structure information.</p>
      </div>

      <div className="max-w-lg mx-auto space-y-5">
        <div>
          <Label>Estimated Project Size ({unitLabel}) *</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {sizeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onFieldChange("projectSize", opt.value)}
                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                  projectSize === opt.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {errors.projectSize && <p className="text-xs text-destructive mt-1">{errors.projectSize}</p>}
        </div>

        {projectSize === "custom" && (
          <div>
            <Label>Exact {unitLabel} *</Label>
            <Input
              type="number"
              value={customSqft || ""}
              onChange={(e) => onFieldChange("customSqft", e.target.value ? Number(e.target.value) : undefined)}
              placeholder={isBR ? "Ex: 200" : "e.g. 2400"}
              min={10}
              className={errors.customSqft ? "border-destructive" : ""}
            />
            {errors.customSqft && <p className="text-xs text-destructive mt-1">{errors.customSqft}</p>}
          </div>
        )}

        <div>
          <Label>Number of Floors *</Label>
          <p className="text-xs text-muted-foreground mb-2">Select all that apply (e.g. 2 Floors + Basement)</p>
          <div className="space-y-2">
            {FLOOR_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  floors.includes(opt.value)
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <Checkbox
                  checked={floors.includes(opt.value)}
                  onCheckedChange={() => toggleFloor(opt.value)}
                />
                <span className="text-sm font-medium">{opt.label}</span>
              </label>
            ))}
          </div>
          {errors.floors && <p className="text-xs text-destructive mt-1">{errors.floors}</p>}
        </div>

        <div>
          <Label>Lot Size (optional)</Label>
          <Input
            value={lotSize}
            onChange={(e) => onFieldChange("lotSize", e.target.value)}
            placeholder={isBR ? "Ex: 300 m²" : "e.g. 0.25 acres or 10,890 sqft"}
          />
        </div>
      </div>
    </div>
  );
};

export default StepDetails;
