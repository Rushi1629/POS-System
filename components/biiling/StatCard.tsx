import { FileText } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";

const StatCard = ({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: typeof FileText;
  accent: string;
}) => {
  return (
    <Card className="border-border/60 shadow-soft">
      <CardContent className="p-5 flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <div className="mt-2 text-2xl font-semibold text-foreground">
            {value}
          </div>
        </div>
        <div
          className={cn(
            "h-11 w-11 rounded-xl flex items-center justify-center",
            accent,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
