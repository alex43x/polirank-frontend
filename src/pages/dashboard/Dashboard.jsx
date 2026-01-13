import React, { useEffect } from "react";
import { useStudent } from "../../hooks/useStudent";
import { useAuth } from "../../hooks/useAuth";
export default function Dashboard() {
  const { students, fetchStudents, loading } = useStudent();
  const {user} = useAuth();
  useEffect(() => {
    fetchStudents();
  }, []);
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Hola, {user?.nombre}</p>

      <ul>
        {students?.map((student) => (
          <li key={student.id}>{student.nombre}</li>
        ))}
      </ul>
    </div>
  );
}
