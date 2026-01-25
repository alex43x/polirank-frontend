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
          backgroundColor: "rgba(25, 50, 100, 0.2)",
          borderColor: "rgb(25, 50, 100)",
          borderWidth: 2,
          pointBackgroundColor: "rgb(25, 50, 100)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgb(25, 50, 100)",
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
            display: true,
          },
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
            circular: false,
          },
          angleLines: {
            color: "rgba(0, 0, 0, 0.1)",
          },
          pointLabels: {
            font: {
              size: 14,
              weight: "bold",
            },
            color: "rgb(25, 50, 100)",
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
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
        // Estrella completa
        stars.push(
          <svg
            key={i}
            className="w-8 h-8 text-navy"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>,
        );
      } else if (i === fullStars && decimal > 0) {
        // Estrella parcial
        stars.push(
          <div key={i} className="relative w-8 h-8">
            <svg
              className="w-8 h-8 text-gray-300 absolute"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: `${decimal * 100}%` }}
            >
              <svg
                className="w-8 h-8 text-navy"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>,
        );
      } else {
        // Estrella vacía
        stars.push(
          <svg
            key={i}
            className="w-8 h-8 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>,
        );
      }
    }

    return <div className="flex gap-1">{stars}</div>;
  };

  return (
    <div className="space-y-4 lg:p-6 p-3">
      {lastSemesterData && Object.keys(lastSemesterData).length > 0 ? (
        <>
          {/* Header con información general */}
          <div className="mb-6">
            <h2 className="text-4xl font-bold text-navy mb-2">{teacherName}</h2>

            {/* Grid con información general y facilidad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Columna izquierda - Info general */}
              <div className="space-y-2">
                <h3 className="text-lg text-neutral-800 font-medium mb-4">
                  Datos del Último Año
                </h3>
                <p className="text-neutral-600">
                  Puntuación General:{" "}
                  <span className="font-semibold">
                    {lastSemesterData.totalAverage || "No data"}
                  </span>
                </p>
                <p className="text-neutral-600">
                  Total de reseñas:{" "}
                  <span className="font-semibold">
                    {lastSemesterData.totalReviews || 0}
                  </span>
                </p>
              </div>

              {/* Columna derecha - Facilidad para aprobar */}
              {facilidadRating && (
                <div className="p-4 bg-blue-50 border-2 border-navy rounded-lg">
                  <h4 className="text-lg font-bold text-navy mb-2 flex items-center gap-2">
                     Facilidad para Aprobar
                  </h4>
                  <div className="flex items-center gap-3">
                    <CustomStarRating value={facilidadRating[1]} />
                    <span className="text-2xl font-bold text-navy">
                      {facilidadRating[1].toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mapeo de las calificaciones con ProgressBar */}
          <div className="space-y-4">
            {otherRatings.length > 0 ? (
              otherRatings.map(([criterio, valor], index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="text-lg font-semibold text-navy">
                        {criterio}{" "}
                        <span className="text-sm text-neutral-600">
                          {getInitials(criterio)}
                        </span>
                      </h4>
                    </div>
                    <span className="text-xl font-bold text-navy">
                      {valor.toFixed(2)} / 5
                    </span>
                  </div>
                  <ProgressBar
                    value={(valor / 5) * 100}
                    showValue={false}
                    className="h-3"
                    pt={{
                      root: {
                        className:
                          "bg-gray-200 rounded-full overflow-hidden h-4",
                      },
                      value: {
                        className: "bg-navy",
                      },
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-neutral-500">
                  No hay calificaciones disponibles
                </p>
              </div>
            )}
          </div>
          {/* Gráfico Radar */}
          {ratingsArray.length > 0 && (
            <div className="mt-8">
              <h2 className="text-3xl font-bold text-navy mb-2">
                Gráfica de aspectos
              </h2>

              <div className="mb-8 flex justify-center">
                <div className="w-full max-w-md">
                  <Chart type="radar" data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-neutral-500">
            Selecciona un docente para ver sus evaluaciones
          </p>
        </div>
      )}
    </div>
  );
}
