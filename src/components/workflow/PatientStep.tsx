import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Patient } from "@/pages/Index";
import { User, UserPlus, ArrowRight, CheckCircle, Edit, FileText } from "lucide-react";
import PatientInformation from "@/components/PatientInformation";

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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [search, setSearch] = useState("");

  // 검색어로 환자 필터링
  const filteredPatients = patients.filter(
    (p) =>
      p.name.includes(search) ||
      (p.id && p.id.includes(search))
  );

  const handleCreatePatient = (patient: Patient) => {
    onAddPatient(patient);
    setSelectedPatient(patient);
    setIsCreateModalOpen(false);
  };

  const handleEditPatient = (patient: Patient) => {
    onAddPatient(patient);
    setSelectedPatient(patient);
    setIsEditModalOpen(false);
  };

  const handleDeletePatient = (patient: Patient) => {
    // 환자 삭제 로직 (필요시 구현)
    setIsEditModalOpen(false);
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const openEditModal = (patient: Patient) => {
    setEditingPatient(patient);
    setIsEditModalOpen(true);
  };

  const openViewModal = (patient: Patient) => {
    setViewingPatient(patient);
    setIsViewModalOpen(true);
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
                                openEditModal(patient);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                openViewModal(patient);
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
              {patients.length > 0 ? "또는 신규 환자 등록" : "첫 환자를 등록하세요"}
            </p>
            <div className="flex justify-center">
              <Button 
                onClick={openCreateModal} 
                className="flex items-center gap-2 bg-white text-black hover:bg-accent"
                style={{
                  width: '450px',
                  height: '40px',
                  border: '1px solid #e5e7eb',
                }}
              >
                <UserPlus className="h-4 w-4" />
                신규 환자 등록
              </Button>
            </div>
          </div>

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
                    <p className="text-sm">{selectedPatient.birth}</p>
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

      {/* PatientInformation Modals */}
      <PatientInformation
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        onSubmit={handleCreatePatient}
      />
      
      <PatientInformation
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mode="edit"
        patient={editingPatient}
        onSubmit={handleEditPatient}
        onDelete={handleDeletePatient}
      />
      
      <PatientInformation
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        mode="view"
        patient={viewingPatient}
        onSubmit={() => {}}
      />
    </div>
  );
};

export default PatientStep;