import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PatientRegistration from "@/components/PatientRegistration";
import StepWorkflow from "@/components/StepWorkflow";
import { User, Activity } from "lucide-react";
import { Pill, FlaskConical, TrendingUp } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export interface Patient {
  id: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: string;
  medicalHistory: string;
  allergies: string;
  createdAt: Date;
}

export interface Prescription {
  id: string;
  patientId: string;
  drugName: string;
  dosage: number;
  unit: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  route: string;
  prescribedBy: string;
  indication?: string;
  tdmTarget?: string;
  tdmTargetValue?: string;
}

export interface BloodTest {
  id: string;
  patientId: string;
  drugName: string;
  concentration: number;
  unit: string;
  timeAfterDose: number;
  testDate: Date;
  notes: string;
}

export interface DrugAdministration {
  id: string;
  patientId: string;
  drugName: string;
  route: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  dose: number;
  unit: string;
  isIVInfusion: boolean;
  infusionTime?: number; // IV 주입시간(분)
  administrationTime?: number; // 경구 등 투약시간(분)
}

const Index = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [bloodTests, setBloodTests] = useState<BloodTest[]>([]);
  const [drugAdministrations, setDrugAdministrations] = useState<DrugAdministration[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const addPatient = (patient: Patient) => {
    setPatients([...patients, patient]);
  };

  const addPrescription = (prescription: Prescription) => {
    setPrescriptions([...prescriptions, prescription]);
  };

  const addBloodTest = (bloodTest: BloodTest) => {
    setBloodTests([...bloodTests, bloodTest]);
  };

  const addDrugAdministration = (drugAdministration: DrugAdministration) => {
    setDrugAdministrations([...drugAdministrations, drugAdministration]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
      <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-blue-600 dark:text-blue-300" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">PK Friends</h1>
                <p className="text-sm text-slate-600 dark:text-slate-300">No 1. 약동학 분석 시스템</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-slate-600 dark:text-slate-300">등록된 환자 수: {patients.length}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">선택된 환자: {selectedPatient?.name || "None"}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 dark:text-slate-300">{isDark ? "다크모드" : "라이트모드"}</span>
                <Switch checked={isDark} onCheckedChange={setIsDark} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="workflow" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white shadow-sm">
            <TabsTrigger value="workflow" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              시뮬레이션
            </TabsTrigger>
            <TabsTrigger value="management" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              환자 관리
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workflow">
            <StepWorkflow
              patients={patients}
              prescriptions={prescriptions}
              bloodTests={bloodTests}
              selectedPatient={selectedPatient}
              setSelectedPatient={setSelectedPatient}
              onAddPatient={addPatient}
              onAddPrescription={addPrescription}
              onAddBloodTest={addBloodTest}
              onAddDrugAdministration={addDrugAdministration}
              drugAdministrations={drugAdministrations}
            />
          </TabsContent>

          <TabsContent value="management">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  환자 관리
                </CardTitle>
                <CardDescription>
                  환자 관리 및 히스토리 조회
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PatientRegistration 
                  onAddPatient={addPatient}
                  patients={patients}
                  selectedPatient={selectedPatient}
                  setSelectedPatient={setSelectedPatient}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
