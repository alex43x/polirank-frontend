import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useReview } from "../../hooks/useReview";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const TabButton = ({ active, onClick, icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 ${
      active
        ? "bg-navy dark:bg-indigo-600 text-white shadow-lg shadow-navy/20 dark:shadow-indigo-500/20"
        : "bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-navy dark:hover:text-indigo-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700"
    }`}
  >
    {icon}
    <span>{label}</span>
    {count !== undefined && (
      <span className={`px-2 py-0.5 rounded-lg text-[10px] ${
        active ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
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
  <div className="flex flex-col justify-center items-center py-32 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
    <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-600 dark:border-indigo-400"></div>
    <p className="mt-4 text-gray-500 dark:text-gray-400 font-bold animate-pulse">Cargando...</p>
  </div>
);

const EmptyState = ({ icon, title, message }) => (
  <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/40 dark:shadow-black/10 max-w-4xl mx-auto p-8">
    <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100 dark:border-emerald-900/50">
      {icon}
    </div>
    <h3 className="text-2xl font-black text-navy dark:text-white uppercase tracking-tight mb-2">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 font-medium max-w-md mx-auto leading-relaxed">{message}</p>
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
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-[2.5rem] shadow-xl shadow-gray-200/30 dark:shadow-black/10 p-6 md:p-8 hover:shadow-2xl hover:border-blue-100 dark:hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 left-0 w-2 h-full bg-rose-500 rounded-l-[2.5rem]"></div>

      <div>
        {/* Header: comment author + date */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center font-black uppercase text-base">
              {commentAuthor?.nombre?.charAt(0) || "?"}
            </div>
            <div>
              <h4 className="font-black text-navy dark:text-white leading-tight text-sm">
                {commentAuthor?.nombre || "Usuario"}
              </h4>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                {commentAuthor?.correo || ""}
              </p>
            </div>
          </div>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg px-2.5 py-1 uppercase whitespace-nowrap">
            {createdDate}
          </span>
        </div>

        {/* Comment text */}
        <div className="mb-5">
          <span className="text-[9px] text-rose-600 dark:text-rose-400 font-black uppercase tracking-widest block mb-1">
            Comentario Reportado
          </span>
          <div className="bg-rose-50/20 dark:bg-rose-950/20 border border-rose-100/50 dark:border-rose-900/50 p-5 rounded-2xl relative">
            <span className="absolute -top-3 left-4 text-3xl font-serif text-rose-300 dark:text-rose-700 leading-none">"</span>
            {isBanned ? (
              <p className="text-gray-400 dark:text-gray-500 italic font-bold flex items-center gap-2 relative z-10">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Comentario ya baneado
              </p>
            ) : (
              <p className="text-gray-700 dark:text-gray-300 font-semibold italic text-sm leading-relaxed relative z-10">
                {commentText}
              </p>
            )}
          </div>
        </div>

        {/* Reporter info */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center font-black text-xs shrink-0">
              {reporter?.nombre?.charAt(0) || "?"}
            </div>
            <div className="min-w-0">
              <span className="text-[8px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest block mb-0.5">
                Reportado por
              </span>
              <span className="font-bold text-navy dark:text-white text-xs block truncate">
                {reporter?.nombre || "Anónimo"}
              </span>
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold block mt-0.5">
                Motivo: <span className="text-amber-600 dark:text-amber-400 uppercase">{report.reason_type}</span>
              </span>
              {report.reason_detail && (
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-1 leading-relaxed bg-white dark:bg-gray-800 rounded-xl p-2.5 border border-gray-100 dark:border-gray-700">
                  {report.reason_detail}
                </p>
              )}
            </div>
          </div>
        </div>

      {/* Actions */}
      <div className="flex gap-4 border-t border-gray-100 dark:border-gray-700 pt-6 mt-2">
        <button
          onClick={() => onReject(report.id)}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 disabled:opacity-40"
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
    </div>
  );
}

function ReviewDetailModal({ review, onClose }) {
  if (!review) return null;

  const aspectLabels = {
    "dominio_tema": "Dominio del Tema",
    "claridad": "Claridad",
    "didactica": "Didáctica",
    "evaluacion": "Evaluación",
    "trato_respetuoso": "Trato Respetuoso",
    "accesibilidad": "Accesibilidad",
    "exigencia": "Exigencia",
    "utilidad": "Utilidad",
    "recomendacion": "Recomendación",
  };

  const aspectColors = {
    "dominio_tema": { bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-600 dark:text-blue-400" },
    "claridad": { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-600 dark:text-emerald-400" },
    "didactica": { bg: "bg-violet-50 dark:bg-violet-950/30", text: "text-violet-600 dark:text-violet-400" },
    "evaluacion": { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-600 dark:text-amber-400" },
    "trato_respetuoso": { bg: "bg-rose-50 dark:bg-rose-950/30", text: "text-rose-600 dark:text-rose-400" },
    "accesibilidad": { bg: "bg-cyan-50 dark:bg-cyan-950/30", text: "text-cyan-600 dark:text-cyan-400" },
    "exigencia": { bg: "bg-orange-50 dark:bg-orange-950/30", text: "text-orange-600 dark:text-orange-400" },
    "utilidad": { bg: "bg-teal-50 dark:bg-teal-950/30", text: "text-teal-600 dark:text-teal-400" },
    "recomendacion": { bg: "bg-indigo-50 dark:bg-indigo-950/30", text: "text-indigo-600 dark:text-indigo-400" },
  };

  const renderStars = (val) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-4 h-4 ${star <= val ? "text-amber-400" : "text-gray-200 dark:text-gray-600"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 rounded-t-[2.5rem] p-6 flex items-start justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center font-black uppercase text-lg">
              {review.alumno?.nombre?.charAt(0) || "?"}
            </div>
            <div>
              <h3 className="font-black text-navy dark:text-white text-lg">Reseña Detallada</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                {review.curso?.seccion?.materia?.nombre || "Materia"} — {review.curso?.seccion?.docente?.nombre || "Docente"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-navy dark:hover:text-white transition-all shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest block mb-1">Autor</span>
              <span className="font-extrabold text-navy dark:text-white text-xs block truncate">{review.alumno?.nombre || "Anónimo"}</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold block truncate">{review.alumno?.correo || ""}</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest block mb-1">Materia</span>
              <span className="font-extrabold text-navy dark:text-white text-xs block truncate">{review.curso?.seccion?.materia?.nombre || "—"}</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest block mb-1">Docente</span>
              <span className="font-extrabold text-navy dark:text-white text-xs block truncate">{review.curso?.seccion?.docente?.nombre || "—"}</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest block mb-1">Periodo</span>
              <span className="font-extrabold text-navy dark:text-white text-xs block truncate">{review.curso?.periodo || "—"} {review.curso?.year || ""}</span>
            </div>
          </div>

          {/* Ratings */}
          <div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest block mb-3">Valoraciones</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {(review.detalles || []).map((d) => {
                const colors = aspectColors[d.aspecto?.id] || { bg: "bg-gray-50 dark:bg-gray-900", text: "text-gray-600 dark:text-gray-400" };
                return (
                  <div key={d.aspecto?.id} className={`${colors.bg} border border-gray-100 dark:border-gray-700 rounded-2xl p-4 flex items-center justify-between`}>
                    <span className={`text-[11px] font-black uppercase tracking-wider ${colors.text}`}>
                      {aspectLabels[d.aspecto?.id] || d.aspecto?.nombre || "?"}
                    </span>
                    {renderStars(d.valor)}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comment */}
          <div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest block mb-2">Comentario</span>
            <div className={`p-5 rounded-2xl border ${review.comentario?.is_banned ? "bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-700" : "bg-blue-50/20 dark:bg-blue-950/20 border-blue-100/50 dark:border-blue-900/50"}`}>
              {review.comentario?.is_banned ? (
                <p className="text-gray-400 dark:text-gray-500 italic font-bold flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Comentario baneado
                </p>
              ) : (
                <>
                  <span className="text-3xl font-serif text-blue-300 dark:text-blue-700 leading-none block -mb-4">"</span>
                  <p className="text-gray-700 dark:text-gray-300 font-semibold italic text-sm leading-relaxed break-words">{review.comentario?.texto}</p>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 text-center">
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest block mb-1">Votos Positivos</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400 text-xl">{review.comentario?.votosPositivos || 0}</span>
            </div>
            <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 text-center">
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest block mb-1">Votos Negativos</span>
              <span className="font-black text-rose-600 dark:text-rose-400 text-xl">{review.comentario?.votosNegativos || 0}</span>
            </div>
            <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 text-center">
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest block mb-1">Puntuación</span>
              <span className="font-black text-navy dark:text-white text-xl">{review.comentario?.puntuacion || 0}</span>
            </div>
          </div>

          {/* Status badges */}
          <div className="flex flex-wrap gap-2">
            {review.comentario?.is_banned && (
              <span className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-xl font-black text-[10px] uppercase tracking-wider border border-rose-100 dark:border-rose-900/50">Baneado</span>
            )}
            {review.comentario?.bajo_moderacion && (
              <span className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-xl font-black text-[10px] uppercase tracking-wider border border-amber-100 dark:border-amber-900/50">En moderación</span>
            )}
            {review.comentario?.aprobado && (
              <span className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl font-black text-[10px] uppercase tracking-wider border border-emerald-100 dark:border-emerald-900/50">Aprobado</span>
            )}
            {!review.comentario?.is_banned && !review.comentario?.bajo_moderacion && !review.comentario?.aprobado && (
              <span className="px-3 py-1.5 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400 rounded-xl font-black text-[10px] uppercase tracking-wider border border-yellow-100 dark:border-yellow-900/50">Sin estado</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ review, onBan, isProcessing, onViewDetail }) {
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
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-[2.5rem] shadow-xl shadow-gray-200/30 dark:shadow-black/10 p-6 md:p-8 hover:shadow-2xl hover:border-blue-100 dark:hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-2 h-full rounded-l-[2.5rem] ${
        alreadyBanned ? "bg-gray-400 dark:bg-gray-500" : "bg-blue-600 dark:bg-indigo-500"
      }`}></div>

      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center font-black uppercase text-base">
              {authorName.charAt(0)}
            </div>
            <div>
              <h4 className="font-black text-navy dark:text-white leading-tight text-sm">{authorName}</h4>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                {review.alumno?.correo || ""}
              </p>
            </div>
          </div>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg px-2.5 py-1 uppercase whitespace-nowrap">
            {dateStr}
          </span>
        </div>

        <div className="bg-[#F8FAFC] dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 mb-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[8px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest block mb-0.5">Asignatura</span>
              <span className="font-extrabold text-navy dark:text-white text-xs uppercase truncate block">{courseName}</span>
            </div>
            <div>
              <span className="text-[8px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest block mb-0.5">Docente</span>
              <span className="font-extrabold text-navy dark:text-white text-xs uppercase truncate block">{teacherName}</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <span className="text-[9px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest block mb-1">Comentario</span>
          <div className={`p-5 rounded-2xl relative ${
            alreadyBanned ? "bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700" : "bg-blue-50/20 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/50"
          }`}>
            {alreadyBanned ? (
              <p className="text-gray-400 dark:text-gray-500 italic font-bold flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Comentario baneado
              </p>
            ) : (
              <>
                <span className="absolute -top-3 left-4 text-3xl font-serif text-blue-300 dark:text-blue-700 leading-none">"</span>
                <p className="text-gray-700 dark:text-gray-300 font-semibold italic text-sm leading-relaxed relative z-10 break-words">{comentario.texto}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 border-t border-gray-100 dark:border-gray-700 pt-6 mt-2">
        <button
          onClick={() => onViewDetail(review)}
          className="w-11 h-11 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-navy dark:hover:text-white transition-all shrink-0"
          title="Ver detalle"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
        {alreadyBanned ? (
          <div className="flex-1 text-center py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 font-black text-xs uppercase tracking-wider">
            Ya baneado
          </div>
        ) : (
          <button
            onClick={() => onBan(comentario.id, review.id)}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-2 bg-red-50 dark:bg-red-950/30 hover:bg-red-500 dark:hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 border-2 border-red-100 dark:border-red-900/50 hover:border-red-200 dark:hover:border-red-500 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 disabled:opacity-40"
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
  const queryClient = useQueryClient();
  const { approveReport, rejectReport, banComment, approveComentarioModeration, rechazarComentarioModeration } = useReview();
  const [activeTab, setActiveTab] = useState("pendientes");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);

  const invalidateAllSections = () => {
    queryClient.invalidateQueries({ queryKey: ["reviewsForSection"] });
  };
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
      invalidateAllSections();
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
      invalidateAllSections();
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
      invalidateAllSections();
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
      invalidateAllSections();
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
      invalidateAllSections();
    } catch {
      showToast("Error al rechazar el comentario.", "error");
    } finally {
      setProcessing(null);
    }
  };

  const reviewsList = reviewsData.data || [];
  const totalPages = reviewsData.meta?.totalPages || 1;

  const q = searchQuery.toLowerCase().trim();
  const filteredReviews = q
    ? reviewsList.filter((r) =>
        [r.alumno?.nombre, r.curso?.seccion?.materia?.nombre, r.curso?.seccion?.docente?.nombre, r.comentario?.texto]
          .some((field) => field?.toLowerCase().includes(q))
      )
    : reviewsList;

  const filteredPending = q
    ? (pendingData.data || []).filter((r) =>
        [r.alumno?.nombre, r.curso?.seccion?.materia?.nombre, r.curso?.seccion?.docente?.nombre, r.comentario?.texto]
          .some((field) => field?.toLowerCase().includes(q))
      )
    : (pendingData.data || []);

  const filteredReports = q
    ? reports.filter((r) =>
        [r.Comentario?.ReviewCab?.Alumno?.nombre, r.Comentario?.texto, r.Reporter?.nombre, r.reason_type, r.reason_detail]
          .some((field) => field?.toLowerCase().includes(q))
      )
    : reports;

  return (
    <div className="min-h-screen pb-16 bg-[#F8FAFC] dark:bg-gray-950">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-black/10 p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-navy dark:text-white tracking-tight">Panel de Administración</h1>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-1">Moderación de reseñas escritas</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-navy dark:bg-indigo-600 hover:bg-dark-navy dark:hover:bg-indigo-500 text-white px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-md shadow-navy/10 dark:shadow-indigo-500/20"
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

          {/* Search + Refresh */}
          <div className="flex items-center gap-3 mt-6">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por autor, materia, docente o texto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-bold text-navy dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-blue-300 dark:focus:border-indigo-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-indigo-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              onClick={() => {
                if (activeTab === "pendientes") refetchPending();
                else if (activeTab === "reportes") refetchReports();
                else refetchReviews();
              }}
              className="w-11 h-11 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-navy dark:hover:text-white transition-all active:scale-95 shrink-0"
              title="Actualizar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tab: Pendientes */}
        {activeTab === "pendientes" && (
          <>
            {pendingLoading ? (
              <LoadingState />
            ) : filteredPending.length === 0 ? (
              <EmptyState
                icon={
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title={q ? "Sin resultados" : "¡Todo al día!"}
                message={q ? "No hay pendientes que coincidan con tu búsqueda." : "No hay comentarios pendientes de aprobación."}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {filteredPending.map((review) => {
                    const authorName = review.alumno?.nombre || "Anónimo";
                    const courseName = review.curso?.seccion?.materia?.nombre || "Materia";
                    const teacherName = review.curso?.seccion?.docente?.nombre || "Docente";
                    const dateStr = new Date(review.fecha).toLocaleDateString("es-ES", {
                      year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
                    });

                    return (
                      <div key={review.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-[2.5rem] shadow-xl shadow-gray-200/30 dark:shadow-black/10 p-6 md:p-8 hover:shadow-2xl hover:border-blue-100 dark:hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-amber-500 rounded-l-[2.5rem]"></div>

                        <div>
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center font-black uppercase text-base">
                                {authorName.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-black text-navy dark:text-white leading-tight text-sm">{authorName}</h4>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5">{review.alumno?.correo || ""}</p>
                              </div>
                            </div>
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg px-2.5 py-1 uppercase whitespace-nowrap">{dateStr}</span>
                          </div>

                          <div className="bg-[#F8FAFC] dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 mb-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-[8px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest block mb-0.5">Asignatura</span>
                                <span className="font-extrabold text-navy dark:text-white text-xs uppercase truncate block">{courseName}</span>
                              </div>
                              <div>
                                <span className="text-[8px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest block mb-0.5">Docente</span>
                                <span className="font-extrabold text-navy dark:text-white text-xs uppercase truncate block">{teacherName}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mb-6">
                            <span className="text-[9px] text-amber-600 dark:text-amber-400 font-black uppercase tracking-widest block mb-1">Comentario pendiente</span>
                            <div className="bg-amber-50/20 dark:bg-amber-950/20 border border-amber-100/50 dark:border-amber-900/50 p-5 rounded-2xl relative">
                              <span className="absolute -top-3 left-4 text-3xl font-serif text-amber-300 dark:text-amber-700 leading-none">"</span>
                              <p className="text-gray-700 dark:text-gray-300 font-semibold italic text-sm leading-relaxed relative z-10">{review.comentario?.texto}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4 border-t border-gray-100 dark:border-gray-700 pt-6 mt-2">
                          <button
                            onClick={() => handleRejectPending(review.id)}
                            disabled={processing === `reject-${review.id}`}
                            className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border-2 border-rose-100 dark:border-rose-900/50 hover:border-rose-200 dark:hover:border-rose-700 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 disabled:opacity-40"
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
                      className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-navy dark:hover:text-white disabled:opacity-40 transition-all font-bold">«</button>
                    <span className="text-xs font-black text-navy dark:text-white uppercase tracking-wider">Página {pendingPage} de {pendingData.meta?.totalPages}</span>
                    <button disabled={pendingPage === pendingData.meta?.totalPages} onClick={() => setPendingPage((p) => Math.min(pendingData.meta?.totalPages, p + 1))}
                      className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-navy dark:hover:text-white disabled:opacity-40 transition-all font-bold">»</button>
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
            ) : filteredReports.length === 0 ? (
              <EmptyState
                icon={
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title={q ? "Sin resultados" : "¡Todo al día!"}
                message={q ? "No hay reportes que coincidan con tu búsqueda." : "No hay reportes pendientes de revisión en este momento."}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredReports.map((report) => (
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
                  {filteredReviews.length === 0 ? (
                    <div className="col-span-full">
                      <EmptyState
                        icon={
                          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        }
                        title={q ? "Sin resultados" : "Sin reseñas"}
                        message={q ? "No hay reseñas que coincidan con tu búsqueda." : "No se encontraron reseñas escritas."}
                      />
                    </div>
                  ) : (
                    filteredReviews.map((review) => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        onBan={handleBanComment}
                        isProcessing={processing === `${review.comentario?.id}-${review.id}`}
                        onViewDetail={setSelectedReview}
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
                      className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-navy dark:hover:text-white disabled:opacity-40 transition-all font-bold"
                    >
                      «
                    </button>
                    <span className="text-xs font-black text-navy dark:text-white uppercase tracking-wider">
                      Página {page} de {totalPages}
                    </span>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-navy dark:hover:text-white disabled:opacity-40 transition-all font-bold"
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

      <ReviewDetailModal review={selectedReview} onClose={() => setSelectedReview(null)} />
    </div>
  );
}