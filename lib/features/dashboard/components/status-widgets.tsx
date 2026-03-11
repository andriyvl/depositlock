import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { CircleDollarSign, Clock3, Layers3, Shield, Sparkles, TriangleAlert, type LucideIcon } from "lucide-react";

interface StatusWidgetsProps {
  stats: {
    total: number;
    pending: number;
    filled: number;
    disputed: number;
    released: number;
    cancelled: number;
  };
}

interface WidgetConfigItem {
  key: keyof StatusWidgetsProps["stats"];
  label: string;
  valueKey: keyof StatusWidgetsProps["stats"];
  icon: LucideIcon;
  panelClassName: string;
  iconClassName: string;
  labelClassName?: string;
  valueClassName?: string;
}

const widgetConfig: WidgetConfigItem[] = [
  {
    key: "total",
    label: "Total",
    valueKey: "total",
    icon: Shield,
    panelClassName: "bg-white/86",
    iconClassName: "bg-primary text-primary-foreground",
  },
  {
    key: "pending",
    label: "Pending",
    valueKey: "pending",
    icon: CircleDollarSign,
    panelClassName: "bg-primary-50/92",
    iconClassName: "bg-primary text-primary-foreground",
  },
  {
    key: "filled",
    label: "Filled",
    valueKey: "filled",
    icon: Layers3,
    panelClassName: "bg-tertiary-50/92",
    iconClassName: "bg-tertiary-500 text-white",
  },
  {
    key: "disputed",
    label: "Disputed",
    valueKey: "disputed",
    icon: TriangleAlert,
    panelClassName: "bg-destructive-50/92",
    iconClassName: "bg-destructive text-white",
  },
  {
    key: "released",
    label: "Released",
    valueKey: "released",
    icon: Sparkles,
    panelClassName: "bg-secondary text-secondary-foreground",
    iconClassName: "bg-white/12 text-white",
    labelClassName: "text-white/72",
    valueClassName: "text-white",
  },
  {
    key: "cancelled",
    label: "Canceled",
    valueKey: "cancelled",
    icon: Clock3,
    panelClassName: "bg-muted/80",
    iconClassName: "bg-white text-secondary-700",
  },
] as const;

export function StatusWidgets({ stats }: StatusWidgetsProps) {
  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {widgetConfig.map((widget) => {
        const Icon = widget.icon;
        const value = stats[widget.valueKey];

        return (
          <Card key={widget.key} className={`border border-border/70 ${widget.panelClassName}`}>
            <CardHeader className="pb-0 sm:pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg">{widget.label}</CardTitle>
                <div className={`flex h-11 w-11 items-center justify-center rounded-full ${widget.iconClassName}`}>
                  <Icon className="h-[1.125rem] w-[1.125rem]" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="flex min-h-[4] flex-col">
                <div className="mt-auto">
                  <p className={`font-display text-[3.6rem] font-black leading-none tracking-[-0.07em] ${widget.valueClassName || "text-foreground"}`}>
                    {value}
                  </p>
                  <p className={`mt-2 text-sm font-medium ${widget.labelClassName || "text-secondary-700/82"}`}>
                    agreements
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
