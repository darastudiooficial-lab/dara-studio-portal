import { US_STATES, BR_STATES, COUNTRIES } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";

interface Props {
  country: string;
  city: string;
  state: string;
  onFieldChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

const StepLocation = ({ country, city, state, onFieldChange, errors }: Props) => {
  const states = country === "BR" ? BR_STATES : US_STATES;
  const countryData = COUNTRIES.find(c => c.value === country);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <MapPin className="mx-auto h-10 w-10 text-primary mb-3" />
        <h2 className="text-2xl font-serif font-bold text-foreground">Project Location</h2>
        <p className="text-muted-foreground mt-1">Where is your project located?</p>
      </div>

      {/* Country selection */}
      <div className="flex justify-center gap-4 max-w-md mx-auto">
        {COUNTRIES.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => {
              onFieldChange("country", c.value);
              onFieldChange("state", "");
            }}
            className={`flex-1 flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all ${
              country === c.value
                ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                : "border-border bg-card hover:border-primary/40"
            }`}
          >
            <span className="text-4xl">{c.flag}</span>
            <span className="text-sm font-medium text-foreground">{c.label}</span>
            <span className="text-xs text-muted-foreground">{c.currency} · {c.unit}</span>
          </button>
        ))}
      </div>
      {errors.country && <p className="text-xs text-destructive text-center">{errors.country}</p>}

      {country && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto pt-4">
          <div>
            <Label>{country === "BR" ? "Cidade" : "City"} *</Label>
            <Input
              value={city}
              onChange={(e) => onFieldChange("city", e.target.value)}
              placeholder={country === "BR" ? "Ex: São Paulo" : "e.g. Austin"}
              className={errors.city ? "border-destructive" : ""}
            />
            {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
          </div>
          <div>
            <Label>{country === "BR" ? "Estado" : "State"} *</Label>
            <Select value={state} onValueChange={(v) => onFieldChange("state", v)}>
              <SelectTrigger className={errors.state ? "border-destructive" : ""}>
                <SelectValue placeholder={country === "BR" ? "Selecione" : "Select state"} />
              </SelectTrigger>
              <SelectContent>
                {states.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && <p className="text-xs text-destructive mt-1">{errors.state}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default StepLocation;
