
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Patient, BloodTest } from "@/pages/Index";

interface PKDataSummaryProps {
  currentPatient: Patient;
  selectedDrug: string;
  selectedDrugTests: BloodTest[];
  showSimulation: boolean;
  simulationParams: {
    dose: string;
    halfLife: string;
    clearance: string;
    volumeDistribution: string;
  };
}

const PKDataSummary = ({
  currentPatient,
  selectedDrug,
  selectedDrugTests,
  showSimulation,
  simulationParams
}: PKDataSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>PK Analysis Summary</CardTitle>
        <CardDescription>
          Pharmacokinetic analysis for {currentPatient.name} - {selectedDrug}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h4 className="font-medium">Patient Information</h4>
            <div className="text-sm space-y-1">
              <p><span className="text-muted-foreground">Age:</span> {currentPatient.age} years</p>
              <p><span className="text-muted-foreground">Weight:</span> {currentPatient.weight} kg</p>
              <p><span className="text-muted-foreground">BMI:</span> {(currentPatient.weight / Math.pow(currentPatient.height / 100, 2)).toFixed(1)}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Data Points</h4>
            <div className="text-sm space-y-1">
              <p><span className="text-muted-foreground">Blood Tests:</span> {selectedDrugTests.length}</p>
              <p><span className="text-muted-foreground">Time Range:</span> {
                selectedDrugTests.length > 0 
                  ? `${Math.min(...selectedDrugTests.map(t => t.timeAfterDose))} - ${Math.max(...selectedDrugTests.map(t => t.timeAfterDose))} h`
                  : "No data"
              }</p>
              <p><span className="text-muted-foreground">Dose Range:</span> {
                selectedDrugTests.length > 0 
                  ? `${Math.min(...selectedDrugTests.map(t => t.concentration)).toFixed(2)} - ${Math.max(...selectedDrugTests.map(t => t.concentration)).toFixed(2)} ng/mL`
                  : "No data"
              }</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Model Performance</h4>
            <div className="text-sm space-y-1">
              {showSimulation ? (
                <>
                  <p><span className="text-muted-foreground">Model:</span> First-order elimination</p>
                  <p><span className="text-muted-foreground">Parameters:</span> {Object.keys(simulationParams).filter(key => simulationParams[key as keyof typeof simulationParams]).length} defined</p>
                  <p><span className="text-muted-foreground">Prediction:</span> 24h timeframe</p>
                </>
              ) : (
                <p className="text-muted-foreground">No simulation available</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PKDataSummary;
