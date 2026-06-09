import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { useReview } from "../../hooks/useReview";

const REPORT_REASONS = [
  { label: "Contenido inapropiado", value: "contenido_inapropiado" },
  { label: "Spam", value: "spam" },
  { label: "Información falsa", value: "informacion_falsa" },
  { label: "Acoso", value: "acoso" },
  { label: "Otro", value: "otro" },
];

export default function ReportCommentModal({ visible, onHide, review, onSuccess }) {
  const { reportComentario } = useReview();
  const [reasonType, setReasonType] = useState(null);
  const [reasonDetail, setReasonDetail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!reasonType) {
      setError("Seleccioná un motivo para el reporte.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await reportComentario(review.id, { reason_type: reasonType, reason_detail: reasonDetail || undefined });
      setSuccess(true);
      setTimeout(() => {
        onHide();
        if (onSuccess) onSuccess(review.id);
      }, 1500);
    } catch (err) {
      if (err?.response?.status === 409) {
        setError("Ya reportaste este comentario anteriormente.");
      } else {
        setError(err?.response?.data?.message || "Error al enviar el reporte. Intentá de nuevo.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setReasonType(null);
      setReasonDetail("");
      setSuccess(false);
      setError(null);
      onHide();
    }
  };

  return (
    <Dialog
      visible={visible}
      style={{ width: "95vw", maxWidth: "500px" }}
      onHide={handleClose}
      dismissableMask={!submitting}
      modal={true}
      showHeader={false}
      contentClassName="p-0 rounded-[2rem] overflow-hidden shadow-2xl"
      maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(8px)" }}
    >
      <div className="bg-white dark:bg-gray-800 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-8 bg-red-500 rounded-full"></div>
          <h3 className="text-2xl font-black text-navy dark:text-gray-100 uppercase tracking-tight">
            Reportar Comentario
          </h3>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-6 leading-relaxed">
          Este comentario será revisado por nuestro equipo de moderación. Tu identidad permanecerá anónima.
        </p>

        {success ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-black text-green-600 dark:text-green-400">Reporte enviado</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 font-semibold mt-1">Gracias por ayudar a mejorar la comunidad.</p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
                Motivo del reporte <span className="text-red-500">*</span>
              </label>
              <Dropdown
                value={reasonType}
                onChange={(e) => { setReasonType(e.value); setError(null); }}
                options={REPORT_REASONS}
                placeholder="Seleccioná un motivo..."
                className="w-full h-14 border-2 border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 rounded-2xl transition-all font-bold text-navy dark:text-gray-100"
                pt={{
                  root: { className: "bg-gray-50/50 dark:bg-gray-900" },
                  input: { className: "px-6 py-4" },
                  trigger: { className: "w-14 text-gray-400 dark:text-gray-500" },
                  panel: { className: "bg-white dark:bg-gray-800 shadow-2xl rounded-2xl mt-2 border-0 overflow-hidden ring-1 ring-black/5" },
                  list: { className: "bg-white dark:bg-gray-800" },
                  item: { className: "p-4 font-bold text-gray-500 dark:text-gray-300 hover:bg-navy hover:text-white transition-colors dark:hover:bg-gray-700" }
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
                Detalles adicionales <span className="text-gray-300 dark:text-gray-600">(opcional)</span>
              </label>
              <textarea
                value={reasonDetail}
                onChange={(e) => setReasonDetail(e.target.value.slice(0, 500))}
                placeholder="Contanos más detalles para ayudarnos a moderar..."
                rows={4}
                className="w-full p-4 bg-gray-50/50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-700 rounded-2xl font-semibold text-navy dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600 resize-none focus:outline-none focus:border-navy/30 dark:focus:border-gray-500 transition-colors"
              />
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold text-right">{reasonDetail.length}/500</p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-2.5">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleClose}
                disabled={submitting}
                className="flex-1 h-14 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-black rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !reasonType}
                className="flex-1 h-14 bg-red-500 text-white font-black rounded-2xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Enviando...
                  </>
                ) : (
                  "Enviar Reporte"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
