import { DRAFTING_SERVICES, DESIGN_SERVICES, OPTIONAL_SERVICES } from "../types";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PenTool } from "lucide-react";

interface Props {
  draftingServices: string[];
  designServices: string[];
  optionalServices: string[];
  onFieldChange: (field: string, value: string[]) => void;
  errors: Record<string, string>;
}

const toggle = (arr: string[], id: string) =>
  arr.includes(id) ? arr.filter((v) => v !== id) : [...arr, id];

const StepServices = ({ draftingServices, designServices, optionalServices, onFieldChange }: Props) => {
  const hasFullSet = draftingServices.includes("full_construction_set");

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <PenTool className="mx-auto h-10 w-10 text-primary mb-3" />
        <h2 className="text-2xl font-serif font-bold text-foreground">Services Needed</h2>
        <p className="text-muted-foreground mt-1">Select all services you need for this project.</p>
      </div>

      <div className="max-w-lg mx-auto space-y-6">
        <div>
          <Label className="text-base font-semibold">Drafting & Documentation</Label>
          <div className="space-y-2 mt-2">
            {DRAFTING_SERVICES.map((svc) => (
              <label key={svc.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/40 cursor-pointer transition-all">
                <Checkbox
                  checked={draftingServices.includes(svc.id)}
                  onCheckedChange={() => onFieldChange("draftingServices", toggle(draftingServices, svc.id))}
                />
                <span className="text-sm">{svc.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-semibold">Design Services</Label>
          <div className="space-y-2 mt-2">
            {DESIGN_SERVICES.map((svc) => (
              <label key={svc.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/40 cursor-pointer transition-all">
                <Checkbox
                  checked={designServices.includes(svc.id)}
                  onCheckedChange={() => onFieldChange("designServices", toggle(designServices, svc.id))}
                />
                <span className="text-sm">{svc.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-semibold">3D Visualization (optional add-ons)</Label>
          <div className="space-y-2 mt-2">
            {OPTIONAL_SERVICES.map((svc) => {
              const isFreeExterior = svc.id === "3d_exterior" && hasFullSet;
              const displayPrice = isFreeExterior ? 0 : svc.price;
              return (
                <label key={svc.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border hover:border-primary/40 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={optionalServices.includes(svc.id)}
                      onCheckedChange={() => onFieldChange("optionalServices", toggle(optionalServices, svc.id))}
                    />
                    <span className="text-sm">{svc.label}</span>
                  </div>
                  <span className={`text-xs font-semibold ${isFreeExterior ? "text-chart-2" : "text-primary"}`}>
                    {isFreeExterior ? "Included" : `+$${displayPrice}`}
                  </span>
                </label>
              );
            })}
          </div>
          {hasFullSet && (
            <p className="text-xs text-chart-2 mt-2">
              ✓ 3D Exterior Rendering is included with Full Construction Document Set.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepServices;
