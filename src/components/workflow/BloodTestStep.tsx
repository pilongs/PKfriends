import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Patient, BloodTest, Prescription } from "@/pages/Index";
import { FlaskConical, ArrowRight, ArrowLeft, CheckCircle, Plus } from "lucide-react";
import dayjs from "dayjs";

interface BloodTestStepProps {
  patients: Patient[];
  bloodTests: BloodTest[];
  selectedPatient: Patient | null;
  onAddBloodTest: (bloodTest: BloodTest) => void;
  onNext: () => void;
  onPrev: () => void;
  isCompleted: boolean;
  prescriptions: Prescription[];
}

// 신기능 정보 타입
interface RenalInfo {
  creatinine: string;
  date: string;
  formula: string;
}

const BloodTestStep = ({
  patients,
  bloodTests,
  selectedPatient,
  onAddBloodTest,
  onNext,
  onPrev,
  isCompleted,
  prescriptions
}: BloodTestStepProps) => {
  // 신기능 입력 상태
  const [renalForm, setRenalForm] = useState<RenalInfo>({ creatinine: "", date: "", formula: "" });
  const [renalInfo, setRenalInfo] = useState<RenalInfo | null>(null);

  // 혈중 약물 농도 입력 상태
  const [formData, setFormData] = useState({
    testDate: "",
    testTime: "",
    concentration: "",
    unit: "ng/mL",
    notes: ""
  });

  const patientBloodTests = selectedPatient 
    ? bloodTests.filter(b => b.patientId === selectedPatient.id)
    : [];

  const today = dayjs().format("YYYY-MM-DD");

  // 2단계에서 입력한 TDM 약물 1개만 사용
  const tdmDrug = prescriptions.find(p => p.patientId === selectedPatient?.id);

  const handleAddRenal = () => {
    if (!renalForm.creatinine || !renalForm.date || !renalForm.formula) return;
    setRenalInfo({ ...renalForm });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    if (!formData.testDate || !formData.testTime || !formData.concentration) return;
    // 날짜+시간을 Date로 합침
    const testDateTime = new Date(`${formData.testDate}T${formData.testTime}`);
    const newBloodTest: BloodTest = {
      id: Date.now().toString(),
      patientId: selectedPatient.id,
      drugName: tdmDrug?.drugName || "",
      concentration: parseFloat(formData.concentration),
      unit: formData.unit,
      timeAfterDose: 0, // Lab 단계에서는 미사용
      testDate: testDateTime,
      notes: formData.notes
    };
    onAddBloodTest(newBloodTest);
    setFormData({ testDate: "", testTime: "", concentration: "", unit: "ng/mL", notes: "" });
  };

  if (!selectedPatient) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <FlaskConical className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">환자를 먼저 선택해 주세요.</p>
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
            <FlaskConical className="h-5 w-5" />
            Lab
            {isCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
          </CardTitle>
          <CardDescription>
            신기능(혈청 크레아티닌)과 혈중 약물 농도 정보를 입력하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 신기능 입력 */}
          <Card>
            <CardHeader>
              <CardTitle>신기능 (혈청 크레아티닌)</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col md:flex-row gap-4 items-center">
                <div>
                  <Label htmlFor="creatinine">혈청 크레아티닌 (mg/dL)</Label>
                  <Input
                    id="creatinine"
                    type="number"
                    step="0.01"
                    value={renalForm.creatinine}
                    onChange={e => setRenalForm({ ...renalForm, creatinine: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="renalDate">검사일</Label>
                  <Input
                    id="renalDate"
                    type="date"
                    value={renalForm.date}
                    max={today}
                    onChange={e => setRenalForm({ ...renalForm, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="renalFormula">계산식</Label>
                  <Select value={renalForm.formula} onValueChange={v => setRenalForm({ ...renalForm, formula: v })}>
                    <SelectTrigger><SelectValue placeholder="계산식 선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cockcroft-gault">Cockcroft-Gault</SelectItem>
                      <SelectItem value="mdrd">MDRD</SelectItem>
                      <SelectItem value="ckd-epi">CKD-EPI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="button" onClick={handleAddRenal} className="mt-6">저장</Button>
              </form>
              {/* 저장된 신기능 정보 표시 */}
              {renalInfo && (
                <div className="mt-2 text-sm text-muted-foreground">
                  저장됨: {renalInfo.creatinine} mg/dL, {renalInfo.date}, {renalInfo.formula}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 혈중 약물 농도 입력 */}
          <Card>
            <CardHeader>
              <CardTitle>혈중 약물 농도</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-center">
                <div>
                  <Label htmlFor="drugDate">날짜</Label>
                  <Input
                    id="drugDate"
                    type="date"
                    value={formData.testDate}
                    max={today}
                    onChange={e => setFormData({ ...formData, testDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="drugTime">시간</Label>
                  <Input
                    id="drugTime"
                    type="time"
                    value={formData.testTime}
                    onChange={e => setFormData({ ...formData, testTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="concentration">농도 (ng/mL)</Label>
                  <Input
                    id="concentration"
                    type="number"
                    step="0.01"
                    value={formData.concentration}
                    onChange={e => setFormData({ ...formData, concentration: e.target.value })}
                  />
                </div>
                <Button type="submit" className="mt-6">추가</Button>
              </form>
              {/* 입력된 혈중 약물 농도 리스트 */}
              {patientBloodTests.length > 0 && (
                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>날짜</TableHead>
                        <TableHead>시간</TableHead>
                        <TableHead>농도 (ng/mL)</TableHead>
                        <TableHead>비고</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patientBloodTests.map((test) => (
                        <TableRow key={test.id}>
                          <TableCell>{test.testDate.toLocaleDateString()}</TableCell>
                          <TableCell>{test.testDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                          <TableCell>{test.concentration} {test.unit}</TableCell>
                          <TableCell>{test.notes || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={onPrev} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              TDM 약물정보
            </Button>
            {isCompleted && (
              <Button onClick={onNext} className="flex items-center gap-2 w-[300px] bg-black text-white font-bold text-lg py-3 px-6 justify-center">
                투약 기록
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BloodTestStep;
