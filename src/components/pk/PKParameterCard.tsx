
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface PKParameters {
  halfLife: string;
  eliminationRate: string;
  auc: string;
  maxConcentration: string;
  timeToMax: string;
}

interface PKParameterCardProps {
  pkParameters: PKParameters | null;
}

const PKParameterCard = ({ pkParameters }: PKParameterCardProps) => {
  if (!pkParameters) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Calculated PK Parameters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Half-life:</span>
            <span className="text-sm font-medium">{pkParameters.halfLife} h</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Elimination Rate:</span>
            <span className="text-sm font-medium">{pkParameters.eliminationRate} h⁻¹</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">AUC:</span>
            <span className="text-sm font-medium">{pkParameters.auc} ng·h/mL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Cmax:</span>
            <span className="text-sm font-medium">{pkParameters.maxConcentration} ng/mL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Tmax:</span>
            <span className="text-sm font-medium">{pkParameters.timeToMax} h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PKParameterCard;
