import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FolderKanban, Send, Upload, UserPlus, Receipt } from "lucide-react";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    { label: "New Project", icon: FolderKanban, url: "/adm/projects" },
    { label: "Send Proposal", icon: Send, url: "/adm/projects" },
    { label: "Upload Drawings", icon: Upload, url: "/adm/drawings" },
    { label: "Invite Client", icon: UserPlus, url: "/adm/companies" },
    { label: "Create Invoice", icon: Receipt, url: "/adm/payments" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <Button
          key={action.label}
          variant="outline"
          onClick={() => navigate(action.url)}
          className="gap-2 h-9 px-4 text-sm font-medium"
        >
          <action.icon className="h-4 w-4" />
          {action.label}
        </Button>
      ))}
    </div>
  );
};

export default QuickActions;
