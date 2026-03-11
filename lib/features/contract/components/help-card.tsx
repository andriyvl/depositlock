import { Button } from "@/lib/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card";
import Link from "next/link";

export const HelpCard = () => {
    return (
        <Card className="bg-white/86">
              <CardHeader>
                <CardTitle className="text-3xl">Need help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Have questions about this deposit agreement?
                </p>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/contact">Contact support</Link>
                </Button>
              </CardContent>
            </Card>
    );
};
