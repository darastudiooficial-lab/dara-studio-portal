import { CONSTRUCTION_TYPE, SITE_CONDITIONS } from "../types";
import { Label } from "@/components/ui/label";
import { Mountain } from "lucide-react";

interface Props {
  constructionType: string;
  siteCondition: string;
  onFieldChange: (field: string, value: string) => void;
}

const StepConditions = ({ constructionType, siteCondition, onFieldChange }: Props) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <Mountain className="mx-auto h-10 w-10 text-primary mb-3" />
      <h2 className="text-2xl font-serif font-bold text-foreground">Project Conditions</h2>
      <p className="text-muted-foreground mt-1">Tell us about the site and construction context.</p>
    </div>

    <div className="max-w-lg mx-auto space-y-5">
      <div>
        <Label>Construction Type</Label>
        <div className="grid grid-cols-1 gap-2 mt-2">
          {CONSTRUCTION_TYPE.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onFieldChange("constructionType", opt.value)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                constructionType === opt.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Site Conditions</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {SITE_CONDITIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onFieldChange("siteCondition", opt.value)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                siteCondition === opt.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        These fields are optional but help us better assess project complexity.
      </p>
    </div>
  </div>
);

export default StepConditions;
