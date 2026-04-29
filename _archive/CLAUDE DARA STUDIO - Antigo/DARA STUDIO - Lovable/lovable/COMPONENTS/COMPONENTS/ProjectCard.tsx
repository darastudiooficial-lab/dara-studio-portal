import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, FolderOpen, MessageSquare, DollarSign } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface ProjectCardProps {
  id: string;
  name: string;
  address: string;
  status: "pending" | "in_progress" | "under_review" | "completed" | "cancelled";
  serviceType: string;
  filesCount?: number;
  messagesCount?: number;
  quotesCount?: number;
}

const ProjectCard = ({ id, name, address, status, filesCount = 0, messagesCount = 0, quotesCount = 0 }: ProjectCardProps) => {
  const { t } = useLanguage();

  const statusConfig = {
    pending: { label: t("projectCard.briefing"), variant: "secondary" as const },
    in_progress: { label: t("projectCard.inDevelopment"), variant: "default" as const },
    under_review: { label: t("projectCard.underReview"), variant: "outline" as const },
    completed: { label: t("projectCard.completed"), variant: "default" as const },
    cancelled: { label: t("projectCard.cancelled"), variant: "destructive" as const },
  };

  const statusInfo = statusConfig[status] || statusConfig.pending;

  return (
    <Card className="hover:border-primary/50 transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{name}</h3>
              <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="text-sm truncate">{address}</span>
              </div>
            </div>
            <Badge variant={statusInfo.variant} className="flex-shrink-0">{statusInfo.label}</Badge>
          </div>
        </div>
        <div className="p-4 grid grid-cols-3 gap-4 border-b border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><FolderOpen className="h-4 w-4" /><span>{filesCount} {t("projectCard.files")}</span></div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><MessageSquare className="h-4 w-4" /><span>{messagesCount} {t("projectCard.msgs")}</span></div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><DollarSign className="h-4 w-4" /><span>{quotesCount} {t("projectCard.quotes")}</span></div>
        </div>
        <div className="p-4">
          <Button asChild className="w-full">
            <Link to={`/dashboard/projects/${id}`}>{t("dashboard.openProject")}<ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
