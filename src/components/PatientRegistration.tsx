import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Patient } from "@/pages/Index";
import { UserPlus, Edit, Eye, X } from "lucide-react";
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Details */}
        {selectedPatient && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                환자 정보
              </CardTitle>
              <CardDescription>
                {selectedPatient && `${selectedPatient.name}의 상세 정보`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">이름</Label>
                    <p className="text-sm">{selectedPatient.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">나이</Label>
                    <p className="text-sm">{selectedPatient.age} years</p>
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
                    <Label className="text-sm font-medium text-muted-foreground">성별</Label>
                    <p className="text-sm capitalize">{selectedPatient.gender}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">BMI</Label>
                    <p className="text-sm">
                      {(selectedPatient.weight / Math.pow(selectedPatient.height / 100, 2)).toFixed(1)}
                    </p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">등록일</Label>
                  <p className="text-sm">{selectedPatient.createdAt.toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Patient List */}
      <Card>
        <CardHeader>
          <CardTitle>등록된 환자 ({patients.length})</CardTitle>
          <CardDescription>
            환자를 클릭하면 상세 정보 확인 및 수정이 가능합니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          {patients.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>나이</TableHead>
                    <TableHead>성별</TableHead>
                    <TableHead>체중</TableHead>
                    <TableHead>BMI</TableHead>
                    <TableHead>등록일</TableHead>
                    <TableHead>수정</TableHead>
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
                      <TableCell>{patient.age}</TableCell>
                      <TableCell className="capitalize">{patient.gender}</TableCell>
                      <TableCell>{patient.weight} kg</TableCell>
                      <TableCell>
                        {(patient.weight / Math.pow(patient.height / 100, 2)).toFixed(1)}
                      </TableCell>
                      <TableCell>{patient.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell>
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
