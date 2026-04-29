import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit } from "lucide-react";

const AdminAICodeCheck = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">AI Code Check</h1>
        <p className="text-sm text-muted-foreground">Upload drawings for automated compliance analysis</p>
      </div>
      <Card className="border-none shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <BrainCircuit className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">AI Drawing Analysis</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Upload architectural drawings for automated building code compliance checks. AI will analyze setbacks, egress, accessibility, and structural requirements.
          </p>
          <Badge variant="secondary" className="mt-4">Coming Soon</Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAICodeCheck;
