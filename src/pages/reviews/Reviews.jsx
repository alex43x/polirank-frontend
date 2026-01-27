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
    if (user && user.Matriculacions && user.Matriculacions.length > 0 && !selectedCareer) {
      setSelectedCareer(user.Matriculacions[0].Carrera);
    }
  }, [user, selectedCareer]);

  // Cargar el perfil solo una vez al montar el componente
  useEffect(() => {
    if (user && !profileLoaded) {
      getProfile();
      setProfileLoaded(true);
    }
  }, [user, profileLoaded]);

  useEffect(()=>{
    console.log(profileData)
  })
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

      // Refrescar datos - IMPORTANTE: esperar a que termine
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
      console.error("Error al guardar intentos:", error);
      alert("Error al guardar los intentos. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTry = async (existingTry) => {
    try {
      setIsSubmitting(true);
      await deleteTry(existingTry.id);

      // Refrescar datos - IMPORTANTE: esperar a que termine
      await Promise.all([
        refetchAttempts(),
        getProfile()
      ]);

      alert("Registro eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar intento:", error);
      alert("Error al eliminar el registro. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-4xl font-extrabold text-navy">
              {subjectName}
            </h1>
            <button
              onClick={handleOpenTriesDialog}
              className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-dark-navy transition-colors font-medium"
              type="button"
              title="Ver estadísticas de intentos"
            >
              Ver Intentos
            </button>
          </div>

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

          {/* Dialog de Reseñas */}
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

          {/* Dialog de Intentos */}
          <Dialog
            visible={visibleTries}
            style={{ width: "95vw", maxWidth: "700px", maxHeight: "90vh" }}
            onHide={() => setVisibleTries(false)}
            dismissableMask={true}
            modal={true}
            header="Estadísticas de Intentos"
            contentClassName="p-0 overflow-y-auto"
            maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
            pt={{
              root: { className: "rounded-lg" },
              header: {
                className: "bg-navy text-white px-6 py-4 rounded-t-lg text-2xl font-medium",
              },
              content: { className: "p-0 overflow-y-auto" },
              closeButton: {
                className: "text-white hover:bg-dark-navy rounded-md transition-colors",
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