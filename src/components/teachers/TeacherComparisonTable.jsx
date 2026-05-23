import React from 'react';

const mockComparisons = [
  { id: 1, name: "Dr. Carlos Arrellaga", section: "A", avg: 4.8, difficulty: "Media", recommended: 95, current: false },
  { id: 2, name: "Ing. Maria Garcia", section: "B", avg: 4.5, difficulty: "Baja", recommended: 90, current: true },
  { id: 3, name: "Lic. Roberto Sanchez", section: "C", avg: 3.9, difficulty: "Alta", recommended: 75, current: false },
  { id: 4, name: "Dra. Elena Benitez", section: "D", avg: 4.2, difficulty: "Media", recommended: 88, current: false },
];

export default function TeacherComparisonTable({ subjectName }) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden mt-8">
      <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
        <div>
          <h3 className="text-xl font-black text-navy uppercase tracking-tight">Comparativa de Docentes</h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Materia: {subjectName}</p>
        </div>
        <div className="bg-navy text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
          {mockComparisons.length} Docentes
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white">
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Docente</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sección</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Promedio</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Dificultad</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Recomendación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockComparisons.map((item) => (
              <tr 
                key={item.id} 
                className={`transition-colors hover:bg-blue-50/30 ${item.current ? 'bg-navy/[0.02]' : ''}`}
              >
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${item.current ? 'bg-navy text-white' : 'bg-gray-100 text-navy'}`}>
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-navy">{item.name}</p>
                      {item.current && <span className="text-[9px] font-black text-navy uppercase tracking-tighter bg-navy/10 px-2 py-0.5 rounded">Actual</span>}
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className="text-sm font-bold text-gray-500 uppercase">{item.section}</span>
                </td>
                <td className="p-6 text-center">
                  <span className="text-sm font-black text-navy bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                    {item.avg.toFixed(1)} / 5.0
                  </span>
                </td>
                <td className="p-6 text-center">
                  <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-xl ${
                    item.difficulty === 'Baja' ? 'bg-green-100 text-green-600' :
                    item.difficulty === 'Media' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {item.difficulty}
                  </span>
                </td>
                <td className="p-6 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-sm font-black text-navy">{item.recommended}%</span>
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-navy rounded-full" style={{ width: `${item.recommended}%` }}></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
