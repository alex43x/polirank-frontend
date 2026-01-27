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
        (t) => t.asignatura === parseInt(subjectId)
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

  // Preparar datos para el gráfico de pie con colores similares a #36507D
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
        backgroundColor: [
          "#5B7BA8", // azul claro - 1 intento
          "#4A6A95", // azul medio claro - 2 intentos
          "#36507D", // azul navy base - 3 intentos
          "#2A3E60", // azul oscuro - 4+ intentos
        ],
        borderColor: "#fff",
        borderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 14,
            weight: "600",
          },
          color: "#1e3a5f",
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(54, 80, 125, 0.95)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#5B7BA8",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage =
              total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
            return `${context.parsed} estudiantes (${percentage}%)`;
          },
        },
      },
    },
    maintainAspectRatio: true,
    responsive: true,
  };

  // Verificar si hay datos de intentos
  const hasAttemptsData =
    attemptsData &&
    Object.keys(attemptsData).length > 0 &&
    (attemptsData["1_intento"] > 0 ||
      attemptsData["2_intentos"] > 0 ||
      attemptsData["3_intentos"] > 0 ||
      attemptsData["mas_intentos"] > 0);

  const handleSubmit = () => {
    if (selectedTryValue === null) {
      alert("Por favor selecciona la cantidad de intentos");
      return;
    }

    const message = existingTry
      ? "¿Estás seguro de que deseas actualizar tu registro de intentos?"
      : "¿Estás seguro de que deseas registrar esta cantidad de intentos?";

    confirmDialog({
      message: message,
      header: existingTry ? "Confirmar Actualización" : "Confirmar Registro",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: existingTry ? "Sí, actualizar" : "Sí, registrar",
      rejectLabel: "Cancelar",
      accept: () => onSubmitTry(selectedTryValue, existingTry),
    });
  };

  const handleDelete = () => {
    if (!existingTry) return;

    confirmDialog({
      message: "¿Estás seguro de que deseas eliminar tu registro de intentos?",
      header: "Confirmar Eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí, eliminar",
      rejectLabel: "Cancelar",
      acceptClassName: "p-button-danger",
      accept: () => onDeleteTry(existingTry),
    });
  };

  // Calcular estadísticas adicionales
  const totalStudents =
    (attemptsData["1_intento"] || 0) +
    (attemptsData["2_intentos"] || 0) +
    (attemptsData["3_intentos"] || 0) +
    (attemptsData["mas_intentos"] || 0);

  const successRate =
    totalStudents > 0
      ? (((attemptsData["1_intento"] || 0) / totalStudents) * 100).toFixed(1)
      : 0;

  return (
    <div className="bg-greige rounded-b-lg w-full p-4 sm:p-6">
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

      {/* Subtítulo con nombre de materia y carrera */}
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl text-neutral-700 font-medium">
          {subjectName}
        </h3>
        
      </div>

      {/* Estadísticas generales */}
      {hasAttemptsData && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-greige shadow-md">
            <p className="text-sm text-neutral-600 mb-1">Total Estudiantes</p>
            <p className="text-2xl sm:text-3xl font-bold text-navy">{totalStudents}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-greige shadow-md">
            <p className="text-sm text-neutral-600 mb-1">Aprobados en Primer Intento</p>
            <p className="text-2xl sm:text-3xl font-bold text-navy">{successRate}%</p>
          </div>
        </div>
      )}

      {/* Gráfico de Pie */}
      <div className="bg-white p-4 sm:p-6 rounded-lg border border-greige shadow-md mb-6">
        <h4 className="text-lg sm:text-xl font-bold text-navy mb-4">
          Distribución de Intentos
        </h4>
        {attemptsLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
            <p className="text-neutral-500 mt-4">Cargando estadísticas...</p>
          </div>
        ) : !hasAttemptsData ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-16 w-16 text-neutral-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="text-neutral-500 text-base sm:text-lg">
              No hay datos de intentos disponibles
            </p>
            <p className="text-neutral-400 text-sm mt-2">
              Sé el primero en registrar tus intentos
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <Chart type="pie" data={chartData} options={chartOptions} />
            </div>
          </div>
        )}
      </div>

      {/* Formulario para registrar intentos */}
      <div className="bg-white p-4 sm:p-6 rounded-lg border-2 border-navy shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-navy flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <h4 className="text-lg sm:text-xl font-bold text-navy">
            {existingTry ? "Actualizar mis Intentos" : "Registrar mis Intentos"}
          </h4>
        </div>

        {existingTry && (
          <div className="mb-4 p-3 bg-blue-50 border-l-4 border-navy rounded">
            <p className="text-sm text-navy">
              <span className="font-semibold">Registro actual:</span>{" "}
              {existingTry.valor === 4
                ? "4 o más intentos"
                : `${existingTry.valor} ${existingTry.valor === 1 ? "intento" : "intentos"}`}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-navy font-semibold mb-2 text-base sm:text-lg">
              ¿Cuántos intentos te tomó aprobar esta materia?
            </label>
            <Dropdown
              value={selectedTryValue}
              onChange={(e) => setSelectedTryValue(e.value)}
              options={tryOptions}
              placeholder="Selecciona la cantidad de intentos"
              className="w-full border rounded-md border-gray-300 font-medium bg-white shadow-md"
              pt={{
                input: {
                  className: "py-3 px-4 bg-white text-neutral-700 rounded-md text-base sm:text-lg",
                },
                panel: {
                  className:
                    "bg-white border border-gray-300 text-neutral-600 rounded-md shadow-lg",
                },
                item: {
                  className: "text-neutral-900 hover:bg-blue-50 p-3 text-base",
                },
              }}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || selectedTryValue === null}
              className="flex-1 bg-navy text-white px-4 sm:px-6 py-3 rounded-md hover:bg-dark-navy transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
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
                <span>{existingTry ? "Actualizar Registro" : "Registrar Intentos"}</span>
              )}
            </button>

            {existingTry && (
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="sm:w-auto bg-white text-red-600 border-2 border-red-600 px-4 sm:px-6 py-3 rounded-md hover:bg-red-600 hover:text-white transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
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
                  <span>Eliminar Registro</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}