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
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl lg:text-3xl font-black text-navy mb-2 tracking-tight">
              Historial de Evaluaciones
            </h2>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
              Análisis comparativo por períodos lectivos
            </p>
          </div>
          <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm scrollbar-hide">
            <table className="w-full min-w-[800px] border-collapse bg-white">
              <thead>
                <tr>
                  <th className="md:sticky left-0 z-20 bg-navy text-white p-5 text-left font-black uppercase tracking-widest text-[10px] rounded-tl-3xl md:shadow-[8px_0_15px_-5px_rgba(0,0,0,0.3)] min-w-[140px] md:min-w-[200px]">
                    Aspectos / Período
                  </th>
                  {sortedHistory.map((item, index) => (
                    <th
                      key={index}
                      className={`bg-navy text-white p-5 text-center font-black uppercase tracking-widest text-[10px] border-l border-white/10 ${
                        index === sortedHistory.length - 1 ? 'rounded-tr-3xl' : ''
                      }`}
                    >
                      {item.year} - S{item.periodo}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {allCriteria.map((criterio, idx) => (
                  <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="md:sticky left-0 z-10 p-5 font-bold text-navy text-sm bg-white group-hover:bg-gray-50 transition-colors md:shadow-[8px_0_15px_-5px_rgba(0,0,0,0.1)] min-w-[140px] md:min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-navy/30"></div>
                        <span className="whitespace-normal">{criterio}</span>
                      </div>
                    </td>
                    {sortedHistory.map((item, periodIdx) => {
                      const valor = item.averageRatings?.[criterio];
                      return (
                        <td
                          key={periodIdx}
                          className="p-5 text-center border-l border-gray-50"
                        >
                          <div className={`inline-flex flex-col items-center justify-center min-w-[50px] p-2 rounded-2xl ${
                            valor >= 4 ? 'bg-green-50 text-green-600' : 
                            valor >= 3 ? 'bg-blue-50 text-blue-600' : 
                            valor > 0 ? 'bg-orange-50 text-orange-600' : 
                            'bg-gray-50 text-gray-300'
                          }`}>
                            <span className="text-sm font-black">
                              {valor !== undefined && valor !== null 
                                ? valor.toFixed(2)
                                : '-'}
                            </span>
                            <span className="text-[8px] font-bold opacity-50 uppercase mt-0.5">/ 5.0</span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Fila de promedio general */}
                <tr className="bg-navy/5">
                  <td className="md:sticky left-0 z-10 p-6 font-black text-navy text-[10px] uppercase tracking-widest bg-gray-50 md:shadow-[8px_0_15px_-5px_rgba(0,0,0,0.1)] rounded-bl-3xl min-w-[140px] md:min-w-[200px]">
                    Promedio del Semestre
                  </td>
                  {sortedHistory.map((item, periodIdx) => {
                    const promedio = calculateAverage(item.averageRatings);
                    return (
                      <td
                        key={periodIdx}
                        className={`p-6 text-center font-black text-navy border-l border-white/20 ${
                          periodIdx === sortedHistory.length - 1 ? 'rounded-br-3xl' : ''
                        }`}
                      >
                        <div className="text-lg tracking-tighter">
                          {promedio > 0 ? promedio.toFixed(2) : '-'}
                        </div>
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