import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Patient } from "@/pages/Index";
import { Activity, Calculator } from "lucide-react";

interface SimulationParams {
  dose: string;
  halfLife: string;
  clearance: string;
  volumeDistribution: string;
}

interface PKControlPanelProps {
  patients: Patient[];
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  availableDrugs: string[];
  selectedDrug: string;
  setSelectedDrug: (drug: string) => void;
  simulationParams: SimulationParams;
  setSimulationParams: (params: SimulationParams) => void;
  onGenerateSimulation: () => void;
  enableDoseIntervalAdjust?: boolean;
}

const PKControlPanel = ({
  patients,
  selectedPatientId,
  setSelectedPatientId,
  availableDrugs,
  selectedDrug,
  setSelectedDrug,
  simulationParams,
  setSimulationParams,
  onGenerateSimulation,
  enableDoseIntervalAdjust
}: PKControlPanelProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Patient Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="patientSelect">Select Patient</Label>
            <Select
              value={selectedPatientId}
              onValueChange={setSelectedPatientId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name} (Age: {patient.age})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {availableDrugs.length > 0 && (
            <div>
              <Label htmlFor="drugSelect">Select Drug</Label>
              <Select
                value={selectedDrug}
                onValueChange={setSelectedDrug}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a drug" />
                </SelectTrigger>
                <SelectContent>
                  {availableDrugs.map((drug) => (
                    <SelectItem key={drug} value={drug}>
                      {drug}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Simulation Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="dose">Initial Dose (mg)</Label>
            <Input
              id="dose"
              type="number"
              value={simulationParams.dose}
              onChange={(e) => setSimulationParams({...simulationParams, dose: e.target.value})}
              placeholder="100"
            />
          </div>

          <div>
            <Label htmlFor="halfLife">Half-life (hours)</Label>
            <Input
              id="halfLife"
              type="number"
              step="0.1"
              value={simulationParams.halfLife}
              onChange={(e) => setSimulationParams({...simulationParams, halfLife: e.target.value})}
              placeholder="6.0"
            />
          </div>

          {/* 용량/투여간격 조정 UI */}
          {enableDoseIntervalAdjust && (
            <div className="space-y-2 mt-4 p-2 bg-slate-50 dark:bg-slate-800 rounded">
              <div className="font-semibold mb-1">용량/투여 간격 조정</div>
              <div className="flex gap-2 items-center">
                <Label htmlFor="doseAdjust" className="text-xs">용량 (mg)</Label>
                <Input
                  id="doseAdjust"
                  type="number"
                  value={simulationParams.dose}
                  onChange={e => setSimulationParams({...simulationParams, dose: e.target.value})}
                  className="w-24"
                />
                <Label htmlFor="intervalAdjust" className="text-xs ml-4">투여 간격 (half-life, h)</Label>
                <Input
                  id="intervalAdjust"
                  type="number"
                  step="0.1"
                  value={simulationParams.halfLife}
                  onChange={e => setSimulationParams({...simulationParams, halfLife: e.target.value})}
                  className="w-24"
                />
                <Button
                  type="button"
                  onClick={onGenerateSimulation}
                  className="ml-4"
                  disabled={!simulationParams.dose || !simulationParams.halfLife}
                >
                  시뮬레이션 적용
                </Button>
              </div>
              <div className="text-xs text-muted-foreground mt-1">* 용량 또는 투여 간격을 조정 후 '시뮬레이션 적용'을 누르면 바로 반영됩니다.</div>
            </div>
          )}

          <Button 
            onClick={onGenerateSimulation}
            className="w-full mt-4"
            disabled={!simulationParams.dose || !simulationParams.halfLife}
          >
            Generate Simulation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PKControlPanel;
