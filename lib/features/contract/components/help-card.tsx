import { Button } from "@/lib/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card";

export const HelpCard = () => {
    return (
        <Card className="shadow-lg border-0 bg-background/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Have questions about this deposit agreement?
                </p>
                <Button variant="outline" className="w-full justify-start">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
    );
};