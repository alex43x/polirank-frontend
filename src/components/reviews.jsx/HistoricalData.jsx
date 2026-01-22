import { useMemo } from "react";

export default function HistoricalData({ historicalData }) {
  // Obtener todos los criterios únicos de todos los periodos
  const allCriteria = useMemo(() => {
    if (!historicalData?.history || !Array.isArray(historicalData.history)) {
      return [];
    }
    
    const criteriaSet = new Set();
    historicalData.history.forEach(item => {
      if (item.averageRatings) {
        Object.keys(item.averageRatings).forEach(criterio => {
          criteriaSet.add(criterio);
        });
      }
    });
    return Array.from(criteriaSet);
  }, [historicalData]);

  // Ordenar historia por año y periodo descendente
  const sortedHistory = useMemo(() => {
    if (!historicalData?.history || !Array.isArray(historicalData.history)) {
      return [];
    }
    
    return [...historicalData.history].sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return b.periodo - a.periodo;
    });
  }, [historicalData]);

  // Calcular promedio general para cada periodo
  const calculateAverage = (ratings) => {
    if (!ratings || Object.keys(ratings).length === 0) return 0;
    const values = Object.values(ratings);
    return values.reduce((a, b) => a + b, 0) / values.length;
  };

  return (
    <div className="space-y-4 lg:p-6 p-3">
      {sortedHistory.length > 0 ? (
        <>
          <div className="mb-4">
            <h2 className="text-4xl font-bold text-navy mb-2">
              Datos Históricos
            </h2>
            <p className="text-neutral-600">
              Evolución de evaluaciones por semestre
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="bg-navy text-white p-3 text-left font-bold rounded-tl-lg">
                    Aspectos/Semestres
                  </th>
                  {sortedHistory.map((item, index) => (
                    <th
                      key={index}
                      className={`bg-navy text-white p-3 text-center font-bold ${
                        index === sortedHistory.length - 1 ? 'rounded-tr-lg' : ''
                      }`}
                    >
                      {item.year}-{item.periodo}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allCriteria.map((criterio, idx) => (
                  <tr key={idx} className="border-b border-neutral-200">
                    <td className="p-3 font-medium text-neutral-900 bg-white">
                      {criterio}
                    </td>
                    {sortedHistory.map((item, periodIdx) => {
                      const valor = item.averageRatings?.[criterio];
                      return (
                        <td
                          key={periodIdx}
                          className="p-3 text-center bg-neutral-50"
                        >
                          <span className="font-semibold text-neutral-700">
                            {valor !== undefined && valor !== null 
                              ? `${parseFloat(valor).toFixed(1)}/5` 
                              : '-'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Fila de promedio general */}
                <tr className="border-t-2 border-navy">
                  <td className="p-3 font-bold text-white bg-navy rounded-bl-lg">
                    Promedio General del Semestre
                  </td>
                  {sortedHistory.map((item, periodIdx) => {
                    const promedio = calculateAverage(item.averageRatings);
                    return (
                      <td
                        key={periodIdx}
                        className={`p-3 text-center font-bold text-white bg-navy ${
                          periodIdx === sortedHistory.length - 1 ? 'rounded-br-lg' : ''
                        }`}
                      >
                        {promedio > 0 ? promedio.toFixed(2) : '-'}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-neutral-500">
            No hay datos históricos disponibles
          </p>
        </div>
      )}
    </div>
  );
}