import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { Button } from "@/lib/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ViewOnExplorer } from "../../shared";
import { Agreement } from "@/lib/model/agreement.types";
import Link from "next/link";

export const QuickActionsCard = ({ agreement, contractId }: { agreement: Agreement, contractId: string }) => {
    return (
        <Card className="shadow-lg border-0 bg-background/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              View Dashboard
            </Link>
          </Button>
          <ViewOnExplorer
            contractAddress={contractId!}
            networkId={agreement.networkId}
          />
        </CardContent>
      </Card>      
    );
};