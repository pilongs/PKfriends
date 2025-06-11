import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Patient, Prescription } from "@/pages/Index";
import { Pill, ArrowRight, ArrowLeft, CheckCircle, Plus } from "lucide-react";

interface PrescriptionStepProps {
  patients: Patient[];
  prescriptions: Prescription[];
  selectedPatient: Patient | null;
  onAddPrescription: (prescription: Prescription | undefined, updatedPrescriptions: Prescription[]) => void;
  onNext: () => void;
  onPrev: () => void;
  isCompleted: boolean;
}

const TDM_DRUGS = [
  { name: "클로자핀", indications: ["조현병", "양극성 장애"], targets: [
    { type: "Trough Concentration", value: "350-600 ng/mL" },
    { type: "Peak Concentration", value: "600-1000 ng/mL" }
  ] },
  { name: "디곡신", indications: ["심부전", "심방세동"], targets: [
    { type: "Trough Concentration", value: "0.8-2.0 ng/mL" }
  ] },
  // 필요시 추가
];

const PrescriptionStep = ({
  patients,
  prescriptions,
  selectedPatient,
  onAddPrescription,
  onNext,
  onPrev,
  isCompleted
}: PrescriptionStepProps) => {
  const [formData, setFormData] = useState({
    drugName: "",
    indication: "",
    tdmTarget: "",
    tdmTargetValue: ""
  });

  const patientPrescriptions = selectedPatient 
    ? prescriptions.filter(p => p.patientId === selectedPatient.id)
    : [];
  const currentPrescription = patientPrescriptions[0];

  const selectedDrug = TDM_DRUGS.find(d => d.name === formData.drugName);
  const tdmTargets = selectedDrug ? selectedDrug.targets : [];

  const handleDrugChange = (value: string) => {
    const drug = TDM_DRUGS.find(d => d.name === value);
    setFormData({
      drugName: value,
      indication: drug?.indications[0] || "",
      tdmTarget: drug?.targets[0]?.type || "",
      tdmTargetValue: drug?.targets[0]?.value || ""
    });
  };

  const handleTargetChange = (value: string) => {
    const target = tdmTargets.find(t => t.type === value);
    setFormData(prev => ({
      ...prev,
      tdmTarget: value,
      tdmTargetValue: target?.value || ""
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    const newPrescription: Prescription = {
      id: Date.now().toString(),
      patientId: selectedPatient.id,
      drugName: formData.drugName,
      dosage: 0,
      unit: "",
      frequency: "",
      startDate: new Date(),
      route: "",
      prescribedBy: "",
      indication: formData.indication,
      tdmTarget: formData.tdmTarget,
      tdmTargetValue: formData.tdmTargetValue
    };
    const filtered = prescriptions.filter(p => p.patientId !== selectedPatient.id);
    onAddPrescription(newPrescription, filtered);
    setFormData({
      drugName: "",
      indication: "",
      tdmTarget: "",
      tdmTargetValue: ""
    });
  };

  const handleDelete = (id: string) => {
    if (!selectedPatient) return;
    const filtered = prescriptions.filter(p => p.id !== id || p.patientId !== selectedPatient.id);
    onAddPrescription(undefined, filtered);
  };

  if (!selectedPatient) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Pill className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Please select a patient first</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            2단계: TDM 약물정보
            {isCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
          </CardTitle>
          <CardDescription>
            {selectedPatient ? `${selectedPatient.name}의 TDM 약물 정보를 입력하세요.` : 'TDM 약물 정보를 입력하세요.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Prescription Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                TDM 약물 추가
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="drugName">약물명 *</Label>
                    <Select value={formData.drugName} onValueChange={handleDrugChange} required>
                      <SelectTrigger id="drugName">
                        <SelectValue placeholder="TDM 약물 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {TDM_DRUGS.map(drug => (
                          <SelectItem key={drug.name} value={drug.name}>{drug.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="indication">적응증 (선택)</Label>
                    <Input id="indication" value={formData.indication} readOnly placeholder="약물 선택 시 자동 표시" />
                  </div>
                  <div>
                    <Label htmlFor="tdmTarget">TDM 목표 *</Label>
                    <Select value={formData.tdmTarget} onValueChange={handleTargetChange} required disabled={!formData.drugName}>
                      <SelectTrigger id="tdmTarget">
                        <SelectValue placeholder="TDM 목표 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {tdmTargets.map(target => (
                          <SelectItem key={target.type} value={target.type}>{target.type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tdmTargetValue">TDM 목표치 *</Label>
                    <Input id="tdmTargetValue" value={formData.tdmTargetValue} onChange={e => setFormData(prev => ({ ...prev, tdmTargetValue: e.target.value }))} placeholder="TDM 목표 선택 시 자동 입력, 수정 가능" required disabled={!formData.tdmTarget} />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  TDM 약물 추가
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Existing Prescriptions */}
          {patientPrescriptions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>TDM 약물정보 ({patientPrescriptions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>약물명</TableHead>
                        <TableHead>적응증</TableHead>
                        <TableHead>TDM 목표</TableHead>
                        <TableHead>TDM 목표치</TableHead>
                        <TableHead>삭제</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentPrescription && (
                        <TableRow key={currentPrescription.id}>
                          <TableCell className="font-medium">{currentPrescription.drugName}</TableCell>
                          <TableCell>{currentPrescription.indication || "-"}</TableCell>
                          <TableCell>{currentPrescription.tdmTarget || "-"}</TableCell>
                          <TableCell>{currentPrescription.tdmTargetValue || "-"}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(currentPrescription.id)}>
                              <span className="sr-only">삭제</span>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </Button>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={onPrev} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              환자 등록 및 선택
            </Button>
            {isCompleted && (
              <Button onClick={onNext} className="flex items-center gap-2">
                Lab
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrescriptionStep;
