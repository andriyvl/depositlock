import { Card, CardContent } from "@/lib/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Agreement, AgreementStatus } from "@/lib/model/agreement.types"
import { formatDate } from "@/lib/helpers/date.helpers"
import { useAppStore } from "../../store/app.store"

export const ContractEventBanner = ({ agreement }: { agreement: Agreement }) => {
    const currentAgreementStatusEvent = useAppStore(s => s.currentAgreementStatusEvent);
    const showDeposit = currentAgreementStatusEvent === AgreementStatus.filled;
    const showRelease = currentAgreementStatusEvent === AgreementStatus.released;
    const showDispute = currentAgreementStatusEvent === AgreementStatus.disputed;
    const showCancel = currentAgreementStatusEvent === AgreementStatus.canceled;

    return (
        <>
        {showDeposit && (
            <Card className="mb-6 border-0 bg-primary text-primary-foreground">
              <CardContent className="py-6">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Deposit Filled!</h3>
                    <p className="opacity-90">Your {agreement.amount} {agreement.currency} has been securely locked in the smart contract</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {showDispute && (
            <Card className="mb-6 border-0 bg-destructive text-white">
              <CardContent className="py-6">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/16">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Dispute Raised!</h3>
                    <p className="opacity-90">The contract has been disputed. Please contact the depositor to resolve the dispute, then release the agreed amount.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
  
          {showRelease && (
            <Card className="mb-6 border-0 bg-secondary text-white">
              <CardContent className="py-6">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/12">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Funds Released!</h3>
                    <p className="opacity-90">{agreement.releasedAmount} {agreement.currency} has been released from the smart contract.</p>
  
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {showCancel && (
            <Card className="mb-6 border-0 bg-muted-800 text-white">
              <CardContent className="py-6">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/12">
                    <CheckCircle className="w-6 h-6" />
          
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Contract Cancelled!</h3>
                    <p className="opacity-90">The contract has been cancelled.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
    );
};
