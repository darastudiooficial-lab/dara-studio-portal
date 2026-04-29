import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const StepOverview = ({ value, onChange }: Props) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <FileText className="mx-auto h-10 w-10 text-primary mb-3" />
      <h2 className="text-2xl font-serif font-bold text-foreground">Project Overview</h2>
      <p className="text-muted-foreground mt-1">
        Briefly describe your project. This helps us understand your vision.
      </p>
    </div>

    <div className="max-w-lg mx-auto">
      <Label>Project Description (optional)</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder="Describe your project — goals, ideas, any special requirements..."
        className="mt-2"
      />
      <p className="text-xs text-muted-foreground mt-2">
        You can skip this step if you prefer to share details later.
      </p>
    </div>
  </div>
);

export default StepOverview;
