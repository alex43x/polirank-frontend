import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSubject } from "../../hooks/useSubject";
import { useAuth } from "../../hooks/useAuth";
import { useCourse } from "../../hooks/useCourse";
import { useTry } from "../../hooks/useTry";

import TeacherCard from "../../components/reviews.jsx/TeacherCard";
import LastSemesterData from "../../components/reviews.jsx/LastSemesterData";
import HistoricalData from "../../components/reviews.jsx/HistoricalData";
import ReviewForm from "./ReviewForm";
import TriesModule from "../../components/reviews.jsx/TriesModule";
import { Dialog } from "primereact/dialog";

export default function Reviews() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, getProfile, profileData } = useAuth();
  const { fetchSectionsBySubjectId, fetchAttemptsBySubjectId } = useSubject();
  const { fetchLastSemesterData, fetchHistoricalData } = useCourse();
  const { createTry, updateTry, deleteTry } = useTry();
  const queryClient = useQueryClient();

  const [selectedSection, setSelectedSection] = useState(null);
  const [visible, setVisible] = useState(false);
  const [visibleTries, setVisibleTries] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const subjectName = location.state?.subjectName || "Materia";

  // Seleccionar la primera carrera por defecto
  useEffect(() => {
    if (user && user.matriculaciones && user.matriculaciones.length > 0 && !selectedCareer) {
      setSelectedCareer(user.matriculaciones[0].carrera);
    }
  }, [user, selectedCareer]);

  // Cargar el perfil solo una vez al montar el componente
  useEffect(() => {
    if (user && !profileLoaded) {
      getProfile();
      setProfileLoaded(true);
    }
  }, [user, profileLoaded]);

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
    staleTime: 1000 * 60 * 10,
  });

  // Query para obtener intentos de la materia
  const {
    data: attemptsData = {},
    isLoading: attemptsLoading,
    refetch: refetchAttempts,
  } = useQuery({
    queryKey: ["attempts", subjectId],
    queryFn: async () => {
      const data = await fetchAttemptsBySubjectId(subjectId);
      return data || {};
    },
    enabled: !!subjectId,
    staleTime: 1000 * 60 * 5,
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
    staleTime: 1000 * 60 * 5,
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
    staleTime: 1000 * 60 * 5,
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

  const handleOpenTriesDialog = () => {
    setVisibleTries(true);
  };

  const handleReviewSuccess = async () => {
    setVisible(false);

    await queryClient.invalidateQueries({
      queryKey: ["sections", subjectId],
    });
    await queryClient.invalidateQueries({
      queryKey: ["lastSemester", selectedSection?.id],
    });
    await queryClient.invalidateQueries({
      queryKey: ["historical", selectedSection?.id],
    });

    await getProfile();
  };

  const handleSubmitTry = async (selectedTryValue, existingTry) => {
    try {
      setIsSubmitting(true);

      const tryData = {
        asignatura: parseInt(subjectId),
        valor: selectedTryValue,
      };

      if (existingTry) {
        await updateTry(existingTry.id, tryData);
      } else {
        await createTry(tryData);
      }

      await Promise.all([
        refetchAttempts(),
        getProfile()
      ]);

      alert(
        existingTry
          ? "Intentos actualizados correctamente"
          : "Intentos registrados correctamente"
      );
    } catch (error) {
      alert("Error al guardar los intentos. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTry = async (existingTry) => {
    try {
      setIsSubmitting(true);
      await deleteTry(existingTry.id);

      await Promise.all([
        refetchAttempts(),
        getProfile()
      ]);

      alert("Registro eliminado correctamente");
    } catch (error) {
      alert("Error al eliminar el registro. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sectionsLoading && sections.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-navy"></div>
        <p className="mt-4 text-navy font-bold animate-pulse">Cargando análisis académico...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 bg-[#F3F4F6]">
      {/* Header Premium Flotante */}
      <div className="max-w-[1600px] mx-auto px-2 md:px-4 lg:px-8 pt-6">
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 p-6 md:p-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                <button
                  onClick={() => navigate(-1)}
                  className="group flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-100 bg-white hover:bg-navy hover:border-navy transition-all duration-300 shadow-sm flex-shrink-0"
                  title="Volver al Dashboard"
                >
                  <svg className="w-5 h-5 text-navy group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-blue-50 text-navy text-[9px] font-black rounded uppercase tracking-widest">Materia</span>
                    <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
                    <span className="text-gray-400 text-[9px] font-bold uppercase tracking-widest break-words leading-tight">{selectedCareer?.nombre}</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl lg:text-5xl font-black text-navy tracking-tight leading-tight break-words">
                    {subjectName}
                  </h1>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center md:justify-end border-t md:border-t-0 pt-6 md:pt-0 border-gray-100">
                <button
                  onClick={handleOpenTriesDialog}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border-2 border-navy text-navy px-6 py-3 rounded-2xl hover:bg-navy hover:text-white transition-all duration-300 font-bold shadow-sm group"
                  type="button"
                >
                  <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Chipitómetro
                </button>
                
                {user?.rol?.nombre !== "GUEST" && (
                  <button
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-navy text-white px-8 py-3 rounded-2xl hover:bg-dark-navy hover:shadow-navy/40 transition-all duration-300 font-bold shadow-lg shadow-navy/20 active:scale-95"
                    onClick={handleOpenDialog}
                    type="button"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Agregar Reseña
                  </button>
                )}
              </div>
            </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-2 md:px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Secciones del Lado Izquierdo */}
          <div className="lg:w-[380px] flex-shrink-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-navy uppercase tracking-tight flex items-center gap-2">
                <div className="w-2 h-6 bg-navy rounded-full"></div>
                Secciones ({sections.length})
              </h2>
            </div>
            
            {sections.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-gray-100 rounded-3xl p-10 text-center">
                <p className="text-gray-400 font-bold">No hay secciones registradas</p>
              </div>
            ) : (
              <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
                {sections.map((sectionData, index) => (
                  <div
                    key={sectionData.section.id}
                    onClick={() => handleSectionSelect(sectionData)}
                    className="min-w-[280px] lg:min-w-0"
                  >
                    <TeacherCard
                      teacher={sectionData.section.Docente}
                      selected={selectedSection?.id === sectionData.section.id}
                      reviews={sectionData.totalReviews}
                      score={sectionData.promedioGeneral}
                      position={index + 1}
                      subjectName={subjectName}
                      sectionNumber={sectionData.section.numero}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Área de Visualización del Lado Derecho */}
          <div className="flex-1 min-w-0 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden min-h-[600px]">
              {lastSemesterLoading ? (
                <div className="flex flex-col justify-center items-center h-96">
                   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy"></div>
                   <p className="mt-4 text-gray-400 font-medium italic">Analizando reportes de curso...</p>
                </div>
              ) : (
                <LastSemesterData
                  lastSemesterData={lastSemesterData}
                  teacherName={selectedSection?.Docente?.nombre}
                />
              )}
            </div>

            {selectedSection && (
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                {historicalLoading ? (
                  <div className="p-12 text-center text-gray-400 italic">Cargando base histórica...</div>
                ) : (
                  <HistoricalData historicalData={historicalData} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs con Estilos Mejorados */}
      <Dialog
        visible={visible}
        style={{ width: "95vw", maxWidth: "900px" }}
        onHide={() => setVisible(false)}
        dismissableMask={true}
        modal={true}
        showHeader={false}
        contentClassName="p-0 rounded-[2rem] overflow-hidden shadow-2xl"
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(8px)" }}
      >
        <ReviewForm
          subjectName={subjectName}
          teacherName={selectedSection?.Docente?.nombre || "Docente"}
          sectionId={selectedSection?.id}
          onSuccess={handleReviewSuccess}
        />
      </Dialog>

      <Dialog
        visible={visibleTries}
        style={{ width: "95vw", maxWidth: "700px", maxHeight: "90vh" }}
        onHide={() => setVisibleTries(false)}
        dismissableMask={true}
        modal={true}
        header="Estadísticas de Intentos (Chipitómetro)"
        contentClassName="p-0 overflow-y-auto"
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(8px)" }}
        pt={{
          root: { className: "rounded-[2rem] overflow-hidden border-0" },
          header: {
            className: "bg-navy text-white px-8 py-6 text-2xl font-black uppercase tracking-tight",
          },
          content: { className: "p-0 overflow-y-auto bg-gray-50" },
          closeButton: {
            className: "text-white hover:bg-white/10 rounded-xl transition-all w-10 h-10 flex items-center justify-center",
          },
        }}
      >
        <TriesModule
          subjectId={subjectId}
          subjectName={subjectName}
          attemptsData={attemptsData}
          attemptsLoading={attemptsLoading}
          profileData={profileData}
          onSubmitTry={handleSubmitTry}
          onDeleteTry={handleDeleteTry}
          isSubmitting={isSubmitting}
          selectedCareer={selectedCareer}
        />
      </Dialog>
    </div>
  );
}