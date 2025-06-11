import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Patient, Prescription, DrugAdministration } from "@/pages/Index";
import dayjs from "dayjs";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface DrugAdministrationStepProps {
  patients: Patient[];
  prescriptions: Prescription[];
  selectedPatient: Patient | null;
  onAddDrugAdministration: (drugAdministration: DrugAdministration) => void;
  drugAdministrations: DrugAdministration[];
  onNext: () => void;
  onPrev: () => void;
  isCompleted: boolean;
}

const DrugAdministrationStep = ({
  patients,
  prescriptions,
  selectedPatient,
  onAddDrugAdministration,
  drugAdministrations,
  onNext,
  onPrev,
  isCompleted
}: DrugAdministrationStepProps) => {
  // 2단계에서 입력한 TDM 약물 1개만 사용
  const tdmDrug = prescriptions.find(p => p.patientId === selectedPatient?.id);
  const [form, setForm] = useState<Partial<DrugAdministration>>({
    drugName: tdmDrug?.drugName || "",
    route: "",
    date: "",
    time: "",
    dose: 0,
    unit: "mg",
    infusionTime: undefined
  });

  // 약물명은 상단에 텍스트로만 표시, 선택 불가
  // 날짜 오늘 이후 선택 불가
  const today = dayjs().format("YYYY-MM-DD");

  const handleChange = (key: keyof DrugAdministration, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.drugName || !form.route || !form.date || !form.time || !form.dose || !form.unit) return;
    if (form.route === "IV" && !form.infusionTime) return;
    onAddDrugAdministration({
      id: Date.now().toString(),
      patientId: selectedPatient!.id,
      drugName: form.drugName!,
      route: form.route!,
      date: form.date!,
      time: form.time!,
      dose: Number(form.dose),
      unit: form.unit!,
      isIVInfusion: form.route === "IV",
      infusionTime: form.route === "IV" ? Number(form.infusionTime) : undefined,
      administrationTime: undefined
    });
    setForm({
      drugName: tdmDrug?.drugName || "",
      route: "",
      date: "",
      time: "",
      dose: 0,
      unit: "mg",
      infusionTime: undefined
    });
  };

  const patientDrugAdministrations = drugAdministrations.filter(d => d.patientId === selectedPatient?.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>TDM 약물 투약력 입력</CardTitle>
        <CardDescription>2단계에서 입력한 TDM 약물에 대해 7반감기 이내의 투약력을 입력하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>약물명</label>
            <div className="py-2 px-3 rounded bg-muted text-base font-semibold">{tdmDrug?.drugName || "-"}</div>
          </div>
          <div>
            <label>투여 경로</label>
            <Select value={form.route} onValueChange={v => handleChange("route", v)} required>
              <SelectTrigger><SelectValue placeholder="경로 선택" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="IV">정맥주사(IV)</SelectItem>
                <SelectItem value="PO">경구(PO)</SelectItem>
                <SelectItem value="IM">근육주사(IM)</SelectItem>
                <SelectItem value="SC">피하주사(SC)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label>날짜</label>
            <Input type="date" value={form.date} max={today} onChange={e => handleChange("date", e.target.value)} required />
          </div>
          <div>
            <label>시간</label>
            <Input type="time" value={form.time} onChange={e => handleChange("time", e.target.value)} required />
          </div>
          <div>
            <label>용량</label>
            <Input type="number" value={form.dose} onChange={e => handleChange("dose", e.target.value)} required />
            <Select value={form.unit} onValueChange={v => handleChange("unit", v)} required>
              <SelectTrigger><SelectValue placeholder="단위 선택" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mg">mg</SelectItem>
                <SelectItem value="g">g</SelectItem>
                <SelectItem value="mcg">mcg</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* IV infusion 체크박스/투약시간 입력란 삭제, 대신 IV일 때만 주입시간 노출 */}
          {form.route === "IV" && (
            <div>
              <label>주입 시간(분)</label>
              <Input type="number" value={form.infusionTime || ""} onChange={e => handleChange("infusionTime", e.target.value)} required={form.route === "IV"} />
            </div>
          )}
          <Button type="submit">추가</Button>
        </form>
        <div className="mt-8">
          <h4 className="font-bold mb-2">입력된 투약력</h4>
          <ul className="space-y-2">
            {patientDrugAdministrations.map((adm, idx) => (
              <li key={idx} className="border p-2 rounded">
                {adm.drugName} / {adm.route} / {adm.date} {adm.time} / {adm.dose}{adm.unit} {adm.route === "IV" && adm.infusionTime ? `(주입: ${adm.infusionTime}분)` : null}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-between mt-6">
          <Button variant="outline" type="button" onClick={onPrev} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Lab
          </Button>
          {patientDrugAdministrations.length > 0 && <Button type="button" onClick={onNext} className="flex items-center gap-2">
            PK Simulation
            <ArrowRight className="h-4 w-4" />
          </Button>}
        </div>
      </CardContent>
    </Card>
  );
};

export default DrugAdministrationStep; 