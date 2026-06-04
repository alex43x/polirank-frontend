import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useReview } from "../../hooks/useReview";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/api";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import ReportCommentModal from "./ReportCommentModal";
import { getBadge, getBadgeStyles } from "../../constants/badges";

export default function CommentsSection({ sectionId }) {
  const { user, profileData } = useAuth();
  const { voteComentario, deleteVoteComentario, deleteComentario } = useReview();
  const userContributions = (profileData?.reviews?.rows?.length || 0) + (profileData?.tries?.rows?.length || 0);
  const userBadge = getBadge(userContributions);
  const userBadgeStyle = getBadgeStyles(userBadge.color);
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("popular"); // recent, popular
  const [reportModalReview, setReportModalReview] = useState(null);
  const [reportedComments, setReportedComments] = useState(new Set());
  const [voteMessage, setVoteMessage] = useState(null);

  // Fetch courses for section
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["coursesBySection", sectionId],
    queryFn: async () => {
      const { data } = await api.get(`/sections/${sectionId}/cursos`);
      return data.data?.cursos || [];
    },
    enabled: !!sectionId,
  });

  // Fetch all reviews for these courses
  const { data: allReviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviewsForSection", sectionId, courses.map(c => c.id)],
    queryFn: async () => {
      if (courses.length === 0) return [];
      const reviewPromises = courses.map(c => api.get(`/cursos/${c.id}/reviews?limit=100`));
      const results = await Promise.all(reviewPromises);
      const reviews = results.flatMap(res => res.data.data || []);
      return reviews;
    },
    enabled: courses.length > 0,
  });

  // Filter reviews to only those with comments
  const comments = useMemo(() => {
    let filtered = allReviews.filter(r => r.comentario?.texto);
    
    if (filter === "popular") {
      filtered.sort((a, b) => (b.comentario?.puntuacion || 0) - (a.comentario?.puntuacion || 0));
    } else {
      filtered.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    }
    
    return filtered;
  }, [allReviews, filter]);

  const showVoteMessage = (text, type = "error") => {
    setVoteMessage({ text, type });
    setTimeout(() => setVoteMessage(null), 3000);
  };

  const handleVote = async (review, valor) => {
    if (user?.rol?.nombre === "GUEST" || !user) {
      showVoteMessage("Debés iniciar sesión para votar");
      return;
    }
    const isOwner = review.alumno?.id != null && user?.id != null && Number(review.alumno.id) === Number(user.id);
    if (isOwner) {
      showVoteMessage("No podés votar tu propio comentario");
      return;
    }
    try {
      await voteComentario(review.id, valor);
      queryClient.invalidateQueries(["reviewsForSection", sectionId]);
    } catch (error) {
      showVoteMessage("Error al registrar voto");
    }
  };

  const handleDeleteVote = async (review) => {
    try {
      await deleteVoteComentario(review.id);
      queryClient.invalidateQueries(["reviewsForSection", sectionId]);
    } catch (error) {
      alert("Error al eliminar voto");
    }
  };

  const handleDeleteComment = (review) => {
    confirmDialog({
      group: "commentsSection",
      message: "¿Estás seguro de que deseas eliminar tu comentario? Esta acción no se puede deshacer.",
      header: "Eliminar Comentario",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí, eliminar",
      rejectLabel: "Cancelar",
      acceptClassName: "bg-red-500 border-0 text-white",
      accept: async () => {
        try {
          await deleteComentario(review.id);
          queryClient.invalidateQueries(["reviewsForSection", sectionId]);
        } catch (error) {
          alert("Error al eliminar comentario");
        }
      },
    });
  };

  if (coursesLoading || reviewsLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm mt-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy"></div>
        <p className="mt-4 text-gray-400 dark:text-gray-500 font-medium italic">Cargando comentarios...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none p-6 md:p-10  relative">
      <ConfirmDialog 
        group="commentsSection"
        className="rounded-[2.5rem] overflow-hidden" 
        pt={{
          root: { className: "bg-white dark:bg-gray-800 shadow-2xl border-0 overflow-hidden" },
          header: { className: "bg-navy text-white p-6 flex justify-center" },
          content: { className: "bg-white dark:bg-gray-800 p-8 text-lg font-medium leading-relaxed text-navy dark:text-gray-100 text-center" },
          footer: { className: "bg-gray-50 dark:bg-gray-800 p-6 gap-4 flex justify-center items-center" },
          acceptButton: { className: "bg-red-500 px-8 py-3 rounded-2xl border-0 font-bold text-white hover:bg-red-600 transition-colors" },
          rejectButton: { className: "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-8 py-3 rounded-2xl border-0 font-bold hover:bg-gray-300 transition-colors" }
        }}
      />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-black text-navy dark:text-gray-100 uppercase tracking-tight flex items-center gap-3">
            <div className="w-2 h-6 bg-navy rounded-full"></div>
            Comentarios
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-1">Experiencias escritas por otros estudiantes</p>
        </div>

        {comments.length > 0 && (
          <div className="flex bg-gray-50 dark:bg-gray-900 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-700">
            <button
              onClick={() => setFilter("recent")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                filter === "recent" ? "bg-white dark:bg-gray-800 text-navy dark:text-gray-100 shadow-sm" : "text-gray-400 dark:text-gray-500 hover:text-navy dark:hover:text-gray-100"
              }`}
            >
              Más Recientes
            </button>
            <button
              onClick={() => setFilter("popular")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                filter === "popular" ? "bg-white dark:bg-gray-800 text-navy dark:text-gray-100 shadow-sm" : "text-gray-400 dark:text-gray-500 hover:text-navy dark:hover:text-gray-100"
              }`}
            >
              Más Útiles
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
            <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">No hay comentarios aún</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Sé el primero en compartir tu experiencia detallada.</p>
          </div>
        ) : (
          comments.map((review) => {
            const isAdmin = user?.rol?.nombre === "ADMIN";
            const isOwner = review.alumno?.id != null && user?.id != null && Number(review.alumno.id) === Number(user.id);
            const authorName = isAdmin || isOwner ? review.alumno?.nombre || "Alumno Anónimo" : "Alumno Anónimo";
            const dateStr = new Date(review.fecha).toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            
            // Note: Currently we don't have the current user's vote status in the DTO unless we match the vote's student ID
            // Since DTO only returns votosPositivos and votosNegativos.
            // If the user's vote is included in the backend we could display the active state.
            
            return (
              <div key={review.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-navy/5 dark:bg-gray-700 text-navy dark:text-gray-100 rounded-full flex items-center justify-center font-black text-xl">
                      {authorName.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-black text-navy dark:text-gray-100 flex items-center gap-2">
                        {authorName}
                        {isOwner && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${userBadgeStyle.container}`}>
                            {userBadge.icon("w-2.5 h-2.5")}
                            {userBadge.name}
                          </span>
                        )}
                      </h5>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">{dateStr} • {review.curso?.year} - {review.curso?.periodo}S</p>
                    </div>
                  </div>
                  
                  {isOwner && (
                    <button 
                      onClick={() => handleDeleteComment(review)}
                      className="text-gray-300 dark:text-gray-600 hover:text-red-500 transition-colors p-2"
                      title="Eliminar mi comentario"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {review.comentario.bajo_moderacion && isOwner && (
                  <div className="mb-4 p-4 bg-amber-50/80 dark:bg-indigo-500/10 border border-amber-200 dark:border-indigo-500/30 text-amber-800 dark:text-indigo-300 dark:glow-sm rounded-2xl text-xs font-semibold flex items-center gap-2.5">
                    <svg className="w-4.5 h-4.5 text-amber-600 dark:text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Tu comentario está bajo moderación. Es visible temporalmente para ti y los administradores.</span>
                  </div>
                )}

                {review.comentario.bajo_moderacion && !isOwner && !isAdmin ? (
                  <p className="text-gray-400 dark:text-gray-500 italic leading-relaxed font-bold bg-gray-50/50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 border-dashed flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Reseña escrita en proceso de moderación
                  </p>
                ) : (
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium bg-gray-50/50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-50 dark:border-gray-700 break-words whitespace-pre-wrap">
                    {review.comentario.texto}
                  </p>
                )}
                
                {voteMessage && (
                  <div className={`mt-3 p-3 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-in fade-in ${
                    voteMessage.type === "error"
                      ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
                      : "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400"
                  }`}>
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={voteMessage.type === "error" ? "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" : "M5 13l4 4L19 7"} />
                    </svg>
                    {voteMessage.text}
                  </div>
                )}

                {!review.comentario.bajo_moderacion && (
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {user && !isOwner && (
                        reportedComments.has(review.id) ? (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black text-green-600 dark:text-green-400 uppercase tracking-wider">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            Reportado
                          </span>
                        ) : (
                          <button
                            onClick={() => setReportModalReview(review)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors text-[11px] font-black uppercase tracking-wider"
                            title="Reportar comentario"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                            </svg>
                            Reportar
                          </button>
                        )
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">¿Te fue útil?</span>
                      <div className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-full border border-gray-100 dark:border-gray-700 p-1">
                        <button 
                          onClick={() => handleVote(review, 1)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-green-50 text-gray-500 hover:text-green-600 transition-colors"
                          title="Útil"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          <span className="text-xs font-black">{review.comentario.votosPositivos || 0}</span>
                        </button>
                        
                        <div className="w-px h-4 bg-gray-200 mx-1"></div>
                        
                        <button 
                          onClick={() => handleVote(review, -1)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                          title="No es útil"
                        >
                          <span className="text-xs font-black">{review.comentario.votosNegativos || 0}</span>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <ReportCommentModal
        visible={reportModalReview !== null}
        onHide={() => setReportModalReview(null)}
        review={reportModalReview || {}}
        onSuccess={(reviewId) => {
          setReportedComments((prev) => new Set(prev).add(reviewId));
          setReportModalReview(null);
        }}
      />
    </div>
  );
}
