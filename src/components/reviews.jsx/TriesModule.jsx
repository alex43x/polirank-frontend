import { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { Chart } from "primereact/chart";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

export default function TriesModule({
  subjectId,
  subjectName,
  attemptsData,
  attemptsLoading,
  profileData,
  onSubmitTry,
  onDeleteTry,
  isSubmitting,
}) {
  const [selectedTryValue, setSelectedTryValue] = useState(null);
  const [existingTry, setExistingTry] = useState(null);

  // Opciones para el dropdown de intentos
  const tryOptions = [
    { label: "1 intento", value: 1 },
    { label: "2 intentos", value: 2 },
    { label: "3 intentos", value: 3 },
    { label: "4 o más intentos", value: 4 },
  ];

  // Verificar si el usuario ya tiene un intento registrado para esta materia
  useEffect(() => {
    if (profileData?.tries?.rows && subjectId) {
      const userTry = profileData.tries.rows.find(
        (t) => t.asignatura?.id === parseInt(subjectId)
      );
      if (userTry) {
        setExistingTry(userTry);
        setSelectedTryValue(userTry.valor);
      } else {
        setExistingTry(null);
        setSelectedTryValue(null);
      }
    }
  }, [profileData?.tries, subjectId]);

  // Preparar datos para el gráfico de dona
  const chartData = {
    labels: ["1 intento", "2 intentos", "3 intentos", "4+ intentos"],
    datasets: [
      {
        data: [
          attemptsData["1_intento"] || 0,
          attemptsData["2_intentos"] || 0,
          attemptsData["3_intentos"] || 0,
          attemptsData["mas_intentos"] || 0,
        ],
        backgroundColor: ["#3b82f6", "#6366f1", "#4f46e5", "#36507D"],
        hoverBackgroundColor: ["#2563eb", "#4f46e5", "#4338ca", "#1e3a5f"],
        borderColor: "rgba(255, 255, 255, 1)",
        borderWidth: 5,
        hoverOffset: 15,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 11, weight: "700" },
          color: "#475569",
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        padding: 12,
        cornerRadius: 12,
        titleFont: { size: 12, weight: "bold" },
        bodyFont: { size: 11 },
        displayColors: false,
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
            return ` ${context.parsed} estudiantes • ${percentage}%`;
          },
        },
      },
    },
    cutout: "70%",
    maintainAspectRatio: false,
    responsive: true,
  };

  const n1 = attemptsData["1_intento"] || 0;
  const n2 = attemptsData["2_intentos"] || 0;
  const n3 = attemptsData["3_intentos"] || 0;
  const n4 = attemptsData["mas_intentos"] || 0;

  const hasAttemptsData = attemptsData && (n1 > 0 || n2 > 0 || n3 > 0 || n4 > 0);

  const totalStudents = n1 + n2 + n3 + n4;

  const successRate = totalStudents > 0 ? ((n1 / totalStudents) * 100).toFixed(1) : 0;

  const weightedAverage = totalStudents > 0
    ? ((n1 * 1 + n2 * 2 + n3 * 3 + n4 * 4) / totalStudents)
    : 0;

  const getInsights = () => {
    const msgs = [];
    const p1 = totalStudents > 0 ? (n1 / totalStudents) * 100 : 0;
    const p2 = totalStudents > 0 ? (n2 / totalStudents) * 100 : 0;
    const p4 = totalStudents > 0 ? (n4 / totalStudents) * 100 : 0;
    const avg = weightedAverage;

    if (totalStudents === 0) {
      msgs.push("Aún no hay datos de otros alumnos. ¡Sé el primero en reportar tus intentos!");
    } else {
      if (totalStudents < 5) {
        msgs.push("Aún hay pocos datos registrados. Entre más alumnos reporten, más precisas serán las estadísticas.");
      } else {
        if (p1 > 60) msgs.push("La mayoría aprueba en 1 intento. ¡Esta materia es bastante accesible!");
        else if (p1 > 40) msgs.push("Más del 40% aprueba en 1 intento, señal de que es una materia llevadera.");
        else if (p1 > 0 && p1 < 20) msgs.push("Menos del 20% aprueba en 1 intento. ¡Esta materia es todo un reto!");
        else if (p1 > 0 && p1 < 25) msgs.push("Solo 1 de cada 4 alumnos aprueba en 1 intento. Prepárate bien.");

        if (p4 > 40) msgs.push("Muchos alumnos necesitan 4+ intentos. Esta materia requiere persistencia.");
        else if (p4 > 25) msgs.push("Un porcentaje significativo de alumnos necesita 4+ intentos. No te desanimes si no es a la primera.");

        if (p1 + p2 > 80) msgs.push("Casi todos aprueban en 1 o 2 intentos. ¡Es de las materias más accesibles!");

        if (avg < 1.5 && avg > 0) msgs.push("El promedio de intentos es muy bajo. Los alumnos aprueban rápido esta materia.");
        else if (avg >= 2.5) msgs.push("El promedio de intentos es alto. Esta materia suele requerir varios intentos.");

        if (totalStudents >= 5) msgs.push(`Ya somos ${totalStudents} alumnos reportando intentos en esta materia.`);
      }
    }

    if (existingTry) {
      const uv = existingTry.valor;
      if (uv === 1 && p1 > 0) msgs.push(`¡Aprobaste al primer intento! Solo el ${p1.toFixed(0)}% de los alumnos lo logra.`);
      else if (uv === 1) msgs.push("¡Aprobaste al primer intento! Sigue así.");
      else if (uv < avg) msgs.push(`¡Vas mejor que el promedio (${avg.toFixed(1)} intentos)! Sigue así.`);
      else if (uv === Math.round(avg)) msgs.push(`Estás justo en el promedio (${avg.toFixed(1)} intentos).`);
    } else {
      msgs.push("Reporta tus intentos para ver cómo te comparas con el resto de alumnos.");
    }

    return msgs;
  };

  const insights = getInsights();

  const handleSubmit = () => {
    if (selectedTryValue === null) return;

    confirmDialog({
      group: "triesModule",
      message: existingTry 
        ? "¿Segur@ que deseas actualizar tu registro de intentos para esta materia?" 
        : "¿Segur@ que deseas registrar esta cantidad de intentos?",
      header: "Confirmar registro",
      icon: "pi pi-info-circle",
      acceptLabel: "Confirmar",
      rejectLabel: "Cancelar",
      accept: () => onSubmitTry(selectedTryValue, existingTry),
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-10">
      <ConfirmDialog 
        group="triesModule"
        className="rounded-[2.5rem] overflow-hidden" 
        pt={{
          root: { className: "bg-white shadow-2xl border-0 overflow-hidden" },
          header: { className: "bg-navy text-white p-6 flex justify-center" },
          content: { className: "bg-white p-8 text-lg font-medium leading-relaxed text-navy text-center" },
          footer: { className: "bg-gray-50 p-6 gap-3 flex justify-center items-center" },
          acceptButton: { className: "bg-navy px-8 py-3 rounded-xl border-0 font-bold text-white hover:bg-dark-navy transition-colors" },
          rejectButton: { className: "bg-gray-200 text-gray-700 px-8 py-3 rounded-xl border-0 font-bold hover:bg-gray-300 transition-colors" }
        }}
      />

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 md:gap-8 items-stretch">
        {/* Lado Izquierdo: Gráfico y Stats Rápidos */}
        <div className="flex flex-col gap-6 w-full">
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 shadow-sm">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2 text-center md:text-left">Muestra</span>
              <div className="flex flex-col items-center md:items-baseline gap-0.5">
                <span className="text-lg md:text-3xl font-black text-navy">{totalStudents}</span>
                <span className="text-[9px] md:text-[11px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">Total Alumnos</span>
              </div>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 shadow-sm">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2 text-center md:text-left">Pase Directo</span>
              <div className="flex flex-col items-center md:items-baseline gap-0.5">
                <span className="text-lg md:text-3xl font-black text-green-600">{successRate}%</span>
                <span className="text-[9px] md:text-[11px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full italic">1er Intento</span>
              </div>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 shadow-sm">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2 text-center md:text-left">Promedio</span>
              <div className="flex flex-col items-center md:items-baseline gap-0.5">
                <span className="text-lg md:text-3xl font-black text-navy">{weightedAverage > 0 ? weightedAverage.toFixed(1) : "-"}</span>
                <span className="text-[9px] md:text-[11px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">Intentos x Alumno</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-6 w-full">
              <div className="w-1 h-5 bg-navy rounded-full"></div>
              <h4 className="text-sm md:text-base font-black text-navy uppercase tracking-tight">Análisis de Distribución</h4>
            </div>
            
            {attemptsLoading ? (
              <div className="py-20 flex justify-center w-full"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-navy"></div></div>
            ) : !hasAttemptsData ? (
              <div className="py-20 text-center w-full">
                <p className="text-gray-300 font-bold italic text-sm">Sin datos para gráficar</p>
              </div>
            ) : (
              <div className="w-full h-[220px] md:h-[280px] flex justify-center items-center">
                <Chart type="doughnut" data={chartData} options={chartOptions} className="w-full h-full" />
              </div>
            )}
          </div>

          {/* Comparativa personal: Tú vs Promedio */}
          {existingTry && hasAttemptsData && (
            <div className="bg-white p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 bg-navy rounded-full"></div>
                <h4 className="text-[11px] md:text-xs font-black text-navy uppercase tracking-tight">Tu Comparativa</h4>
              </div>
              <div className="space-y-3">
                <div className="relative pt-5 pb-3">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1.5">
                    <span>1 intento</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4+ intentos</span>
                  </div>
                  <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="absolute inset-0 flex">
                      <div className="flex-1 border-r border-white/40"></div>
                      <div className="flex-1 border-r border-white/40"></div>
                      <div className="flex-1 border-r border-white/40"></div>
                      <div className="flex-1"></div>
                    </div>
                  </div>
                  {/* Marcador del promedio */}
                  <div
                    className="absolute top-[26px] -translate-x-1/2 transition-all duration-500"
                    style={{ left: `${Math.min(((weightedAverage - 1) / 3) * 100, 100)}%` }}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-l-transparent border-r-transparent border-b-gray-400"></div>
                      <div className="bg-gray-400 text-white text-[8px] font-black px-1.5 py-0.5 rounded whitespace-nowrap">
                        Prom. {weightedAverage.toFixed(1)}
                      </div>
                    </div>
                  </div>
                  {/* Marcador del usuario */}
                  <div
                    className="absolute top-[26px] -translate-x-1/2 transition-all duration-500"
                    style={{ left: `${Math.min(((existingTry.valor - 1) / 3) * 100, 100)}%` }}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-l-transparent border-r-transparent border-b-navy"></div>
                      <div className="bg-navy text-white text-[8px] font-black px-1.5 py-0.5 rounded whitespace-nowrap">
                        Tú: {existingTry.valor}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Insights */}
          {insights.length > 0 && (
            <div className="bg-white p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 bg-navy rounded-full"></div>
                <h4 className="text-[11px] md:text-xs font-black text-navy uppercase tracking-tight">Perspectiva</h4>
              </div>
              <ul className="space-y-2.5">
                {insights.map((msg, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-navy/30 mt-[7px] flex-shrink-0"></span>
                    <span className="text-xs md:text-[13px] font-medium text-gray-600 leading-relaxed">{msg}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Lado Derecho: Formulario */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-navy/5 border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy shrink-0">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                 </svg>
              </div>
              <div className="min-w-0">
                <h4 className="text-xl md:text-2xl font-black text-navy leading-none mb-1 break-words">Tu Historial</h4>
                <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider">Aportes a la comunidad</p>
              </div>
            </div>

            {profileData?.student?.rol?.nombre === "GUEST" ? (
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mt-4 italic text-xs text-navy font-medium">
                  Identifícate como alumno para registrar tu progreso.
              </div>
            ) : (
              <div className="space-y-6 md:space-y-8">
                {existingTry && (
                  <div className="flex items-center gap-3 px-5 py-3 bg-green-50 text-green-700 rounded-xl md:rounded-2xl border border-green-100/50 shadow-sm">
                    <div className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0">
                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-tight text-green-800">Has reportado: {existingTry.valor} {existingTry.valor === 1 ? 'intento' : 'intentos'}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">¿Cuántas veces cursaste?</label>
                  <Dropdown
                    value={selectedTryValue}
                    onChange={(e) => setSelectedTryValue(e.value)}
                    options={tryOptions}
                    placeholder="Elige una opción"
                    className="w-full h-12 md:h-14 border-2 border-gray-100 focus:border-navy rounded-xl md:rounded-2xl bg-gray-50 font-black text-navy"
                    pt={{
                      input: { className: "px-5 py-3 flex items-center text-xs md:text-sm" },
                      panel: { className: "bg-white shadow-2xl rounded-2xl md:rounded-3xl mt-2 border-0 overflow-hidden" },
                      item: { className: "p-4 font-bold text-gray-500 hover:bg-navy hover:text-white transition-colors text-xs md:text-sm" }
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 md:mt-10 space-y-3">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || selectedTryValue === null}
              className="w-full bg-navy text-white h-14 md:h-16 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm shadow-lg shadow-navy/10 hover:bg-dark-navy transition-all disabled:opacity-30 active:scale-95 flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-3 border-white/20 border-t-white"></div>
              ) : (
                <>
                  <span>{existingTry ? "Actualizar" : "Reportar"}</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>

            {existingTry && (
              <button
                onClick={() => onDeleteTry(existingTry)}
                disabled={isSubmitting}
                className="w-full text-red-400 font-bold text-[9px] md:text-[10px] uppercase tracking-widest py-2 hover:text-red-500 transition-colors block text-center"
              >
                Eliminar registro
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}