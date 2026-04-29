import { DollarSign, TrendingUp, Target, Layers } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Props {
  low: number;
  high: number;
  total: number;
  currency: string;
  breakdown: { label: string; value: number }[];
  confidence: number;
  canCalculate: boolean;
  complexityLabel?: string;
}

const EstimatePreview = ({ low, high, currency, confidence, canCalculate, complexityLabel }: Props) => {
  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(v);

  return (
    <div className="space-y-4">
      {/* Estimate Card — Client view: only range, no breakdown */}
      {!canCalculate ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center">
          <TrendingUp className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
          <p className="text-sm text-muted-foreground">
            Your live estimate will appear here once you provide project size and type.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-accent/30 p-6 space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <DollarSign className="h-5 w-5" />
            <h3 className="font-semibold text-sm uppercase tracking-wider">Estimated Design Fee</h3>
          </div>

          <div>
            <div className="text-3xl font-bold text-foreground">
              {fmt(low)} – {fmt(high)}
            </div>
          </div>

          {/* Complexity */}
          {complexityLabel && (
            <div className="flex items-center gap-2 pt-2 border-t border-border/50">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Project Complexity</span>
              <span className="ml-auto text-sm font-semibold text-foreground">{complexityLabel}</span>
            </div>
          )}

          <p className="text-xs text-muted-foreground pt-2">
            *Approximate estimate. Final pricing may vary based on project complexity.
          </p>
        </div>
      )}

      {/* Confidence Score */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Estimate Confidence</h3>
        </div>

        <div className="flex items-center gap-3">
          <Progress value={confidence} className="h-2.5 flex-1" />
          <span className="text-lg font-bold text-primary">{confidence}%</span>
        </div>

        {confidence < 80 && (
          <p className="text-xs text-muted-foreground">
            Add more project details to improve accuracy.
          </p>
        )}
        {confidence >= 80 && confidence < 100 && (
          <p className="text-xs text-chart-2">
            Good confidence level. Upload documents to maximize accuracy.
          </p>
        )}
        {confidence >= 100 && (
          <p className="text-xs text-chart-2 font-medium">
            Maximum confidence reached!
          </p>
        )}
      </div>
    </div>
  );
};

export default EstimatePreview;
