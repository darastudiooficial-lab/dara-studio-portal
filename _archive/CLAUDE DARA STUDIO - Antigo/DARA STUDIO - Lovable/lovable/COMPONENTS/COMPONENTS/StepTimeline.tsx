import { RUSH_OPTIONS, RUSH_REQUIRED_DOCS, UPLOAD_DOC_TYPES } from "../types";
import { Clock, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface Props {
  rushService: string;
  uploadedFileNames: string[];
  onFieldChange: (field: string, value: string) => void;
  error?: string;
}

const StepTimeline = ({ rushService, uploadedFileNames, onFieldChange, error }: Props) => {
  // Check if required docs are uploaded
  const hasPlotPlan = uploadedFileNames.some(n => 
    n.toLowerCase().includes("survey") || n.toLowerCase().includes("plot") || n.toLowerCase().includes("plat")
  );
  const hasSitePhotos = uploadedFileNames.some(n => 
    n.toLowerCase().includes("photo") || n.toLowerCase().includes("img") || n.toLowerCase().includes("pic")
  );
  const hasMeasurements = uploadedFileNames.some(n => 
    n.toLowerCase().includes("measure") || n.toLowerCase().includes("dimension")
  );

  // Simple eligibility: at least docs uploaded (we check count >= 3 as proxy)
  const rushEligible = uploadedFileNames.length >= 3;

  const docChecks = [
    { id: "plot_plan", label: "Property Survey / Plot Plan uploaded", met: hasPlotPlan || uploadedFileNames.length >= 1 },
    { id: "site_photos", label: "Site Photos uploaded", met: hasSitePhotos || uploadedFileNames.length >= 2 },
    { id: "measurements", label: "Measurements provided", met: hasMeasurements || uploadedFileNames.length >= 3 },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Clock className="mx-auto h-10 w-10 text-primary mb-3" />
        <h2 className="text-2xl font-serif font-bold text-foreground">Rush Fees</h2>
        <p className="text-muted-foreground mt-1">Need your project sooner? Rush service is optional.</p>
      </div>

      <div className="max-w-lg mx-auto space-y-5">
        {/* Delivery Information */}
        <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-3">
          <h3 className="font-semibold text-sm text-foreground">Standard Delivery Timeline</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">Design Preview</span>
              <p className="text-xs">8–16 Business Days</p>
              <p className="text-xs">Initial layout and visual direction are delivered for review.</p>
            </div>
            <div className="pt-2">
              <span className="font-medium text-foreground">Final Drawing Set</span>
              <p className="text-xs">25–30 Business Days After Approval</p>
              <p className="text-xs">Complete architectural drawing package delivered in digital format.</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground italic">
            Timeline starts from receipt of required project information including proposal approval, initial payment and site documentation.
            Timeline may vary depending on project complexity, requested revisions and technical coordination.
          </p>
        </div>

        {/* Documentation Check */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">Do you have the following information?</p>
          <div className="space-y-2">
            {docChecks.map((doc) => (
              <div key={doc.id} className="flex items-center gap-2 p-2 rounded-md border border-border">
                {doc.met ? (
                  <CheckCircle2 className="h-4 w-4 text-chart-2 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
                <span className={`text-sm ${doc.met ? "text-foreground" : "text-muted-foreground"}`}>{doc.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rush Options */}
        {rushEligible ? (
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Rush Service (optional)</p>
            <p className="text-xs text-muted-foreground mb-3">Rush service prioritizes your project in our workflow and reduces the delivery timeline.</p>
            
            <button
              type="button"
              onClick={() => onFieldChange("rushService", "")}
              className={`w-full p-4 rounded-lg border text-left transition-all mb-2 ${
                !rushService
                  ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <span className="font-medium text-sm">Standard Delivery (no rush fee)</span>
            </button>

            {RUSH_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onFieldChange("rushService", opt.value)}
                className={`w-full p-4 rounded-lg border text-left transition-all mb-2 ${
                  rushService === opt.value
                    ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{opt.label}</span>
                  <span className="text-xs font-semibold text-chart-3 bg-chart-3/15 px-2 py-0.5 rounded">
                    +{opt.rushPercent}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex gap-2 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-destructive">Rush Service is not available</p>
              <p className="text-xs text-muted-foreground mt-1">
                Required documentation is missing. Upload Property Survey, Site Photos and Measurements in the Files step to enable rush delivery.
              </p>
            </div>
          </div>
        )}
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default StepTimeline;
