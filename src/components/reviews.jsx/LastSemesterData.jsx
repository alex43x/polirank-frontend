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

  return (
    <div className="space-y-4 p-6">
      {lastSemesterData && Object.keys(lastSemesterData).length > 0 ? (
        <>
          {/* Header con información general */}
          <div className="mb-6">
            <h2 className="text-4xl font-bold text-navy mb-2">{teacherName}</h2>
            <h3 className="text-lg text-neutral-800 font-medium">
              Datos del Último Semestre
            </h3>
            <p className="text-neutral-600">
              Puntuacion General:{" "}
              <span className="font-semibold">
                {lastSemesterData.totalAverage || "No data"}
              </span>
            </p>
            <p className="text-neutral-600">
              Total de reseñas:{" "}
              <span className="font-semibold">{lastSemesterData.totalReviews || 0}</span>
            </p>
          </div>

          {/* Mapeo de las calificaciones con ProgressBar */}
          <div className="space-y-4">
            {ratingsArray.length > 0 ? (
              ratingsArray.map(([criterio, valor], index) => (
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
              <h2 className="text-3xl font-bold text-navy mb-2">Gráfica de aspectos</h2>

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
