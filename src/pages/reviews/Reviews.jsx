// Reviews.jsx
import React, { useState, useEffect, use } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSubject } from "../../hooks/useSubject";
import { useAuth } from "../../hooks/useAuth";
import { useCourse } from "../../hooks/useCourse";
import TeacherCard from "../../components/reviews.jsx/TeacherCard";
import LastSemesterData from "../../components/reviews.jsx/LastSemesterData";
import HistoricalData from "../../components/reviews.jsx/HistoricalData";

export default function Reviews() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { fetchSectionsBySubjectId } = useSubject();
  const { fetchLastSemesterData, fetchHistoricalData } = useCourse();

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastSemesterData, setLastSemesterData] = useState({});
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [teacherName, setTeacherName] = useState(null);
  const [historicalData, setHistoricalData] = useState({});

  const subjectName = location.state?.subjectName || "Materia";

  useEffect(() => {
    const loadHistoricalData = async () => {
      if (!selectedTeacherId || !subjectId) return;

      try {
        const data = await fetchHistoricalData(selectedSectionId, {
          teacherId: selectedTeacherId,
          subjectId: subjectId,
        });
        setHistoricalData(data || {});
      } catch (error) {
        console.error("Error al cargar datos históricos:", error);
      }
    };

    loadHistoricalData();
  }, [selectedTeacherId, subjectId]);

  useEffect(() => {
    const loadSections = async () => {
      if (subjectId && user) {
        try {
          setLoading(true);
          const data = await fetchSectionsBySubjectId(subjectId);
          // Los datos vienen directamente como array
          setSections(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Error al cargar las secciones:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadSections();
  }, []);

  useEffect(() => {
    const loadLastSemesterData = async () => {
      try {
        setLoading(true);
        const data = await fetchLastSemesterData(selectedSectionId, {
          teacherId: selectedTeacherId,
          subjectId: subjectId,
        });
        // Los datos vienen directamente como array
        setLastSemesterData(data || {});
      } catch (error) {
        console.error("Error al cargar las reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    loadLastSemesterData();
    console.log(
      "Selected Section ID:",
      selectedSectionId,
      " Subject ID:",
      subjectId,
      " Teacher ID:",
      selectedTeacherId
    );
  }, [selectedSectionId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-navy">Cargando secciones...</div>
      </div>
    );
  }

  return (
    <div className="px-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-navy hover:text-blue-900 mb-4 flex items-center gap-2 font-medium"
        >
          ← Volver
        </button>

        <h1 className="text-4xl font-extrabold text-navy mb-2">
          {subjectName}
        </h1>
        <h2 className="text-2xl font-bold text-neutral-700">
          Secciones Disponibles
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Teachers */}
        <div className="lg:w-1/3">
          {sections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-neutral-500">
                No hay secciones disponibles para esta materia
              </p>
            </div>
          ) : (
            <div
              className="
          flex gap-3 overflow-x-auto pb-2
          lg:grid lg:grid-cols-1 lg:overflow-visible
        "
            >
              {sections.map((section) => (
                <div
                  key={section.id}
                  onClick={() => {
                    setSelectedSectionId(section.id);
                    setSelectedTeacherId(section.Docente.id);
                    setTeacherName(section.Docente.nombre);
                  }}
                  className="min-w-[260px] lg:min-w-0"
                >
                  <TeacherCard
                    teacher={section.Docente}
                    selected={selectedTeacherId === section.Docente.id}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Datos */}
        <div className="lg:w-2/3">
          <section className="bg-white border border-greige rounded-lg shadow-md ">
            <LastSemesterData
              lastSemesterData={lastSemesterData}
              teacherName={teacherName}
            />
          </section>
          <section className="bg-white border border-greige rounded-lg shadow-md mt-2">
            <HistoricalData historicalData={historicalData} />
          </section>
        </div>
      </div>
    </div>
  );
}
