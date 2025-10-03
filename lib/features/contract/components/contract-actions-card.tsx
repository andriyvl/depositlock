import { Card, CardContent, CardTitle, CardHeader, CardDescription } from "@/lib/components/ui/card";

import { useAuth } from "../../auth/auth.hook";
import { ContractActions } from "./contract-actions";
import { Agreement } from "@/lib/model/agreement.types";

export const ContractActionsCard = ({ agreement, contractId }: { agreement: Agreement, contractId: string }) => {
    const auth = useAuth();

    return (
        <>
            {auth.isAuthenticated && agreement &&
                <Card className="shadow-lg border-0 bg-background/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Contract Actions</CardTitle>
                        <CardDescription>
                            Available actions based on your role and contract status
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ContractActions
                            agreement={agreement}
                            contractAddress={contractId!}
                        />
                    </CardContent>
                </Card>
            }
        </>
    );
};