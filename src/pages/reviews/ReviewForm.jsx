import React, { useState, useEffect } from "react";
import { useReview } from "../../hooks/useReview";
import { useCourse } from "../../hooks/useCourse";
import { useAuth } from "../../hooks/useAuth";
import { Dropdown } from "primereact/dropdown";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const ReviewForm = ({
  subjectName = "Materia",
  teacherName = "Docente",
  sectionId,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    year: "",
    period: "",
    selectedCourseId: null,
    facilidad: null,
    dominio: null,
    claridad: null,
    flexibilidad: null,
    evaluacion: null,
    puntualidad: null,
    trato: null,
    disponibilidad: null,
    material: null,
    facilidad: null,
  });
  const { createReview, updateReview, deleteReview } = useReview();
  const { getCoursesBySection } = useCourse();
  const { profileData } = useAuth();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [existingReview, setExistingReview] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar cursos disponibles cuando se abre el formulario
  useEffect(() => {
    const loadCourses = async () => {
      if (!sectionId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await getCoursesBySection(sectionId);
        if (response && response.cursos) {
          setAvailableCourses(response.cursos);
        }
      } catch (error) {
        console.error("Error al cargar cursos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [sectionId]);

  // Verificar si existe una reseña cuando se selecciona año y período
  useEffect(() => {
    const checkExistingReview = () => {
      if (!formData.selectedCourseId || !profileData?.reviews?.rows) {
        setExistingReview(null);
        setIsEditMode(false);
        return;
      }

      // Buscar si existe una reseña para el curso seleccionado
      const review = profileData.reviews.rows.find(
        (r) => r.curso === formData.selectedCourseId
      );

      if (review) {
        setExistingReview(review);
        setIsEditMode(true);
        // Cargar los valores de la reseña existente en el formulario
        loadReviewData(review);
      } else {
        setExistingReview(null);
        setIsEditMode(false);
        // NO limpiar las calificaciones si no hay reseña existente
        // clearRatings();
      }
    };

    checkExistingReview();
  }, [formData.selectedCourseId, profileData]);

  // Cargar datos de una reseña existente
  const loadReviewData = (review) => {
    const aspectoMap = {
      1: "dominio",
      2: "claridad",
      3: "flexibilidad",
      4: "evaluacion",
      5: "puntualidad",
      6: "trato",
      7: "disponibilidad",
      8: "material",
      9: "facilidad",
    };

    const newFormData = { ...formData };

    // Los aspectos están en ReviewConts
    review.ReviewConts.forEach((aspecto) => {
      const key = aspectoMap[aspecto.aspecto];
      if (key) {
        newFormData[key] = aspecto.valor;
      }
    });

    setFormData(newFormData);
  };

  // Limpiar calificaciones
  const clearRatings = () => {
    setFormData((prev) => ({
      ...prev,
      facilidad: null,
      dominio: null,
      claridad: null,
      flexibilidad: null,
      evaluacion: null,
      puntualidad: null,
      trato: null,
      disponibilidad: null,
      material: null,
      facilidad: null,
    }));
  };

  // Filtrar años disponibles basado en los cursos
  const availableYears = [
    ...new Set(availableCourses.map((c) => c.year.toString())),
  ]
    .map((year) => ({ label: year, value: year }))
    .sort((a, b) => b.value - a.value);

  // Filtrar períodos disponibles basado en el año seleccionado
  const availablePeriods = formData.year
    ? availableCourses
      .filter((c) => c.year.toString() === formData.year)
      .map((c) => c.periodo.toString())
    : [];

  const categories = [
    {
      key: "facilidad",
      label: "Facilidad para Aprobar",
      description:
        "Evalúa qué tan fácil o difícil es aprobar la materia con este docente.",
      highlighted: true,
    },
    {
      key: "dominio",
      label: "Dominio de la Materia",
      description:
        "Evalúa qué tan bien el docente conoce y maneja los temas de la materia.",
    },
    {
      key: "claridad",
      label: "Claridad al Explicar",
      description:
        "Valora qué tan claro y comprensible es el docente al explicar los conceptos.",
    },
    {
      key: "flexibilidad",
      label: "Flexibilidad",
      description:
        "Mide la capacidad del docente para adaptarse a las necesidades de los estudiantes y ser flexible con plazos y métodos de enseñanza.",
    },
    {
      key: "evaluacion",
      label: "Evaluación Justa",
      description:
        "Evalúa si los exámenes y evaluaciones son justos y acordes a lo enseñado.",
    },
    {
      key: "puntualidad",
      label: "Puntualidad",
      description:
        "Valora la puntualidad del docente en clases y entrega de calificaciones.",
    },
    {
      key: "trato",
      label: "Trato al Alumno",
      description:
        "Mide el respeto, la cordialidad y la disposición del docente hacia los estudiantes.",
    },
    {
      key: "disponibilidad",
      label: "Disponibilidad/Apoyo",
      description:
        "Evalúa qué tan accesible es el docente fuera de clase para consultas y apoyo.",
    },
    {
      key: "material",
      label: "Material Didáctico",
      description:
        "Valora la calidad y utilidad del material proporcionado por el docente.",
    },
    {
      key: "facilidad",
      label: "Facilidad",
      description:
        "Evalúa que tan facil es pasar la materia con este profesor.",
    },
  ];

  const handleRatingClick = (category, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handlePeriodClick = (period) => {
    // Encontrar el curso correspondiente al año y período seleccionado
    const course = availableCourses.find(
      (c) =>
        c.year.toString() === formData.year && c.periodo.toString() === period
    );

    if (course) {
      setFormData((prev) => ({
        ...prev,
        selectedCourseId: course.id,
        period: period,
      }));
    }
  };

  const submitReview = async () => {
    // Mapear las categorías a IDs de aspectos
    const aspectoMap = {
      dominio: 1,
      claridad: 2,
      flexibilidad: 3,
      evaluacion: 4,
      puntualidad: 5,
      trato: 6,
      disponibilidad: 7,
      material: 8,
      facilidad: 9,
    };

    // Construir el array de aspectos
    const aspectos = categories.map((cat) => ({
      aspecto: aspectoMap[cat.key],
      valor: formData[cat.key],
    }));

    // Preparar el payload
    const reviewData = {
      curso: formData.selectedCourseId,
      aspectos: aspectos,
    };

    try {
      setIsSubmitting(true);
      if (isEditMode && existingReview) {
        // Actualizar reseña existente
        await updateReview(existingReview.id, reviewData);
        alert("Reseña actualizada correctamente");
      } else {
        // Crear nueva reseña
        await createReview(reviewData);
        alert("Reseña enviada correctamente");
      }

      // Limpiar el formulario después de enviar
      setFormData({
        year: "",
        period: "",
        selectedCourseId: null,
        facilidad: null,
        dominio: null,
        claridad: null,
        flexibilidad: null,
        evaluacion: null,
        puntualidad: null,
        trato: null,
        disponibilidad: null,
        material: null,
      });

      setExistingReview(null);
      setIsEditMode(false);

      // IMPORTANTE: Llamar a onSuccess para cerrar el diálogo e invalidar cache
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error al enviar la reseña:", error);
      alert(
        `Error al ${isEditMode ? "actualizar" : "enviar"} la reseña. Por favor intenta de nuevo.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!existingReview) return;

    confirmDialog({
      message: "¿Estás seguro de que deseas eliminar esta reseña?",
      header: "Confirmar Eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí, eliminar",
      rejectLabel: "Cancelar",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          setIsSubmitting(true);
          await deleteReview(existingReview.id);
          alert("Reseña eliminada correctamente");

          // Limpiar el formulario
          setFormData({
            year: "",
            period: "",
            selectedCourseId: null,
            facilidad: null,
            dominio: null,
            claridad: null,
            flexibilidad: null,
            evaluacion: null,
            puntualidad: null,
            trato: null,
            disponibilidad: null,
            material: null,
          });

          setExistingReview(null);
          setIsEditMode(false);

          // IMPORTANTE: Cerrar el diálogo e invalidar cache
          if (onSuccess) {
            onSuccess();
          }
        } catch (error) {
          console.error("Error al eliminar la reseña:", error);
          alert("Error al eliminar la reseña. Por favor intenta de nuevo.");
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };

  const handleSubmit = () => {
    const isComplete =
      formData.year &&
      formData.period &&
      categories.every((cat) => formData[cat.key] !== null);

    if (!isComplete) {
      alert("Por favor completa todos los campos");
      return;
    }

    if (!formData.selectedCourseId) {
      alert("Error: No se ha seleccionado un curso válido");
      return;
    }

    const message = isEditMode
      ? "¿Estás seguro de que deseas actualizar esta reseña?"
      : "¿Estás seguro de que deseas enviar esta reseña?";

    const header = isEditMode ? "Confirmar Actualización" : "Confirmar Envío";

    confirmDialog({
      message: message,
      header: header,
      icon: "pi pi-exclamation-triangle",
      acceptLabel: isEditMode ? "Sí, actualizar" : "Sí, enviar",
      rejectLabel: "Cancelar",
      accept: submitReview,
    });
  };

  const RatingButtons = ({ category, value, highlighted }) => (
    <div className="flex gap-2 justify-start flex-wrap sm:flex-nowrap">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          onClick={() => handleRatingClick(category, rating)}
          className={`${highlighted ? "w-12 h-12 text-lg" : "w-10 h-10"} rounded-md font-medium transition-all ${
            value === rating
              ? "bg-dark-navy text-white shadow-md"
              : "bg-gray-200 text-dark-navy hover:bg-blue-100"
            }`}
        >
          {rating}
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-greige rounded-lg w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto relative">
      <ConfirmDialog
        pt={{
          root: {
            className: "bg-white rounded-lg shadow-xl border border-gray-200",
          },
          header: {
            className: "bg-navy text-white px-6 py-4 rounded-t-lg",
          },
          content: { className: "px-6 py-4 text-gray-700" },
          footer: {
            className:
              "px-6 py-4 bg-gray-50 rounded-b-lg flex gap-3 justify-end",
          },
          acceptButton: {
            className:
              "bg-navy hover:bg-dark-navy text-white px-6 py-2 rounded-md transition-colors font-medium shadow-md",
          },
          rejectButton: {
            className:
              "bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-md transition-colors font-medium",
          },
          icon: { className: "text-navy text-3xl mr-3" },
        }}
      />

      {/* Botón de cerrar */}
      <button
        onClick={onSuccess}
        className="absolute top-4 right-4 text-navy hover:text-dark-navy transition-colors"
        aria-label="Cerrar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Título */}
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 pr-8">
        {isEditMode ? "Editar Reseña" : "Reseñar Docente"}
      </h2>
      <h3 className="text-lg sm:text-xl text-navy font-semibold mb-4 sm:mb-6">
        {subjectName} - {teacherName}
      </h3>

      {/* Mensaje de modo edición */}
      {isEditMode && (
        <div className="mb-4 p-3 bg-blue-50 border border-greige rounded-md">
          <p className="text-navy font-medium">
            Estás editando una reseña existente
          </p>
        </div>
      )}

      <div>
        {/* Datos del Año-Período */}
        <div className="mb-6">
          <h4 className="font-semibold text-neutral-800 mb-3 text-xl">
            Datos del Año-Período
          </h4>

          {loading ? (
            <div className="text-center py-4 text-gray-500">
              Cargando períodos disponibles...
            </div>
          ) : availableCourses.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No hay períodos disponibles para esta sección
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-4 rounded border border-greige shadow-md">
              <div className="flex-1 w-full sm:w-auto">
                <label className="block text-lg text-navy mb-1 font-bold">
                  Año en el que cursaste:
                </label>
                <Dropdown
                  value={formData.year}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      year: e.value,
                      period: "",
                      selectedCourseId: null,
                    }))
                  }
                  options={availableYears}
                  placeholder="Selecciona un año"
                  className="w-72 border rounded-md border-[#e0e0e0] font-medium bg-neutral-50 pr-2 shadow-md"
                  pt={{
                    input: {
                      className:
                        "py-2 px-3 bg-neutral-50 text-neutral-500 rounded-md",
                    },
                    panel: {
                      className:
                        "bg-neutral-50 border border-[#e0e0e0] text-neutral-600  rounded-md",
                    },
                    item: {
                      className: "text-neutral-900 hover:bg-blue-100 p-2",
                    },
                  }}
                  disabled={availableYears.length === 0}
                />
              </div>
              <div className="w-full sm:w-auto">
                <label className="block text-lg text-navy mb-1 font-bold">
                  Período:
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePeriodClick("1")}
                    disabled={
                      !formData.year || !availablePeriods.includes("1")
                    }
                    className={`w-10 h-10 rounded-md font-medium transition-all ${formData.period === "1"
                        ? "bg-dark-navy text-white"
                        : availablePeriods.includes("1") && formData.year
                          ? "bg-gray-200 text-dark-navy hover:bg-gray-300"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    1
                  </button>
                  <button
                    onClick={() => handlePeriodClick("2")}
                    disabled={
                      !formData.year || !availablePeriods.includes("2")
                    }
                    className={`w-10 h-10 rounded-md font-medium transition-all ${formData.period === "2"
                        ? "bg-dark-navy text-white"
                        : availablePeriods.includes("2") && formData.year
                          ? "bg-gray-200 text-dark-navy hover:bg-gray-300"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    2
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Calificaciones */}
        <div>
          <h4 className="font-semibold text-neutral-800 mb-3 text-xl">
            Calificaciones
          </h4>

          {/* Contenedor con tooltip */}
          <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded border border-greige shadow-md">
            {/* Grid de calificaciones */}
            <div className="flex-1 space-y-6">
              {/* Aspecto destacado - Facilidad */}
              {categories
                .filter((cat) => cat.highlighted)
                .map((category) => (
                  <div
                    key={category.key}
                    className="p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg"
                    onMouseEnter={() => setHoveredCategory(category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <label className="block text-xl text-navy mb-2 font-bold cursor-help">
                      ⭐ {category.label}
                    </label>
                    <RatingButtons
                      category={category.key}
                      value={formData[category.key]}
                      highlighted={true}
                    />
                    {/* Descripción móvil */}
                    <p className="text-sm text-gray-600 lg:hidden mt-2">
                      {category.description}
                    </p>
                  </div>
                ))}

              {/* Resto de aspectos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories
                  .filter((cat) => !cat.highlighted)
                  .map((category) => (
                    <div
                      key={category.key}
                      className="space-y-2"
                      onMouseEnter={() => setHoveredCategory(category)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      <label className="block text-lg text-navy mb-1 font-bold cursor-help">
                        {category.label}
                      </label>
                      <RatingButtons
                        category={category.key}
                        value={formData[category.key]}
                      />
                      {/* Descripción móvil */}
                      <p className="text-xs text-gray-500 lg:hidden">
                        {category.description}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Tooltip lateral - solo desktop */}
            <div className="w-64 hidden lg:block">
              <div className="sticky top-4 bg-neutral-100 border-l-4 border-slate-700 rounded-lg p-4 transition-all duration-200">
                {hoveredCategory ? (
                  <>
                    <h5 className="font-semibold text-slate-800 mb-2">
                      {hoveredCategory.label}
                    </h5>
                    <p className="text-sm text-gray-700">
                      {hoveredCategory.description}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Pasa el cursor sobre un aspecto para ver su descripción
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-navy text-white px-4 py-2 rounded-md hover:bg-dark-navy transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Procesando...</span>
              </>
            ) : (
              <span>{isEditMode ? "Actualizar Reseña" : "Enviar Reseña"}</span>
            )}
          </button>
          {isEditMode && (
            <button
              onClick={handleDelete}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-white text-dark-navy px-4 py-2 rounded-md hover:bg-dark-navy hover:text-white transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Procesando...</span>
                </>
              ) : (
                <span>Eliminar Reseña</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;