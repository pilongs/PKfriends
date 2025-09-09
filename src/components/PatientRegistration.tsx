import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Patient } from "@/pages/Index";
import { UserPlus, Edit, Eye, X, Trash2, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import dayjs from "dayjs";

interface PatientRegistrationProps {
  onAddPatient: (patient: Patient) => void;
  patients: Patient[];
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
}

const PatientRegistration = ({ onAddPatient, patients, selectedPatient, setSelectedPatient }: PatientRegistrationProps) => {
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

  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPatient: Patient = {
      id: Date.now().toString(),
      name: formData.name,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      gender: formData.gender,
      medicalHistory: formData.medicalHistory,
      allergies: formData.allergies,
      birth: formData.birth,
      createdAt: new Date()
    };

    onAddPatient(newPatient);
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

  const handleEdit = (patient: Patient) => {
    setFormData({
      patientNo: patient.id,
      name: patient.name,
      gender: patient.gender,
      birth: patient.createdAt.toISOString().split('T')[0],
      age: patient.age.toString(),
      weight: patient.weight.toString(),
      height: patient.height.toString(),
      medicalHistory: patient.medicalHistory,
      allergies: patient.allergies
    });
    setSelectedPatient(patient);
    setIsEditing(true);
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
    setSelectedPatient(null);
    setIsModalOpen(false);
  };
  const handleDelete = () => {
    if (selectedPatient) {
    // onAddPatient는 새 환자를 추가하는 기능이지만,
    // onAddPatient가 부모 컴포넌트의 setState를 호출할 가능성이 높으므로
    // onAddPatient를 재활용하여 삭제 로직을 실행합니다.
      onAddPatient(null);
    }
    resetForm();
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

  const openNewPatientModal = () => {
    setIsEditing(false);
    setSelectedPatient(null);
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

  return (
    <div className="space-y-6">
      {/* New Patient Button */}
      <div className="flex justify-end">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewPatientModal} className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              신규 환자 등록
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
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
    {/* 환자의 TDM 보고서가 생성된 경우에만 노출출*/}
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
        <div className="flex justify-end">
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

        {/* Patient List */}
      <Card>
        <CardHeader>
          <CardTitle>등록된 환자 ({patients.length})</CardTitle>
          <CardDescription>
            환자 정보를 확인하고 수정할 수 있습니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          {patients.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>환자번호</TableHead>
                    <TableHead>나이(생년월일)</TableHead>
                    <TableHead>성별</TableHead>
                    <TableHead>체중 (BMI)</TableHead>
                    <TableHead>환자 등록일</TableHead>
                    <TableHead>수정 및 조회</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow 
                      key={patient.id}
                      className={`cursor-pointer hover:bg-muted/50 ${
                        selectedPatient?.id === patient.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.id}</TableCell>
                      <TableCell>{patient.age}({patient.birth})</TableCell>
                      <TableCell className="capitalize">{patient.gender}</TableCell>
                      <TableCell>{patient.weight} kg ({(patient.weight / Math.pow(patient.height / 100, 2)).toFixed(1)})</TableCell>
                      <TableCell>{patient.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell>
    <div className="flex gap-2">
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
    </div>
</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">아직 등록된 환자가 없습니다</p>
              <p className="text-sm text-muted-foreground">위 버튼을 통해 첫 환자를 등록하세요</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientRegistration;