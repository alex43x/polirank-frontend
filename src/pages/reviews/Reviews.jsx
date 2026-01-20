// Reviews.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSubject } from "../../hooks/useSubject";
import { useAuth } from "../../hooks/useAuth";
import { useCourse } from "../../hooks/useCourse";

import TeacherCard from "../../components/reviews.jsx/TeacherCard";
import LastSemesterData from "../../components/reviews.jsx/LastSemesterData";
import HistoricalData from "../../components/reviews.jsx/HistoricalData";
import ReviewForm from "./ReviewForm";
import { Dialog } from "primereact/dialog";

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
  const [selectedSection, setSelectedSection] = useState(null);
  const [historicalData, setHistoricalData] = useState({});
  const [visible, setVisible] = useState(false);

  const subjectName = location.state?.subjectName || "Materia";

  // Cargar secciones al montar el componente
  useEffect(() => {
    const loadSections = async () => {
      if (subjectId && user) {
        try {
          setLoading(true);
          const data = await fetchSectionsBySubjectId(subjectId);
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
        const lastData = await fetchLastSemesterData(selectedSection.id);
        setLastSemesterData(lastData || {});

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

  const handleSectionSelect = (sectionData) => {
    setSelectedSection(sectionData.section);
  };

  const handleOpenDialog = () => {
    if (!selectedSection) {
      alert("Por favor selecciona una sección primero");
      return;
    }
    setVisible(true);
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
      <div className="mb-6 flex flex-wrap justify-between items-end">
        <div>
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
        <div>
          <button
            className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-dark-navy transition-colors"
            onClick={handleOpenDialog}
            type="button"
          >
            Agregar Reseña +
          </button>
          <Dialog
            visible={visible}
            style={{ width: "95vw", maxWidth: "900px" }}
            onHide={() => setVisible(false)}
            dismissableMask={true}
            modal={true}
            showHeader={false}
            contentClassName="p-0"
            maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          >
            <ReviewForm
              subjectName={subjectName}
              teacherName={selectedSection?.Docente?.nombre || "Docente"}
              sectionId={selectedSection?.id}
              onSuccess={() => setVisible(false)}
            />
          </Dialog>
        </div>
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