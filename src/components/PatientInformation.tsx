import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Patient } from "@/pages/Index";
import { UserPlus, Edit, Trash2, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import dayjs from "dayjs";

interface PatientInformationProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  patient?: Patient | null;
  onSubmit: (patient: Patient) => void;
  onDelete?: (patient: Patient) => void;
}

const PatientInformation = ({
  isOpen,
  onClose,
  mode,
  patient,
  onSubmit,
  onDelete
}: PatientInformationProps) => {
  const [formData, setFormData] = useState({
    patientNo: "",
    name: "",
    gender: "",
    birth: "",
    age: "",
    weight: "",
    height: "",
    medicalHistory: "",
    allergies: ""
  });

  // 모드에 따라 폼 데이터 초기화
  React.useEffect(() => {
    if (mode === 'edit' && patient) {
      setFormData({
        patientNo: patient.id,
        name: patient.name,
        gender: patient.gender,
        birth: patient.birth,
        age: patient.age.toString(),
        weight: patient.weight.toString(),
        height: patient.height.toString(),
        medicalHistory: patient.medicalHistory,
        allergies: patient.allergies
      });
    } else if (mode === 'create') {
      setFormData({
        patientNo: "",
        name: "",
        gender: "",
        birth: "",
        age: "",
        weight: "",
        height: "",
        medicalHistory: "",
        allergies: ""
      });
    }
  }, [mode, patient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'view') return;

    const newPatient: Patient = {
      id: mode === 'edit' && patient ? patient.id : Date.now().toString(),
      name: formData.name,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      gender: formData.gender,
      medicalHistory: formData.medicalHistory,
      allergies: formData.allergies,
      birth: formData.birth,
      createdAt: mode === 'edit' && patient ? patient.createdAt : new Date()
    };

    onSubmit(newPatient);
    onClose();
  };

  const handleDelete = () => {
    if (patient && onDelete) {
      onDelete(patient);
      onClose();
    }
  };

  const handleBirthChange = (value: string) => {
    setFormData((prev) => {
      let age = "";
      if (value) {
        const today = dayjs();
        const birth = dayjs(value);
        age = today.diff(birth, 'year').toString();
      }
      return { ...prev, birth: value, age };
    });
  };

  const calcBMI = () => {
    const w = parseFloat(formData.weight);
    const h = parseFloat(formData.height);
    if (!w || !h) return "";
    return (w / Math.pow(h / 100, 2)).toFixed(1);
  };

  const calcBSA = () => {
    const w = parseFloat(formData.weight);
    const h = parseFloat(formData.height);
    if (!w || !h) return "";
    // Mosteller formula
    return Math.sqrt((w * h) / 3600).toFixed(2);
  };

  const getTitle = () => {
    switch (mode) {
      case 'create': return "신규 환자 등록 +";
      case 'edit': return "환자 정보 수정";
      case 'view': return "환자 정보 조회";
      default: return "환자 정보";
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'create': return "환자 정보를 입력해 등록하세요";
      case 'edit': return "환자 정보를 수정합니다";
      case 'view': return "환자의 상세 정보를 확인합니다";
      default: return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={mode === 'view' ? "min-w-[900px]" : "max-w-4xl max-h-[90vh] overflow-y-auto"}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            {getTitle()}
          </DialogTitle>
          <DialogDescription>
            {getDescription()}
          </DialogDescription>
        </DialogHeader>
        
        {mode === 'view' && patient ? (
          <div className="space-y-4">
            {/* 첫 번째 행 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>환자 이름</Label>
                <p className="text-lg font-medium">{patient.name}</p>
              </div>
              <div>
                <Label>환자 번호</Label>
                <p className="text-lg font-medium">{patient.id}</p>
              </div>
            </div>

            {/* 두 번째 행 */}
            <div className="flex justify-end">
              <Button variant="outline">Report Download</Button>
            </div>

            {/* 세 번째 행 */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>나이</Label>
                <p>{patient.age}</p>
              </div>
              <div>
                <Label>생년월일</Label>
                <p>{patient.birth}</p>
              </div>
              <div>
                <Label>성별</Label>
                <p className="capitalize">{patient.gender}</p>
              </div>
              <div>
                <Label>키 (cm)</Label>
                <p>{patient.height}</p>
              </div>
              <div>
                <Label>몸무게 (kg)</Label>
                <p>{patient.weight}</p>
              </div>
              <div>
                <Label>BMI</Label>
                <p>{(patient.weight / Math.pow(patient.height / 100, 2)).toFixed(1)}</p>
              </div>
              <div>
                <Label>BSA</Label>
                <p>{Math.sqrt((patient.weight * patient.height) / 3600).toFixed(2)}</p>
              </div>
            </div>
            
            {/* 네 번째 행 */}
            <div className="mt-8">
              <p className="font-semibold text-lg">시뮬레이션 리포트</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientNo">환자 번호 *</Label>
                <Input
                  id="patientNo"
                  value={formData.patientNo}
                  onChange={(e) => setFormData({...formData, patientNo: e.target.value})}
                  placeholder="환자 번호 입력"
                  required
                />
              </div>
              <div>
                <Label htmlFor="name">이름 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="이름 입력"
                  required
                />
              </div>
              <div>
                <Label htmlFor="gender">성별 *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({...formData, gender: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="성별 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">남성</SelectItem>
                    <SelectItem value="female">여성</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="birth">생년월일 *</Label>
                <Input
                  id="birth"
                  type="date"
                  value={formData.birth}
                  onChange={(e) => handleBirthChange(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="weight">체중(kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  placeholder="체중(kg)"
                  min="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="height">신장(cm) *</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                  placeholder="신장(cm)"
                  min="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="age">나이</Label>
                <Input
                  id="age"
                  value={formData.age}
                  readOnly
                  placeholder="생년월일 입력 시 자동 계산"
                />
              </div>
              <div>
                <Label>BMI</Label>
                <Input value={calcBMI()} readOnly placeholder="자동 계산" />
              </div>
              <div>
                <Label>BSA</Label>
                <Input value={calcBSA()} readOnly placeholder="자동 계산" />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              {mode === 'edit' && onDelete && (
                <Button type="button" variant="destructive" onClick={handleDelete} className="w-fit p-2">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              {mode !== 'view' && (
                <Button type="submit" className="flex-1">
                  {mode === 'edit' ? "수정하기" : "등록하기"}
                </Button>
              )}
              <Button type="button" variant="outline" onClick={onClose}>
                {mode === 'view' ? "닫기" : "취소"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PatientInformation;
