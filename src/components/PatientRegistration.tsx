import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Patient } from "@/pages/Index";
import { UserPlus, Edit, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PatientInformation from "./PatientInformation";

interface PatientRegistrationProps {
  onAddPatient: (patient: Patient) => void;
  patients: Patient[];
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
}

const PatientRegistration = ({ onAddPatient, patients, selectedPatient, setSelectedPatient }: PatientRegistrationProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);

  const handleCreatePatient = (patient: Patient) => {
    onAddPatient(patient);
    setIsCreateModalOpen(false);
  };

  const handleEditPatient = (patient: Patient) => {
    onAddPatient(patient);
    setIsEditModalOpen(false);
    setEditingPatient(null);
  };

  const handleDeletePatient = (patient: Patient) => {
    // 환자 삭제 로직 (필요시 구현)
    console.log("Delete patient:", patient);
  };

  const handleViewPatient = (patient: Patient) => {
    setViewingPatient(patient);
    setIsViewModalOpen(true);
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
      {/* New Patient Button */}
      <div className="flex justify-end">
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          신규 환자 등록
        </Button>
      </div>

      {/* Patient Information Modals */}
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
                        <div className="flex gap-2">
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
