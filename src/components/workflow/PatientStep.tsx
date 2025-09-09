import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Patient } from "@/pages/Index";
import { User, UserPlus, ArrowRight, CheckCircle, Edit, FileText, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import dayjs from "dayjs";

interface PatientStepProps {
  patients: Patient[];
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
  onAddPatient: (patient: Patient) => void;
  onNext: () => void;
  isCompleted: boolean;
}

const PatientStep = ({
  patients,
  selectedPatient,
  setSelectedPatient,
  onAddPatient,
  onNext,
  isCompleted
}: PatientStepProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
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

  // 검색어로 환자 필터링
  const filteredPatients = patients.filter(
    (p) =>
      p.name.includes(search) ||
      (p.id && p.id.includes(search))
  );

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

  // BMI, BSA 자동 계산
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

  const openNewPatientModal = () => {
    setIsEditing(false);
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
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPatient: Patient = {
      id: formData.patientNo || Date.now().toString(),
      name: formData.name,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      gender: formData.gender,
      medicalHistory: formData.medicalHistory,
      allergies: formData.allergies,
      birth: formData.birth,
      createdAt: new Date(formData.birth)
    };

    onAddPatient(newPatient);
    setSelectedPatient(newPatient);
    setIsModalOpen(false);
  };

  const handleEdit = (patient: Patient) => {
    setIsEditing(true);
    setFormData({
      patientNo: patient.id,
      name: patient.name,
      gender: patient.gender,
      birth: dayjs(patient.createdAt).format("YYYY-MM-DD"),
      age: patient.age.toString(),
      weight: patient.weight.toString(),
      height: patient.height.toString(),
      medicalHistory: patient.medicalHistory,
      allergies: patient.allergies
    });
    setIsModalOpen(true);
  };
  const handleView = (patient: Patient) => {
    setViewingPatient(patient);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
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
    setIsEditing(false);
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedPatient) {
      onAddPatient({ ...selectedPatient, id: "" }); // Dummy Patient
    }
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Patient Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            1단계: 환자 선택
            {isCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
          </CardTitle>
          <CardDescription>
            기존 환자를 선택하거나 신규 환자를 등록하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Existing Patients */}
          {patients.length > 0 && (
            <div className="space-y-4">
              <Label htmlFor="patientSearch">이름 또는 번호로 검색</Label>
              <Input
                id="patientSearch"
                placeholder="이름 또는 환자번호 입력"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="mb-2"
              />
              <Label>기존 환자 리스트</Label>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>이름</TableHead>
                      <TableHead>환자번호</TableHead>
                      <TableHead>나이</TableHead>
                      <TableHead>성별</TableHead>
                      <TableHead>체중(kg)</TableHead>
                      <TableHead>신장(cm)</TableHead>
                      <TableHead>수정 및 조회</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((patient) => (
                        <TableRow
                          key={patient.id}
                          className={
                            selectedPatient?.id === patient.id
                              ? "bg-blue-100 cursor-pointer"
                              : "hover:bg-muted/50 cursor-pointer"
                          }
                          onClick={() => {
                            setSelectedPatient(patient);
                          }}
                          data-state={selectedPatient?.id === patient.id ? "selected" : undefined}
                        >
                          <TableCell>{patient.name}</TableCell>
                          <TableCell>{patient.id}</TableCell>
                          <TableCell>{patient.age}</TableCell>
                          <TableCell>{patient.gender === "male" ? "남" : patient.gender === "female" ? "여" : "-"}</TableCell>
                          <TableCell>{patient.weight}</TableCell>
                          <TableCell>{patient.height}</TableCell>
                          <TableCell className="flex gap-2"> {/* New Cell */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(patient);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleView(patient);
                              }}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground">검색 결과가 없습니다.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Or Register New */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              {patients.length > 0 ? "신규 환자를 등록하세요" : "첫 환자를 등록하세요"}
            </p>
            <div className="flex justify-center"> {/* Center the button */}
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={openNewPatientModal} 
                    className="flex items-center gap-2 bg-white text-black hover:bg-accent" // White button with black text
                    style={{ // Apply inline styles
                      width: '450px',
                      height: '40px',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <UserPlus className="h-4 w-4" />
                    {isEditing ? "환자 정보 수정" : "신규 환자 등록"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5" />
                      {isEditing ? "환자 정보 수정" : "신규 환자 등록"}
                    </DialogTitle>
                    <DialogDescription>
                      {isEditing ? "환자 정보를 수정합니다" : "환자 정보를 입력해 등록하세요"}
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="patientNo">환자 번호 *</Label>
                        <Input
                          id="patientNo"
                          value={formData.patientNo}
                          onChange={(e) => setFormData({ ...formData, patientNo: e.target.value })}
                          placeholder="환자 번호 입력"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="name">이름 *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="이름 입력"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">성별 *</Label>
                        <Select
                          value={formData.gender}
                          onValueChange={(value) => setFormData({ ...formData, gender: value })}
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
                          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
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
                          onChange={(e) => setFormData({ ...formData, height: e.target.value })}
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
                      {isEditing && (
                        <Button type="button" variant="destructive" onClick={handleDelete} className="w-fit p-2">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      <Button type="submit" className="flex-1">
                        {isEditing ? "수정하기" : "등록하기"}
                      </Button>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        취소
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
  <DialogContent className="min-w-[900px]">
    <DialogHeader>
      <DialogTitle>환자 정보 조회</DialogTitle>
      <DialogDescription>
        환자의 상세 정보를 확인합니다.
      </DialogDescription>
    </DialogHeader>
    {viewingPatient && (
      <div className="space-y-4">
        {/* 첫 번째 행 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>환자 이름</Label>
            <p className="text-lg font-medium">{viewingPatient.name}</p>
          </div>
          <div>
            <Label>환자 번호</Label>
            <p className="text-lg font-medium">{viewingPatient.id}</p>
          </div>
        </div>

        {/* 두 번째 행 */}
        <div className="w-full">
          <Button variant="outline">Report Download</Button>
        </div>

        {/* 세 번째 행 */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>나이</Label>
            <p>{viewingPatient.age}</p>
          </div>
          <div>
            <Label>생년월일</Label>
            <p>{viewingPatient.birth}</p>
          </div>
          <div>
            <Label>성별</Label>
            <p className="capitalize">{viewingPatient.gender}</p>
          </div>
          <div>
            <Label>키 (cm)</Label>
            <p>{viewingPatient.height}</p>
          </div>
          <div>
            <Label>몸무게 (kg)</Label>
            <p>{viewingPatient.weight}</p>
          </div>
          <div>
            <Label>BMI</Label>
            <p>{(viewingPatient.weight / Math.pow(viewingPatient.height / 100, 2)).toFixed(1)}</p>
          </div>
          <div>
            <Label>BSA</Label>
            <p>{Math.sqrt((viewingPatient.weight * viewingPatient.height) / 3600).toFixed(2)}</p>
          </div>
        </div>
        
        {/* 네 번째 행 */}
        <div className="mt-8">
          <p className="font-semibold text-lg">시뮬레이션 리포트</p>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>

          {/* Selected Patient Info */}
          {selectedPatient && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Selected Patient</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">이름</Label>
                    <p className="text-sm">{selectedPatient.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">생년월일</Label>
                    <p className="text-sm">{selectedPatient.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">나이</Label>
                    <p className="text-sm">{selectedPatient.age}세</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">성별</Label>
                    <p className="text-sm">{selectedPatient.gender === "male" ? "남성" : selectedPatient.gender === "female" ? "여성" : "기타"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">체중</Label>
                    <p className="text-sm">{selectedPatient.weight} kg</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">신장</Label>
                    <p className="text-sm">{selectedPatient.height} cm</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">BMI</Label>
                    <p className="text-sm">
                      {(selectedPatient.weight && selectedPatient.height ? (selectedPatient.weight / Math.pow(selectedPatient.height / 100, 2)).toFixed(1) : "-")}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">BSA</Label>
                    <p className="text-sm">
                      {(selectedPatient.weight && selectedPatient.height ? Math.sqrt((selectedPatient.weight * selectedPatient.height) / 3600).toFixed(2) : "-")} m²
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Button */}
          {isCompleted && (
            <div className="flex justify-end">
              <Button onClick={onNext} className="flex items-center gap-2 w-[300px] bg-black text-white font-bold text-lg py-3 px-6 justify-center">
                TDM 약물정보
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientStep;