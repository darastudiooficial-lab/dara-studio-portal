import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";

interface Props {
  agreeTerms: boolean;
  notes: string;
  onFieldChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}

const StepAgreement = ({ agreeTerms, notes, onFieldChange, errors }: Props) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <ShieldCheck className="mx-auto h-10 w-10 text-primary mb-3" />
      <h2 className="text-2xl font-serif font-bold text-foreground">Review & Submit</h2>
      <p className="text-muted-foreground mt-1">Almost done! Add any final notes and submit your request.</p>
    </div>

    <div className="max-w-lg mx-auto space-y-5">
      <div>
        <Label>Additional Notes (optional)</Label>
        <Textarea
          value={notes}
          onChange={(e) => onFieldChange("notes", e.target.value)}
          rows={4}
          placeholder="Anything else we should know about your project?"
          className="mt-1"
        />
      </div>

      <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-3">
        <h3 className="font-semibold text-sm">What happens next?</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Our team reviews your project details within 2–3 business days</li>
          <li>• You'll receive a detailed proposal via email</li>
          <li>• We may reach out for additional information if needed</li>
          <li>• No commitment required — this is a free estimate</li>
        </ul>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <Checkbox
          checked={agreeTerms}
          onCheckedChange={(checked) => onFieldChange("agreeTerms", !!checked)}
          className="mt-0.5"
        />
        <span className="text-sm text-muted-foreground">
          I understand this is an approximate estimate and final pricing may vary based on project complexity and detailed requirements. *
        </span>
      </label>
      {errors.agreeTerms && <p className="text-xs text-destructive">{errors.agreeTerms}</p>}
    </div>
  </div>
);

export default StepAgreement;
