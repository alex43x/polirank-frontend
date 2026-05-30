import { useMemo } from "react";
import { ProgressBar } from "primereact/progressbar";
import { Chart } from "primereact/chart";

export default function LastSemesterData({
  lastSemesterData,
  teacherName = "Profesor/a",
}) {
  // Función para obtener las iniciales
  const getInitials = (text) => {
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  // Función para obtener un icono según el nombre del aspecto
  const getAspectIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("explicación") || lowerName.includes("explica")) {
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      );
    }
    if (lowerName.includes("puntualidad") || lowerName.includes("hora")) {
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    if (lowerName.includes("responsabilidad") || lowerName.includes("cumplimiento")) {
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    if (lowerName.includes("trato") || lowerName.includes("amabilidad")) {
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    if (lowerName.includes("conocimiento") || lowerName.includes("dominio")) {
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    }
    // Default icon
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    );
  };

  // Convertir el objeto averageRatings a un array de entries
  const ratingsArray = useMemo(() => {
    return lastSemesterData?.averageRatings
      ? Object.entries(lastSemesterData.averageRatings)
      : [];
  }, [lastSemesterData]);

  // Separar facilidad del resto
  const { facilidadRating, otherRatings } = useMemo(() => {
    const facilidad = ratingsArray.find(([criterio]) =>
      criterio.toLowerCase().includes("facilidad"),
    );
    const others = ratingsArray.filter(
      ([criterio]) => !criterio.toLowerCase().includes("facilidad"),
    );
    return {
      facilidadRating: facilidad,
      otherRatings: others,
    };
  }, [ratingsArray]);

  const { chartData, chartOptions } = useMemo(() => {
    if (ratingsArray.length === 0) return { chartData: {}, chartOptions: {} };

    const labels = ratingsArray.map(([criterio]) => getInitials(criterio));
    const values = ratingsArray.map(([, valor]) => valor);

    const data = {
      labels: labels,
      datasets: [
        {
          label: "Calificación",
          data: values,
          backgroundColor: "rgba(54, 80, 125, 0.2)",
          borderColor: "rgba(54, 80, 125, 1)",
          borderWidth: 3,
          pointBackgroundColor: "rgba(54, 80, 125, 1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(54, 80, 125, 1)",
          pointRadius: 4,
        },
      ],
    };

    const options = {
      scales: {
        r: {
          min: 0,
          max: 5,
          ticks: {
            stepSize: 1,
            display: false,
          },
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
            circular: true,
          },
          angleLines: {
            color: "rgba(0, 0, 0, 0.05)",
          },
          pointLabels: {
            font: {
              size: 11,
              weight: "700",
            },
            color: "#36507D",
            padding: 20,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(54, 80, 125, 0.9)",
          padding: 10,
          displayColors: false,
          callbacks: {
            label: function (context) {
              const fullLabels = ratingsArray.map(([criterio]) => criterio);
              return (
                fullLabels[context.dataIndex] +
                ": " +
                context.parsed.r.toFixed(2)
              );
            },
          },
        },
      },
    };

    return { chartData: data, chartOptions: options };
  }, [ratingsArray]);

  // Componente de estrellas personalizado que muestra fracciones
  const CustomStarRating = ({ value }) => {
    const stars = [];
    const fullStars = Math.floor(value);
    const decimal = value - fullStars;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className="w-8 h-8 text-navy" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>,
        );
      } else if (i === fullStars && decimal > 0) {
        stars.push(
          <div key={i} className="relative w-8 h-8">
            <svg className="w-8 h-8 text-gray-200 absolute" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${decimal * 100}%` }}>
              <svg className="w-8 h-8 text-navy" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>,
        );
      } else {
        stars.push(
          <svg key={i} className="w-8 h-8 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>,
        );
      }
    }

      return <div className="flex gap-1">{stars}</div>;
  };

  const renderAspectName = (name) => {
    const parts = name.split("/");
    return parts.map((part, i) => (
      <span key={i} className={i > 0 ? "block" : ""}>
        {part.trim()}
      </span>
    ));
  };

  return (
    <div className="space-y-2 lg:p-4 p-4">
      {lastSemesterData && Object.keys(lastSemesterData).length > 0 ? (
        <>
          {/* Header con información general */}
          <div className="border-b border-solid border-gray-100 p-6">
            <div className="space-y-4">
              <div className="min-w-0">
                <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1 block">Docente</span>
                <h2 className="text-2xl md:text-3xl font-black text-navy leading-tight break-words">
                  {teacherName}
                </h2>
              </div>
              <div className="flex items-center justify-around md:justify-start gap-2 md:gap-8 bg-gray-50/50 p-4 md:px-10 md:py-6 rounded-[2rem] md:rounded-[3rem] border border-gray-100 w-full shadow-inner">
                <div className="flex-1 md:flex-none text-center md:text-left min-w-0">
                  <span className="block text-xl md:text-3xl lg:text-4xl font-black text-navy leading-none mb-1">{lastSemesterData.totalAverage.toFixed(2)}</span>
                  <span className="text-[8px] md:text-[11px] text-gray-400 font-bold uppercase tracking-tight md:whitespace-nowrap leading-tight">Puntaje General</span>
                </div>
                <div className="h-8 md:h-12 w-[1px] bg-gray-200 flex-shrink-0 mx-1"></div>
                <div className="flex-1 md:flex-none text-center md:text-left min-w-0">
                  <span className="block text-xl md:text-3xl lg:text-4xl font-black text-navy leading-none mb-1">{lastSemesterData.totalReviews || 0}</span>
                  <span className="text-[8px] md:text-[11px] text-gray-400 font-bold uppercase tracking-tight md:whitespace-nowrap leading-tight">Reseñas Totales</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-start">
            {/* Columna Izquierda: Valores por Aspecto */}
            <div className="space-y-6 order-2 xl:order-1">
               <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 mb-2">
                  <h3 className="text-xl font-black text-navy uppercase tracking-tight flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-navy rounded-full"></div>
                    Detalle por Aspecto
                  </h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">Puntajes individuales de cada categoría</p>
               </div>

               <div className="space-y-4">
                {otherRatings.length > 0 ? (
                  otherRatings.map(([criterio, valor], index) => {
                    const color = valor >= 4 ? "navy" : valor >= 3 ? "blue-600" : "slate-400";
                    return (
                      <div key={index} className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm hover:border-navy/20 transition-all group hover:shadow-md">
                        <div className="flex items-start gap-4 mb-5">
                          <div className="p-3 bg-navy/5 text-navy rounded-2xl group-hover:bg-navy group-hover:text-white transition-all duration-300">
                             {getAspectIcon(criterio)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 md:gap-4 mb-3">
                                <h4 className="text-sm md:text-base font-black text-navy leading-tight break-words">{renderAspectName(criterio)}</h4>
                               <div className="bg-navy text-white px-3 py-1 rounded-xl text-[11px] font-black tracking-widest shadow-sm self-start">
                                 {valor.toFixed(2)}
                               </div>
                            </div>
                            <div className="flex items-center gap-3">
                               <ProgressBar 
                                  value={(valor / 5) * 100} 
                                  showValue={false} 
                                  className="h-2 flex-1"
                                  pt={{
                                    root: { className: "bg-gray-50 rounded-full h-2 overflow-hidden border border-gray-100" },
                                    value: { className: "bg-navy rounded-full transition-all duration-500" },
                                  }}
                               />
                               <span className="text-[10px] font-black text-navy/30 uppercase">/ 5.0</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold uppercase tracking-widest">No hay detalles disponibles</p>
                  </div>
                )}
               </div>
            </div>

            {/* Columna Derecha: Visualizaciones */}
            <div className="space-y-8 order-1 xl:order-2">
              {/* Facilidad para aprobar destacada vertical */}
              {facilidadRating && (
                <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 p-8 md:p-10 rounded-[2.5rem] border border-blue-100 shadow-sm flex flex-col items-center text-center gap-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm text-navy">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-navy leading-tight">Facilidad para Aprobar</h4>
                      <p className="text-gray-500 text-[11px] uppercase font-bold tracking-widest leading-relaxed mt-2 mx-auto max-w-xs">Percepción de dificultad basada en reseñas de alumnos</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2 w-full">
                    <div className="my-2">
                      <CustomStarRating value={facilidadRating[1]} />
                    </div>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-4xl md:text-5xl font-black text-navy leading-none">
                        {facilidadRating[1].toFixed(2)}
                      </span>
                      <span className="text-base font-black text-navy/30">/5</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Gráfico de Radar Card */}
              <div className="bg-white border border-gray-100 p-8 md:p-10 rounded-[2.5rem] shadow-sm">
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-navy mb-2">Perfil de Desempeño</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Equilibrio de aptitudes evaluadas</p>
                </div>
                <div className="aspect-square w-full max-w-md mx-auto">
                  <Chart type="radar" data={chartData} options={chartOptions} />
                </div>
                {/* Leyenda del Radar Chart */}
                <div className="mt-10 space-y-3">
                  {ratingsArray.map(([criterio], i) => (
                    <div key={i} className="flex items-center gap-3 text-[12px]">
                      <span className="font-black text-navy min-w-[36px] bg-blue-50 px-2 py-1 rounded-lg text-center shadow-sm flex-shrink-0">{getInitials(criterio)}</span>
                      <span className="text-gray-600 font-extrabold leading-tight break-words min-w-0">{renderAspectName(criterio)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 text-center">
          <div className="bg-white p-6 rounded-full shadow-lg mb-8 text-gray-200 animate-pulse">
            <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-3xl font-black text-navy mb-3">Sin Docente Seleccionado</h3>
          <p className="text-gray-400 max-w-sm mx-auto font-medium">
            Por favor, elige una de las secciones del lateral para desbloquear el análisis profundo.
          </p>
        </div>
      )}
    </div>
  );
}
