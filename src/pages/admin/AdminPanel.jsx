import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useReview } from "../../hooks/useReview";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const TabButton = ({ active, onClick, icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 ${
      active
        ? "bg-navy text-white shadow-lg shadow-navy/20"
        : "bg-white text-gray-400 hover:text-navy hover:bg-gray-50 border border-gray-100"
    }`}
  >
    {icon}
    <span>{label}</span>
    {count !== undefined && (
      <span className={`px-2 py-0.5 rounded-lg text-[10px] ${
        active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
      }`}>
        {count}
      </span>
    )}
  </button>
);

const Toast = ({ toast, onClose }) => {
  if (!toast) return null;
  return (
    <div
      className={`fixed bottom-8 right-8 z-[500] px-6 py-4 rounded-2xl shadow-2xl text-white font-bold flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 ${
        toast.type === "success"
          ? "bg-emerald-600 shadow-emerald-600/20"
          : toast.type === "error"
          ? "bg-rose-600 shadow-rose-600/20"
          : "bg-blue-600 shadow-blue-600/20"
      }`}
    >
      <span>{toast.text}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 font-black text-lg leading-none">
        ×
      </button>
    </div>
  );
};

const LoadingState = () => (
  <div className="flex flex-col justify-center items-center py-32 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
    <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-600"></div>
    <p className="mt-4 text-gray-500 font-bold animate-pulse">Cargando...</p>
  </div>
);

const EmptyState = ({ icon, title, message }) => (
  <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 max-w-4xl mx-auto p-8">
    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100">
      {icon}
    </div>
    <h3 className="text-2xl font-black text-navy uppercase tracking-tight mb-2">{title}</h3>
    <p className="text-gray-500 font-medium max-w-md mx-auto leading-relaxed">{message}</p>
  </div>
);

function ReportCard({ report, onApprove, onReject, isProcessing }) {
  const commentAuthor = report.Comentario?.ReviewCab?.Alumno;
  const reporter = report.Reporter;
  const commentText = report.Comentario?.texto;
  const isBanned = report.Comentario?.is_banned;
  const createdDate = new Date(report.created_at).toLocaleDateString("es-ES", {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-gray-200/30 p-6 md:p-8 hover:shadow-2xl hover:border-blue-100 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 left-0 w-2 h-full bg-rose-500 rounded-l-[2.5rem]"></div>

      <div>
        {/* Header: comment author + date */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center font-black uppercase text-base">
              {commentAuthor?.nombre?.charAt(0) || "?"}
            </div>
            <div>
              <h4 className="font-black text-navy leading-tight text-sm">
                {commentAuthor?.nombre || "Usuario"}
              </h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                {commentAuthor?.correo || ""}
              </p>
            </div>
          </div>
          <span className="text-[10px] text-gray-400 font-bold bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1 uppercase whitespace-nowrap">
            {createdDate}
          </span>
        </div>

        {/* Comment text */}
        <div className="mb-5">
          <span className="text-[9px] text-rose-600 font-black uppercase tracking-widest block mb-1">
            Comentario Reportado
          </span>
          <div className="bg-rose-50/20 border border-rose-100/50 p-5 rounded-2xl relative">
            <span className="absolute -top-3 left-4 text-3xl font-serif text-rose-300 leading-none">"</span>
            {isBanned ? (
              <p className="text-gray-400 italic font-bold flex items-center gap-2 relative z-10">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Comentario ya baneado
              </p>
            ) : (
              <p className="text-gray-700 font-semibold italic text-sm leading-relaxed relative z-10">
                {commentText}
              </p>
            )}
          </div>
        </div>

        {/* Reporter info */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center font-black text-xs shrink-0">
              {reporter?.nombre?.charAt(0) || "?"}
            </div>
            <div className="min-w-0">
              <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest block mb-0.5">
                Reportado por
              </span>
              <span className="font-bold text-navy text-xs block truncate">
                {reporter?.nombre || "Anónimo"}
              </span>
              <span className="text-[9px] text-gray-400 font-bold block mt-0.5">
                Motivo: <span className="text-amber-600 uppercase">{report.reason_type}</span>
              </span>
              {report.reason_detail && (
                <p className="text-[10px] text-gray-500 font-medium mt-1 leading-relaxed bg-white rounded-xl p-2.5 border border-gray-100">
                  {report.reason_detail}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 border-t border-gray-100 pt-6 mt-2">
        <button
          onClick={() => onReject(report.id)}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 disabled:opacity-40"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Rechazar Reporte
        </button>
        <button
          onClick={() => onApprove(report.id)}
          disabled={isProcessing || isBanned}
          className="flex-1 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-600/10 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 disabled:opacity-40"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Aprobar & Banear
        </button>
      </div>
    </div>
  );
}

function ReviewCard({ review, onBan, isProcessing }) {
  const authorName = review.alumno?.nombre || "Anónimo";
  const courseName = review.curso?.seccion?.materia?.nombre || "Materia";
  const teacherName = review.curso?.seccion?.docente?.nombre || "Docente";
  const dateStr = new Date(review.fecha).toLocaleDateString("es-ES", {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
  const comentario = review.comentario;
  const alreadyBanned = comentario?.is_banned;

  if (!comentario?.texto && !alreadyBanned) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-gray-200/30 p-6 md:p-8 hover:shadow-2xl hover:border-blue-100 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-2 h-full rounded-l-[2.5rem] ${
        alreadyBanned ? "bg-gray-400" : "bg-blue-600"
      }`}></div>

      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black uppercase text-base">
              {authorName.charAt(0)}
            </div>
            <div>
              <h4 className="font-black text-navy leading-tight text-sm">{authorName}</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                {review.alumno?.correo || ""}
              </p>
            </div>
          </div>
          <span className="text-[10px] text-gray-400 font-bold bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1 uppercase whitespace-nowrap">
            {dateStr}
          </span>
        </div>

        <div className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-4 mb-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest block mb-0.5">Asignatura</span>
              <span className="font-extrabold text-navy text-xs uppercase truncate block">{courseName}</span>
            </div>
            <div>
              <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest block mb-0.5">Docente</span>
              <span className="font-extrabold text-navy text-xs uppercase truncate block">{teacherName}</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <span className="text-[9px] text-blue-600 font-black uppercase tracking-widest block mb-1">Comentario</span>
          <div className={`p-5 rounded-2xl relative ${
            alreadyBanned ? "bg-gray-50 border border-gray-100" : "bg-blue-50/20 border border-blue-100/50"
          }`}>
            {alreadyBanned ? (
              <p className="text-gray-400 italic font-bold flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Comentario baneado
              </p>
            ) : (
              <>
                <span className="absolute -top-3 left-4 text-3xl font-serif text-blue-300 leading-none">"</span>
                <p className="text-gray-700 font-semibold italic text-sm leading-relaxed relative z-10 break-words">{comentario.texto}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 border-t border-gray-100 pt-6 mt-2">
        {alreadyBanned ? (
          <div className="flex-1 text-center py-3 rounded-2xl bg-gray-50 text-gray-400 font-black text-xs uppercase tracking-wider">
            Ya baneado
          </div>
        ) : (
          <button
            onClick={() => onBan(comentario.id, review.id)}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-500 hover:text-white text-red-600 border-2 border-red-100 hover:border-red-200 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 disabled:opacity-40"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            Banear Comentario
          </button>
        )}
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const { approveReport, rejectReport, banComment, approveComentarioModeration, rechazarComentarioModeration } = useReview();
  const [activeTab, setActiveTab] = useState("pendientes");
  const [toast, setToast] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 12;

  const showToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Reports query
  const {
    data: reports = [],
    isLoading: reportsLoading,
    refetch: refetchReports,
  } = useQuery({
    queryKey: ["pendingReports"],
    queryFn: async () => {
      const { data } = await api.get("/reports");
      return data.data || [];
    },
  });

  // Pending reviews query (moderation queue)
  const [pendingPage, setPendingPage] = useState(1);
  const {
    data: pendingData = { data: [], meta: { total: 0, totalPages: 1 } },
    isLoading: pendingLoading,
    refetch: refetchPending,
  } = useQuery({
    queryKey: ["moderacionPendientes", pendingPage],
    queryFn: async () => {
      const { data } = await api.get("/reviews/moderacion/pendientes", {
        params: { page: pendingPage, limit: 6 },
      });
      return data;
    },
    placeholderData: (prev) => prev,
  });

  // Reviews query (for browsing)
  const {
    data: reviewsData = { data: [], meta: { total: 0, totalPages: 1 } },
    isLoading: reviewsLoading,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: ["allReviews", page],
    queryFn: async () => {
      const { data } = await api.get("/reviews", { params: { page, limit } });
      return data;
    },
    placeholderData: (prev) => prev,
  });

  const handleApproveReport = async (reportId) => {
    setProcessing(reportId);
    try {
      await approveReport(reportId);
      showToast("Reporte aprobado. El comentario ha sido baneado.");
      refetchReports();
    } catch {
      showToast("Error al aprobar el reporte.", "error");
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectReport = async (reportId) => {
    if (!window.confirm("¿Rechazar este reporte? El comentario permanecerá visible.")) return;
    setProcessing(reportId);
    try {
      await rejectReport(reportId);
      showToast("Reporte rechazado. El comentario sigue visible.", "info");
      refetchReports();
    } catch {
      showToast("Error al rechazar el reporte.", "error");
    } finally {
      setProcessing(null);
    }
  };

  const handleBanComment = async (comentarioId, reviewId) => {
    if (!window.confirm("¿Banear este comentario? Se ocultará para todos los usuarios. Esta acción no se puede deshacer.")) return;
    setProcessing(`${comentarioId}-${reviewId}`);
    try {
      await banComment(comentarioId);
      showToast("Comentario baneado exitosamente.", "success");
      refetchReviews();
      refetchReports();
    } catch {
      showToast("Error al banear el comentario.", "error");
    } finally {
      setProcessing(null);
    }
  };

  const handleApprovePending = async (reviewId) => {
    setProcessing(`approve-${reviewId}`);
    try {
      await approveComentarioModeration(reviewId);
      showToast("Comentario aprobado. Ya es visible para la comunidad.");
      refetchPending();
    } catch {
      showToast("Error al aprobar el comentario.", "error");
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectPending = async (reviewId) => {
    if (!window.confirm("¿Rechazar este comentario? Se eliminará permanentemente.")) return;
    setProcessing(`reject-${reviewId}`);
    try {
      await rechazarComentarioModeration(reviewId);
      showToast("Comentario rechazado y eliminado.", "info");
      refetchPending();
    } catch {
      showToast("Error al rechazar el comentario.", "error");
    } finally {
      setProcessing(null);
    }
  };

  const reviewsList = reviewsData.data || [];
  const totalPages = reviewsData.meta?.totalPages || 1;

  return (
    <div className="min-h-screen pb-16 bg-[#F8FAFC]">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-8">
        {/* Header */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-navy tracking-tight">Panel de Administración</h1>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Moderación de reseñas escritas</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-navy hover:bg-dark-navy text-white px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-md shadow-navy/10"
            >
              Volver al Dashboard
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mt-8 flex-wrap">
            <TabButton
              active={activeTab === "pendientes"}
              onClick={() => { setActiveTab("pendientes"); setPendingPage(1); }}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              }
              label="Pendientes"
              count={pendingData.meta?.total}
            />
            <TabButton
              active={activeTab === "reportes"}
              onClick={() => setActiveTab("reportes")}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
              label="Reportes"
              count={reports.length}
            />
            <TabButton
              active={activeTab === "baneos"}
              onClick={() => setActiveTab("baneos")}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              }
              label="Baneos Directos"
            />
          </div>
        </div>

        {/* Tab: Pendientes */}
        {activeTab === "pendientes" && (
          <>
            {pendingLoading ? (
              <LoadingState />
            ) : pendingData.data?.length === 0 ? (
              <EmptyState
                icon={
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title="¡Todo al día!"
                message="No hay comentarios pendientes de aprobación."
              />
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {pendingData.data.map((review) => {
                    const authorName = review.alumno?.nombre || "Anónimo";
                    const courseName = review.curso?.seccion?.materia?.nombre || "Materia";
                    const teacherName = review.curso?.seccion?.docente?.nombre || "Docente";
                    const dateStr = new Date(review.fecha).toLocaleDateString("es-ES", {
                      year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
                    });

                    return (
                      <div key={review.id} className="bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-gray-200/30 p-6 md:p-8 hover:shadow-2xl hover:border-blue-100 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-amber-500 rounded-l-[2.5rem]"></div>

                        <div>
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-black uppercase text-base">
                                {authorName.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-black text-navy leading-tight text-sm">{authorName}</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{review.alumno?.correo || ""}</p>
                              </div>
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1 uppercase whitespace-nowrap">{dateStr}</span>
                          </div>

                          <div className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-4 mb-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest block mb-0.5">Asignatura</span>
                                <span className="font-extrabold text-navy text-xs uppercase truncate block">{courseName}</span>
                              </div>
                              <div>
                                <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest block mb-0.5">Docente</span>
                                <span className="font-extrabold text-navy text-xs uppercase truncate block">{teacherName}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mb-6">
                            <span className="text-[9px] text-amber-600 font-black uppercase tracking-widest block mb-1">Comentario pendiente</span>
                            <div className="bg-amber-50/20 border border-amber-100/50 p-5 rounded-2xl relative">
                              <span className="absolute -top-3 left-4 text-3xl font-serif text-amber-300 leading-none">"</span>
                              <p className="text-gray-700 font-semibold italic text-sm leading-relaxed relative z-10">{review.comentario?.texto}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4 border-t border-gray-100 pt-6 mt-2">
                          <button
                            onClick={() => handleRejectPending(review.id)}
                            disabled={processing === `reject-${review.id}`}
                            className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-rose-100 hover:border-rose-200 hover:bg-rose-50/50 text-rose-600 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 disabled:opacity-40"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Rechazar
                          </button>
                          <button
                            onClick={() => handleApprovePending(review.id)}
                            disabled={processing === `approve-${review.id}`}
                            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/10 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 disabled:opacity-40"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            Aprobar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {pendingData.meta?.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 pt-8">
                    <button disabled={pendingPage === 1} onClick={() => setPendingPage((p) => Math.max(1, p - 1))}
                      className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-navy disabled:opacity-40 transition-all font-bold">«</button>
                    <span className="text-xs font-black text-navy uppercase tracking-wider">Página {pendingPage} de {pendingData.meta?.totalPages}</span>
                    <button disabled={pendingPage === pendingData.meta?.totalPages} onClick={() => setPendingPage((p) => Math.min(pendingData.meta?.totalPages, p + 1))}
                      className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-navy disabled:opacity-40 transition-all font-bold">»</button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Tab: Reportes */}
        {activeTab === "reportes" && (
          <>
            {reportsLoading ? (
              <LoadingState />
            ) : reports.length === 0 ? (
              <EmptyState
                icon={
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title="¡Todo al día!"
                message="No hay reportes pendientes de revisión en este momento."
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {reports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    onApprove={handleApproveReport}
                    onReject={handleRejectReport}
                    isProcessing={processing === report.id}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Tab: Baneos Directos */}
        {activeTab === "baneos" && (
          <>
            {reviewsLoading ? (
              <LoadingState />
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {reviewsList.length === 0 ? (
                    <div className="col-span-full">
                      <EmptyState
                        icon={
                          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        }
                        title="Sin reseñas"
                        message="No se encontraron reseñas escritas."
                      />
                    </div>
                  ) : (
                    reviewsList.map((review) => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        onBan={handleBanComment}
                        isProcessing={processing === `${review.comentario?.id}-${review.id}`}
                      />
                    ))
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 pt-8">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-navy disabled:opacity-40 transition-all font-bold"
                    >
                      «
                    </button>
                    <span className="text-xs font-black text-navy uppercase tracking-wider">
                      Página {page} de {totalPages}
                    </span>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-navy disabled:opacity-40 transition-all font-bold"
                    >
                      »
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}