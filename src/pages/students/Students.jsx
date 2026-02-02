import StudentsTable from "../../components/students/StudentsTable";

export default function Students() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Estudiantes</h1>
        <p className="mt-2 text-gray-600">Gestiona y visualiza todos los estudiantes del sistema</p>
      </div>
      <StudentsTable />
    </div>
  );
}
