// Reviews.jsx
import { useState, useEffect } from "react";
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
  const [selectedSection, setSelectedSection] = useState(null); // Consolidated state
  const [historicalData, setHistoricalData] = useState({});

  const subjectName = location.state?.subjectName || "Materia";

  // Cargar secciones al montar el componente
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
  }, [subjectId, user]);

  // Cargar datos (último semestre e histórico) cuando se selecciona una sección
  useEffect(() => {
    const loadSectionData = async () => {
      if (!selectedSection) {
        setLastSemesterData({});
        setHistoricalData({});
        return;
      }

      try {
        setLoading(true);
        // Cargar últimos datos
        const lastData = await fetchLastSemesterData(selectedSection.id);
        setLastSemesterData(lastData || {});

        // Cargar histórico
        const historyData = await fetchHistoricalData(selectedSection.id);
        setHistoricalData(historyData || {});

      } catch (error) {
        console.error("Error al cargar datos de la sección:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSectionData();
  }, [selectedSection]);

  // Handler para seleccionar una sección
  const handleSectionSelect = (sectionData) => {
    // sectionData structure: { section: { id, Docente... }, totalReviews... }
    // We store the inner section object for easier access to ID and Docente
    setSelectedSection(sectionData.section);
  };

  if (loading && sections.length === 0) {
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
              {sections.map((sectionData) => (
                <div
                  key={sectionData.section.id}
                  onClick={() => handleSectionSelect(sectionData)}
                  className="min-w-[260px] lg:min-w-0"
                >
                  <TeacherCard
                    teacher={sectionData.section.Docente}
                    selected={selectedSection?.id === sectionData.section.id}
                    totalReviews={sectionData.totalReviews}
                    promedioGeneral={sectionData.promedioGeneral}
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
              teacherName={selectedSection?.Docente?.nombre}
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
