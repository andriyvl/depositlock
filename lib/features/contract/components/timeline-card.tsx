import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Agreement } from "@/lib/model/agreement.types";
import { formatDate } from "@/lib/helpers/date.helpers";

export function TimelineCard({ agreement }: { agreement: Agreement }) {
  return (
    <Card className="bg-white/86">
      <CardHeader>
        <CardTitle className="text-3xl">Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-start space-x-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CheckCircle className="w-3 h-3 text-white" />
          </div>
          <div>
            <p className="font-medium text-sm">Agreement Created</p>
            <p className="text-xs text-muted-foreground">
              {agreement?.createdAt ? `on ${formatDate(agreement.createdAt)}` : 'Contract deployed on blockchain'}
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${agreement.filledAt ? 'bg-tertiary-500 text-white' : 'bg-muted border-2 border-muted-foreground'
            }`}>
            {agreement.filledAt ? (
              <CheckCircle className="w-3 h-3 text-white" />
            ) : (
              <div className="w-2 h-2 bg-muted-foreground rounded-full" />
            )}
          </div>
          <div>
            <p className="font-medium text-sm">Deposit Filled</p>
            <p className="text-xs text-muted-foreground">
              {agreement?.filledAt ? `on ${formatDate(agreement.filledAt)}` : 'Pending'}
            </p>
          </div>
        </div>

        {agreement.disputedAt && (
          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-500">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
            <div>
              <p className="font-medium text-sm">Dispute Raised</p>
              <p className="text-xs text-muted-foreground">
                {agreement.disputedAt ? `on ${formatDate(agreement.disputedAt)}` : `after ${formatDate(agreement.deadline)}`}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-start space-x-3">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${agreement.releasedAt ? 'bg-secondary-500 text-white' : 'bg-muted border-2 border-muted-foreground'
            }`}>
            {agreement.releasedAt ? (
              <CheckCircle className="w-3 h-3 text-white" />
            ) : (
              <div className="w-2 h-2 bg-muted-foreground rounded-full" />
            )}
          </div>
          <div>
            <p className="font-medium text-sm">Funds Released</p>
            <p className="text-xs text-muted-foreground">
              {agreement.releasedAt ? `on ${formatDate(agreement.releasedAt)}` : `after ${formatDate(agreement.deadline)}`}
            </p>
          </div>
        </div>


        {agreement.canceledAt && (
          <div className="flex items-start space-x-3">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${agreement.canceledAt ? 'bg-muted-500 text-white' : 'bg-muted border-2 border-muted-foreground'
              }`}>
              {agreement.canceledAt ? (
                <CheckCircle className="w-3 h-3 text-white" />
              ) : (
                <div className="w-2 h-2 bg-muted-foreground rounded-full" />
              )}
            </div>
            <div>
              <p className="font-medium text-sm">Contract Canceled</p>
              <p className="text-xs text-muted-foreground">
                on {formatDate(agreement.canceledAt)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
};
