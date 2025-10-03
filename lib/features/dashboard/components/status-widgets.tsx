import { Card, CardContent } from "@/lib/components/ui/card";
import { Shield, DollarSign, TrendingUp, Clock } from "lucide-react";

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

export function StatusWidgets({ stats }: StatusWidgetsProps) {
  return (
    <div className="grid lg:grid-cols-6 lg:grid-rows-1 grid-cols-3 grid-rows-2 gap-6 mb-8">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-primary-50 to-primary-100">
        <CardContent className="sm:p-6 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-600">Total</p>
              <p className="text-2xl sm:text-3xl font-bold text-primary-700">{stats.total}</p>
            </div>
            <div className="w-6 h-6 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-400 to-primary-500 rounded-2xl flex items-center justify-center">
              <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-lg bg-gradient-to-br from-accent-50 to-accent-100">
        <CardContent className="sm:p-6 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-accent-600">Pending</p>
              <p className="text-2xl sm:text-3xl font-bold text-accent-700">{stats.pending}</p>
            </div>
            <div className="w-6 h-6 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-400 to-accent-500 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-lg bg-gradient-to-br from-tertiary-50 to-tertiary-100">
        <CardContent className="sm:p-6 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-tertiary-600">Filled</p>
              <p className="text-2xl sm:text-3xl font-bold text-tertiary-700">{stats.filled}</p>
            </div>
            <div className="w-6 h-6 sm:w-12 sm:h-12 bg-gradient-to-br from-tertiary-400 to-tertiary-500 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-lg bg-gradient-to-br from-destructive-50 to-destructive-100">
        <CardContent className="sm:p-6 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-destructive-600">Disputed</p>
              <p className="text-2xl sm:text-3xl font-bold text-destructive-700">{stats.disputed}</p>
            </div>
            <div className="w-6 h-6 sm:w-12 sm:h-12 bg-gradient-to-br from-destructive-400 to-destructive-500 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-lg bg-gradient-to-br from-secondary-50 to-secondary-100">
        <CardContent className="sm:p-6 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Released</p>
              <p className="text-2xl sm:text-3xl font-bold text-secondary-700">{stats.released}</p>
            </div>
            <div className="w-6 h-6 sm:w-12 sm:h-12 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-2xl flex items-center justify-center">
              <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-lg bg-muted">
        <CardContent className="sm:p-6 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Canceled</p>
              <p className="text-2xl sm:text-3xl font-bold text-muted-foreground">{stats.cancelled}</p>
            </div>
            <div className="w-6 h-6 sm:w-12 sm:h-12 bg-muted-foreground rounded-2xl flex items-center justify-center">
              <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}