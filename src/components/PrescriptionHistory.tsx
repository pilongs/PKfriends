import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Patient, Prescription } from "@/pages/Index";
import { Pill, Plus, Calendar } from "lucide-react";

interface PrescriptionHistoryProps {
  patients: Patient[];
  prescriptions: Prescription[];
  onAddPrescription: (prescription: Prescription) => void;
  selectedPatient: Patient | null;
}

const PrescriptionHistory = ({ patients, prescriptions, onAddPrescription, selectedPatient }: PrescriptionHistoryProps) => {
  const [formData, setFormData] = useState({
    patientId: selectedPatient?.id || "",
    drugName: "",
    dosage: "",
    unit: "mg",
    frequency: "",
    startDate: "",
    endDate: "",
    route: "oral",
    prescribedBy: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPrescription: Prescription = {
      id: Date.now().toString(),
      patientId: formData.patientId,
      drugName: formData.drugName,
      dosage: parseFloat(formData.dosage),
      unit: formData.unit,
      frequency: formData.frequency,
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      route: formData.route,
      prescribedBy: formData.prescribedBy
    };

    onAddPrescription(newPrescription);
    setFormData({
      patientId: selectedPatient?.id || "",
      drugName: "",
      dosage: "",
      unit: "mg",
      frequency: "",
      startDate: "",
      endDate: "",
      route: "oral",
      prescribedBy: ""
    });
  };

  const filteredPrescriptions = selectedPatient 
    ? prescriptions.filter(p => p.patientId === selectedPatient.id)
    : prescriptions;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Prescription Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              TDM 약물 추가
            </CardTitle>
            <CardDescription>
              환자의 TDM 약물 정보를 기록하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="patientSelect">환자 *</Label>
                <Select
                  value={formData.patientId}
                  onValueChange={(value) => setFormData({...formData, patientId: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} (Age: {patient.age})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="drugName">약물명 *</Label>
                <Input
                  id="drugName"
                  value={formData.drugName}
                  onChange={(e) => setFormData({...formData, drugName: e.target.value})}
                  placeholder="e.g., Amoxicillin, Metformin"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dosage">용량 *</Label>
                  <Input
                    id="dosage"
                    type="number"
                    step="0.1"
                    value={formData.dosage}
                    onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                    placeholder="250"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="unit">단위 *</Label>
                  <Select
                    value={formData.unit}
                    onValueChange={(value) => setFormData({...formData, unit: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mg">mg</SelectItem>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="mcg">mcg</SelectItem>
                      <SelectItem value="mL">mL</SelectItem>
                      <SelectItem value="units">units</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="frequency">투여 빈도 *</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => setFormData({...formData, frequency: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once daily">Once daily</SelectItem>
                    <SelectItem value="twice daily">Twice daily</SelectItem>
                    <SelectItem value="three times daily">Three times daily</SelectItem>
                    <SelectItem value="four times daily">Four times daily</SelectItem>
                    <SelectItem value="every 6 hours">Every 6 hours</SelectItem>
                    <SelectItem value="every 8 hours">Every 8 hours</SelectItem>
                    <SelectItem value="every 12 hours">Every 12 hours</SelectItem>
                    <SelectItem value="as needed">As needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="route">투여 경로 *</Label>
                <Select
                  value={formData.route}
                  onValueChange={(value) => setFormData({...formData, route: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oral">Oral</SelectItem>
                    <SelectItem value="intravenous">Intravenous (IV)</SelectItem>
                    <SelectItem value="intramuscular">Intramuscular (IM)</SelectItem>
                    <SelectItem value="subcutaneous">Subcutaneous</SelectItem>
                    <SelectItem value="topical">Topical</SelectItem>
                    <SelectItem value="inhalation">Inhalation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">시작일 *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">종료일</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="prescribedBy">처방자 *</Label>
                <Input
                  id="prescribedBy"
                  value={formData.prescribedBy}
                  onChange={(e) => setFormData({...formData, prescribedBy: e.target.value})}
                  placeholder="Dr. Smith"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                TDM 약물 추가
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Prescription Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              TDM 약물 요약
            </CardTitle>
            <CardDescription>
              {selectedPatient 
                ? `${selectedPatient.name}의 TDM 약물 정보`
                : "전체 TDM 약물 정보 요약"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredPrescriptions.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    총 TDM 약물
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {new Set(filteredPrescriptions.map(p => p.drugName)).size}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    고유 약물 수
                  </div>
                </div>
              </div>

              {filteredPrescriptions.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">최근 TDM 약물</h4>
                  <div className="space-y-2">
                    {filteredPrescriptions
                      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
                      .slice(0, 5)
                      .map((prescription) => (
                        <div key={prescription.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{prescription.drugName}</div>
                              <div className="text-sm text-muted-foreground">
                                {prescription.dosage}{prescription.unit} - {prescription.frequency}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Route: {prescription.route}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {prescription.startDate.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prescription History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            TDM 약물정보 기록
          </CardTitle>
          <CardDescription>
            전체 TDM 약물 기록
            {selectedPatient && ` (${selectedPatient.name})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPrescriptions.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>환자</TableHead>
                    <TableHead>약물명</TableHead>
                    <TableHead>용량</TableHead>
                    <TableHead>투여 빈도</TableHead>
                    <TableHead>투여 경로</TableHead>
                    <TableHead>시작일</TableHead>
                    <TableHead>종료일</TableHead>
                    <TableHead>처방자</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrescriptions
                    .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
                    .map((prescription) => {
                      const patient = patients.find(p => p.id === prescription.patientId);
                      return (
                        <TableRow key={prescription.id}>
                          <TableCell className="font-medium">
                            {patient?.name || "Unknown"}
                          </TableCell>
                          <TableCell>{prescription.drugName}</TableCell>
                          <TableCell>
                            {prescription.dosage}{prescription.unit}
                          </TableCell>
                          <TableCell>{prescription.frequency}</TableCell>
                          <TableCell className="capitalize">{prescription.route}</TableCell>
                          <TableCell>{prescription.startDate.toLocaleDateString()}</TableCell>
                          <TableCell>
                            {prescription.endDate ? prescription.endDate.toLocaleDateString() : "Ongoing"}
                          </TableCell>
                          <TableCell>{prescription.prescribedBy}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">아직 TDM 약물이 기록되지 않았습니다</p>
              <p className="text-sm text-muted-foreground">
                위 폼을 통해 TDM 약물을 추가하세요
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PrescriptionHistory;
