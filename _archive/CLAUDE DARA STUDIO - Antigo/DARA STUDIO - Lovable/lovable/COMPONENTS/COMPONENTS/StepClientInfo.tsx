import { CLIENT_TYPES, PROFESSIONAL_TYPES } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface Props {
  fullName: string;
  email: string;
  phone: string;
  clientType: string;
  companyName: string;
  companyAddress: string;
  onFieldChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

const StepClientInfo = ({ fullName, email, phone, clientType, companyName, companyAddress, onFieldChange, errors }: Props) => {
  const isProfessional = PROFESSIONAL_TYPES.includes(clientType);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <User className="mx-auto h-10 w-10 text-primary mb-3" />
        <h2 className="text-2xl font-serif font-bold text-foreground">About You</h2>
        <p className="text-muted-foreground mt-1">Tell us about yourself and your role.</p>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        <div>
          <Label>Full Name *</Label>
          <Input
            value={fullName}
            onChange={(e) => onFieldChange("fullName", e.target.value)}
            placeholder="John Smith"
            className={errors.fullName ? "border-destructive" : ""}
          />
          {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Email *</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => onFieldChange("email", e.target.value)}
              placeholder="john@email.com"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
          </div>
          <div>
            <Label>Phone *</Label>
            <Input
              value={phone}
              onChange={(e) => onFieldChange("phone", e.target.value)}
              placeholder="(555) 123-4567"
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <Label>Who are you? *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {CLIENT_TYPES.map((ct) => (
              <button
                key={ct.value}
                type="button"
                onClick={() => onFieldChange("clientType", ct.value)}
                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                  clientType === ct.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                {ct.label}
              </button>
            ))}
          </div>
          {errors.clientType && <p className="text-xs text-destructive mt-1">{errors.clientType}</p>}
        </div>

        {isProfessional && (
          <div className="space-y-4 p-4 rounded-lg border border-primary/20 bg-primary/5">
            <p className="text-sm font-semibold text-foreground">Company Information</p>
            <div>
              <Label>Company Name *</Label>
              <Input
                value={companyName}
                onChange={(e) => onFieldChange("companyName", e.target.value)}
                placeholder="Company name"
                className={errors.companyName ? "border-destructive" : ""}
              />
              {errors.companyName && <p className="text-xs text-destructive mt-1">{errors.companyName}</p>}
            </div>
            <div>
              <Label>Company Address *</Label>
              <Input
                value={companyAddress}
                onChange={(e) => onFieldChange("companyAddress", e.target.value)}
                placeholder="123 Main St, City, State"
                className={errors.companyAddress ? "border-destructive" : ""}
              />
              {errors.companyAddress && <p className="text-xs text-destructive mt-1">{errors.companyAddress}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepClientInfo;
