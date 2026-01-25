import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const { user, getProfile } = useAuth();
  const { fetchSectionsBySubjectId } = useSubject();
  const { fetchLastSemesterData, fetchHistoricalData } = useCourse();
  const queryClient = useQueryClient();

  const [selectedSection, setSelectedSection] = useState(null);
  const [visible, setVisible] = useState(false);

  const subjectName = location.state?.subjectName || "Materia";

  // Query para obtener las secciones
  const {
    data: sections = [],
    isLoading: sectionsLoading,
    error: sectionsError,
  } = useQuery({
    queryKey: ["sections", subjectId],
    queryFn: async () => {
      const data = await fetchSectionsBySubjectId(subjectId);
      return Array.isArray(data) ? data : [];
    },
    enabled: !!subjectId && !!user,
    staleTime: 1000 * 60 * 10, // 10 minutos para secciones (cambian poco)
  });

  // Query para datos del último semestre
  const {
    data: lastSemesterData = {},
    isLoading: lastSemesterLoading,
  } = useQuery({
    queryKey: ["lastSemester", selectedSection?.id],
    queryFn: async () => {
      const data = await fetchLastSemesterData(selectedSection.id);
      return data || {};
    },
    enabled: !!selectedSection?.id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Query para datos históricos
  const {
    data: historicalData = {},
    isLoading: historicalLoading,
  } = useQuery({
    queryKey: ["historical", selectedSection?.id],
    queryFn: async () => {
      const data = await fetchHistoricalData(selectedSection.id);
      return data || {};
    },
    enabled: !!selectedSection?.id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

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

  const handleReviewSuccess = async () => {
    setVisible(false);
    
    // Invalidar queries para refrescar los datos
    await queryClient.invalidateQueries({
      queryKey: ["sections", subjectId],
    });
    await queryClient.invalidateQueries({
      queryKey: ["lastSemester", selectedSection?.id],
    });
    await queryClient.invalidateQueries({
      queryKey: ["historical", selectedSection?.id],
    });
    
    getProfile();
  };

  const isLoading = sectionsLoading || lastSemesterLoading || historicalLoading;

  if (sectionsLoading && sections.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-navy">Cargando secciones...</div>
      </div>
    );
  }

  if (sectionsError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-red-600">
          Error al cargar las secciones. Por favor intenta de nuevo.
        </div>
      </div>
    );
  }

  return (
    <div>
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
            maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          >
            <ReviewForm
              subjectName={subjectName}
              teacherName={selectedSection?.Docente?.nombre || "Docente"}
              sectionId={selectedSection?.id}
              onSuccess={handleReviewSuccess}
            />
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Teachers */}
        <div className="md:w-1/3">
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
                md:grid md:grid-cols-1 md:overflow-visible
              "
            >
              {sections.map((sectionData, index) => (
                <div
                  key={sectionData.section.id}
                  onClick={() => handleSectionSelect(sectionData)}
                  className="min-w-[260px] md:min-w-0"
                >
                  <TeacherCard
                    teacher={sectionData.section.Docente}
                    selected={selectedSection?.id === sectionData.section.id}
                    reviews={sectionData.totalReviews}
                    score={sectionData.promedioGeneral}
                    position={index + 1}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Datos */}
        <div className="md:w-2/3">
          <section className="bg-white border border-greige rounded-lg shadow-md">
            {lastSemesterLoading ? (
              <div className="p-6 text-center text-neutral-500">
                Cargando datos del último semestre...
              </div>
            ) : (
              <LastSemesterData
                lastSemesterData={lastSemesterData}
                teacherName={selectedSection?.Docente?.nombre}
              />
            )}
          </section>
          <section className="bg-white border border-greige rounded-lg shadow-md mt-2">
            {historicalLoading ? (
              <div className="p-6 text-center text-neutral-500">
                Cargando datos históricos...
              </div>
            ) : (
              <HistoricalData historicalData={historicalData} />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}