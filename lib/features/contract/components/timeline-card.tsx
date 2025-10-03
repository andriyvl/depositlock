import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Agreement } from "@/lib/model/agreement.types";
import { formatDate } from "@/lib/helpers/date.helpers";

export function TimelineCard({ agreement }: { agreement: Agreement }) {
  return (
    <Card className="shadow-lg border-0 bg-background/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
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
          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${agreement.filledAt ? 'bg-tertiary-500' : 'bg-muted border-2 border-muted-foreground'
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
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-accent-500">
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
          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${agreement.releasedAt ? 'bg-secondary-500' : 'bg-muted border-2 border-muted-foreground'
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
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${agreement.canceledAt ? 'bg-muted-500' : 'bg-muted border-2 border-muted-foreground'
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