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
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, [sectionId]);

  useEffect(() => {
    const checkExistingReview = () => {
      if (!formData.selectedCourseId || !profileData?.reviews?.rows) {
        setExistingReview(null);
        setIsEditMode(false);
        return;
      }
      const review = profileData.reviews.rows.find(
        (r) => r.curso?.id === formData.selectedCourseId
      );
      if (review) {
        setExistingReview(review);
        setIsEditMode(true);
        loadReviewData(review);
      } else {
        setExistingReview(null);
        setIsEditMode(false);
      }
    };
    checkExistingReview();
  }, [formData.selectedCourseId, profileData]);

  const loadReviewData = (review) => {
    const aspectoMap = {
      1: "dominio", 2: "claridad", 3: "flexibilidad", 4: "evaluacion",
      5: "puntualidad", 6: "trato", 7: "disponibilidad", 8: "material", 9: "facilidad",
    };
    const newFormData = { ...formData };
    review.detalles.forEach((aspecto) => {
      const key = aspectoMap[aspecto.aspecto?.id];
      if (key) newFormData[key] = aspecto.valor;
    });
    setFormData(newFormData);
  };

  const availableYears = [...new Set(availableCourses.map((c) => c.year.toString()))]
    .map((year) => ({ label: year, value: year }))
    .sort((a, b) => b.value - a.value);

  const availablePeriods = formData.year
    ? availableCourses
      .filter((c) => c.year.toString() === formData.year)
      .map((c) => c.periodo.toString())
    : [];

  const getCategoryIcon = (key) => {
    switch (key) {
      case "facilidad": return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
      case "dominio": return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
      case "claridad": return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>;
      case "flexibilidad": return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
      case "evaluacion": return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
      case "puntualidad": return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case "trato": return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case "disponibilidad": return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
      case "material": return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9l-2-2H5a2 2 0 01-2 2v10a2 2 0 012 2z" /></svg>;
      default: return null;
    }
  };

  const categories = [
    {
      key: "facilidad",
      label: "Facilidad",
      description: "Evalúa qué tan fácil o difícil es aprobar la materia con este docente.",
    },
    {
      key: "dominio",
      label: "Dominio",
      description: "Evalúa qué tan bien el docente conoce y maneja los temas de la materia.",
    },
    {
      key: "claridad",
      label: "Claridad",
      description: "Valora qué tan claro y comprensible es el docente al explicar los conceptos.",
    },
    {
      key: "flexibilidad",
      label: "Flexibilidad",
      description: "Mide la capacidad del docente para adaptarse a las necesidades de los estudiantes y ser flexible con plazos y métodos de enseñanza.",
    },
    {
      key: "evaluacion",
      label: "Evaluación",
      description: "Evalúa si los exámenes y evaluaciones son justos y acordes a lo enseñado.",
    },
    {
      key: "puntualidad",
      label: "Puntualidad",
      description: "Valora la puntualidad del docente en clases y entrega de calificaciones.",
    },
    {
      key: "trato",
      label: "Trato",
      description: "Mide el respeto, la cordialidad y la disposición del docente hacia los estudiantes.",
    },
    {
      key: "disponibilidad",
      label: "Disponibilidad",
      description: "Evalúa qué tan accesible es el docente fuera de clase para consultas y apoyo.",
    },
    {
      key: "material",
      label: "Material",
      description: "Valora la calidad y utilidad del material proporcionado por el docente.",
    },
  ];

  const handleRatingClick = (category, value) => {
    setFormData((prev) => ({ ...prev, [category]: value }));
  };

  const handlePeriodClick = (period) => {
    const course = availableCourses.find(
      (c) => c.year.toString() === formData.year && c.periodo.toString() === period
    );
    if (course) {
      setFormData((prev) => ({ ...prev, selectedCourseId: course.id, period: period }));
    }
  };

  const submitReview = async () => {
    const aspectoMap = {
      dominio: 1, claridad: 2, flexibilidad: 3, evaluacion: 4,
      puntualidad: 5, trato: 6, disponibilidad: 7, material: 8, facilidad: 9,
    };
    const aspectos = categories.map((cat) => ({
      aspecto: aspectoMap[cat.key],
      valor: formData[cat.key],
    }));
    const reviewData = { curso: formData.selectedCourseId, aspectos: aspectos };

    try {
      setIsSubmitting(true);
      if (isEditMode && existingReview) {
        await updateReview(existingReview.id, reviewData);
      } else {
        await createReview(reviewData);
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ category, value }) => (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleRatingClick(category, star)}
          className={`transition-all duration-200 transform hover:scale-125 ${
            star <= value ? "text-yellow-400" : "text-gray-200 hover:text-yellow-200"
          }`}
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );

  const handleDelete = () => {
    if (!existingReview) return;
    confirmDialog({
      message: "¿Estás seguro de que deseas eliminar esta reseña permanentemente?",
      header: "Confirmar Eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí, eliminar",
      rejectLabel: "Cancelar",
      acceptClassName: "bg-red-500 border-0",
      accept: async () => {
        try {
          setIsSubmitting(true);
          await deleteReview(existingReview.id);
          if (onSuccess) onSuccess();
        } catch (error) {
          console.error(error);
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };

  const handleSubmit = () => {
    const isComplete = categories.every((cat) => formData[cat.key] !== null);
    if (!isComplete) {
      alert("Por favor completa todas las calificaciones");
      return;
    }

    confirmDialog({
      message: isEditMode 
        ? "¿Estás seguro de que deseas actualizar esta reseña?" 
        : "¿Estás seguro de que deseas enviar esta reseña?",
      header: isEditMode ? "Confirmar Actualización" : "Confirmar Envío",
      icon: "pi pi-info-circle",
      acceptLabel: isEditMode ? "Actualizar" : "Enviar",
      rejectLabel: "Cancelar",
      accept: submitReview,
    });
  };

  return (
    <div className="bg-[#F8FAFC] max-h-[90vh] overflow-y-auto rounded-[3rem]">
      <ConfirmDialog 
        className="rounded-[2.5rem] overflow-hidden" 
        pt={{
          root: { className: "bg-white shadow-2xl border-0 overflow-hidden" },
          header: { className: "bg-navy text-white p-8 flex justify-center" },
          content: { className: "bg-white p-10 text-xl font-medium leading-relaxed text-navy text-center" },
          footer: { className: "bg-gray-50 p-8 gap-4 flex justify-center items-center" },
          acceptButton: { className: "bg-navy px-10 py-4 rounded-2xl border-0 font-bold text-white hover:bg-dark-navy transition-colors" },
          rejectButton: { className: "bg-gray-200 text-gray-700 px-10 py-4 rounded-2xl border-0 font-bold hover:bg-gray-300 transition-colors" }
        }}
      />

      {/* Hero Section */}
      <div className="bg-navy p-6 md:p-10 lg:p-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <svg className="w-40 h-40 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 110 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
          </svg>
        </div>

        <button 
          onClick={onSuccess}
          className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <span className="inline-block px-3 py-1 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
          {isEditMode ? "Modificar" : "Nuevo Reporte"}
        </span>
        <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-2 tracking-tight">
          {isEditMode ? "Actualizar Reseña" : "Evaluar Docente"}
        </h2>
        <p className="text-blue-100 text-lg font-bold">
          {subjectName} • <span className="text-white">{teacherName}</span>
        </p>
      </div>

      <div className="p-4 md:p-10 lg:p-14 space-y-12">
        {/* Selección de Periodo */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-navy rounded-full"></div>
             <h4 className="text-xl font-black text-navy uppercase tracking-tight">Periodo Lectivo</h4>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Año de cursado</label>
              <Dropdown
                value={formData.year}
                onChange={(e) => setFormData((prev) => ({ ...prev, year: e.value, period: "", selectedCourseId: null }))}
                options={availableYears}
                placeholder="Escoge el año..."
                className="w-full h-16 border-2 border-gray-100 bg-gray-50/50 rounded-2xl transition-all font-bold text-navy"
                pt={{
                  input: { className: "px-8 py-5" },
                  trigger: { className: "w-16" },
                  panel: { className: "bg-white shadow-2xl rounded-2xl mt-4 border-0 overflow-hidden ring-1 ring-black/5" },
                  item: { className: "p-5 font-bold text-gray-500 hover:bg-navy hover:text-white transition-colors" }
                }}
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Semestre</label>
              <div className="flex gap-4">
                {[1, 2].map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePeriodClick(p.toString())}
                    disabled={!formData.year || !availablePeriods.includes(p.toString())}
                    className={`flex-1 h-16 rounded-2xl font-black transition-all ${
                      formData.period === p.toString()
                        ? "bg-navy text-white shadow-lg"
                        : availablePeriods.includes(p.toString())
                          ? "bg-gray-50 text-navy hover:bg-navy hover:text-white"
                          : "bg-gray-50 text-gray-200 cursor-not-allowed"
                    }`}
                  >
                    {p}° Semestre
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Calificaciones */}
        <section className={`space-y-8 transition-opacity duration-500 ${!formData.selectedCourseId ? "opacity-20 pointer-events-none" : "opacity-100"}`}>
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-navy rounded-full"></div>
             <h4 className="text-xl font-black text-navy uppercase tracking-tight">Calificación Detallada</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => (
              <div 
                key={category.key}
                className={`p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl ${
                  formData[category.key] ? "border-navy/10" : "hover:border-navy/20"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-navy/5 text-navy rounded-xl">
                      {getCategoryIcon(category.key)}
                    </div>
                    <div>
                      <h5 className="font-black text-navy leading-none mb-1">{category.label}</h5>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{category.description}</span>
                    </div>
                  </div>
                  {formData[category.key] && (
                    <span className="bg-navy/10 text-navy text-xs font-black px-3 py-1 rounded-full">
                      {formData[category.key]}/5
                    </span>
                  )}
                </div>
                <StarRating category={category.key} value={formData[category.key]} />
              </div>
            ))}
          </div>
        </section>

        {/* Acciones */}
        <div className={`flex flex-col md:flex-row gap-4 pt-4 transition-all duration-500 ${!formData.selectedCourseId ? "translate-y-10 opacity-0" : "translate-y-0 opacity-100"}`}>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !categories.every(c => formData[c.key])}
            className="flex-1 bg-navy text-white h-20 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-xl shadow-navy/20 hover:bg-dark-navy hover:-translate-y-1 transition-all disabled:opacity-20 active:scale-95 flex items-center justify-center gap-4"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-6 w-6 border-3 border-white/20 border-t-white"></div>
            ) : (
              <>
                <span>{isEditMode ? "Actualizar Mi Reseña" : "Publicar Mi Reseña"}</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              </>
            )}
          </button>

          {isEditMode && (
            <button
               onClick={handleDelete}
               className="md:w-auto px-10 h-20 bg-red-50 text-red-500 rounded-[2rem] font-bold uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-all active:scale-95"
            >
              Borrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
