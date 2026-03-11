import { Agreement, AgreementStatus } from "@/lib/model/agreement.types";
import { formatDate } from "@/lib/helpers/date.helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { ArrowUpRight, CheckCircle2, Clock3, TriangleAlert, Wallet, X } from "lucide-react";

type TimelineStepState = "complete" | "current" | "upcoming" | "alert";

interface TimelineStep {
  label: string;
  detail: string;
  icon: typeof CheckCircle2;
  state: TimelineStepState;
}

function getStepClasses(state: TimelineStepState) {
  switch (state) {
    case "complete":
      return {
        marker: "border-primary-200 bg-primary text-primary-foreground",
        icon: "text-primary-foreground",
        title: "text-foreground",
        detail: "text-muted-foreground",
      };
    case "current":
      return {
        marker: "border-secondary-200 bg-white text-secondary-800 shadow-xs",
        icon: "text-secondary-700",
        title: "text-foreground",
        detail: "text-muted-foreground",
      };
    case "alert":
      return {
        marker: "border-accent-200 bg-accent-100 text-accent-700",
        icon: "text-accent-700",
        title: "text-foreground",
        detail: "text-muted-foreground",
      };
    default:
      return {
        marker: "border-border/70 bg-white/70 text-muted-foreground",
        icon: "text-muted-foreground",
        title: "text-foreground/78",
        detail: "text-muted-foreground",
      };
  }
}

export function TimelineCard({ agreement }: { agreement: Agreement }) {
  const timelineSteps: TimelineStep[] = [
    {
      label: "Agreement created",
      detail: agreement.createdAt ? `on ${formatDate(agreement.createdAt)}` : "Contract deployed on blockchain",
      icon: CheckCircle2,
      state: "complete",
    },
    {
      label: "Deposit filled",
      detail: agreement.filledAt
        ? `on ${formatDate(agreement.filledAt)}`
        : agreement.status === AgreementStatus.pending
          ? "Awaiting depositor funding"
          : agreement.status === AgreementStatus.canceled
            ? "Agreement closed before the deposit was filled"
            : "Deposit step not completed yet",
      icon: Wallet,
      state: agreement.filledAt ? "complete" : agreement.status === AgreementStatus.pending ? "current" : "upcoming",
    },
  ];

  if (agreement.status === AgreementStatus.disputed || agreement.disputedAt) {
    timelineSteps.push({
      label: "Dispute opened",
      detail: agreement.disputedAt
        ? `on ${formatDate(agreement.disputedAt)}`
        : "A dispute can be opened before release",
      icon: TriangleAlert,
      state: agreement.disputedAt ? "alert" : "upcoming",
    });
  }

  if (agreement.status !== AgreementStatus.canceled || agreement.releasedAt) {
    timelineSteps.push({
      label: "Funds released",
      detail: agreement.releasedAt
        ? `on ${formatDate(agreement.releasedAt)}`
        : agreement.status === AgreementStatus.filled
          ? "Awaiting release action"
          : agreement.status === AgreementStatus.disputed
            ? "Awaiting dispute resolution"
            : `Available after ${formatDate(agreement.deadline)}`,
      icon: ArrowUpRight,
      state: agreement.releasedAt
        ? "complete"
        : agreement.status === AgreementStatus.filled || agreement.status === AgreementStatus.disputed
          ? "current"
          : "upcoming",
    });
  }

  if (agreement.status === AgreementStatus.canceled || agreement.canceledAt) {
    timelineSteps.push({
      label: "Agreement canceled",
      detail: agreement.canceledAt ? `on ${formatDate(agreement.canceledAt)}` : "Contract canceled",
      icon: X,
      state: agreement.canceledAt ? "complete" : "current",
    });
  }

  return (
    <Card className="bg-white/86">
      <CardHeader>
        <CardTitle className="text-3xl">Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        {timelineSteps.map((step, index) => {
          const Icon = step.icon;
          const classes = getStepClasses(step.state);
          const isLast = index === timelineSteps.length - 1;

          return (
            <div key={step.label} className="relative flex gap-4 pb-6 last:pb-0">
              {!isLast && (
                <div className="absolute left-[1.15rem] top-10 h-[calc(100%-1.5rem)] w-px bg-border/70" />
              )}
              <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${classes.marker}`}>
                <Icon className={`h-4 w-4 ${classes.icon}`} />
              </div>
              <div className="pt-1">
                <p className={`text-sm font-semibold ${classes.title}`}>{step.label}</p>
                <p className={`mt-1 text-sm leading-6 ${classes.detail}`}>{step.detail}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  )
};
