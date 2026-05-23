import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const metrics = [
  { id: 'DDLM', name: 'Dominio de la Materia', value: 92 },
  { id: 'CAE', name: 'Claridad al Explicar', value: 85 },
  { id: 'F', name: 'Flexibilidad', value: 78 },
  { id: 'EJ', name: 'Evaluacion Justa', value: 95 },
  { id: 'P', name: 'Puntualidad', value: 88 },
  { id: 'TAA', name: 'Trato al Alumno', value: 90 },
  { id: 'D', name: 'Disponibilidad/Apoyo', value: 82 },
  { id: 'MD', name: 'Material Didactico', value: 87 },
];

const teachers = [
  { 
    id: 1, 
    name: "Profesor A", 
    score: 3.67, 
    reviews: 15, 
    color: '#1e293b', // navy
    textColor: 'white',
    badge: 'Mejor Calificado ✩',
    data: [4.5, 5.0, 3.5, 4.2, 3.5, 2.3, 4.7, 2.3]
  },
  { 
    id: 2, 
    name: "Profesor B", 
    score: 3.10, 
    reviews: 35, 
    color: '#ffffff', // white
    textColor: '#1e293b',
    badge: 'No disponible este semestre',
    data: [4.2, 2.8, 4.1, 5.1, 4.1, 3.9, 5.0, 3.9]
  }
];

export default function TeacherComparisonChart({ subjectName }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: metrics.map(m => m.id),
        datasets: teachers.map(teacher => ({
          label: teacher.name,
          data: teacher.data,
          backgroundColor: teacher.id === 1 ? 'rgba(96, 165, 250, 0.8)' : 'rgba(34, 197, 94, 0.8)', // blue vs green
          borderRadius: 8,
          barThickness: 15,
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 12 },
            padding: 12,
            cornerRadius: 10,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 5,
            ticks: {
              stepSize: 1,
              font: { weight: 'bold', size: 12 }
            },
            grid: {
              color: 'rgba(0,0,0,0.05)',
              borderDash: [5, 5]
            }
          },
          x: {
            grid: { display: false },
            ticks: {
              font: { weight: 'black', size: 14 }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="bg-[#F8FAFC] rounded-[2.5rem] p-4 md:p-10 border border-gray-100 shadow-2xl shadow-navy/5 mt-10">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar de Métricas */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Métricas de Comparación</p>
          {metrics.map((m) => (
            <div key={m.id} className="space-y-1">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-navy leading-tight max-w-[120px]">
                  {m.name} <span className="text-gray-400 ml-1">{m.id}</span>
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-navy/40 rounded-full" 
                  style={{ width: `${m.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 space-y-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {teachers.map((teacher) => (
              <div 
                key={teacher.id}
                style={{ backgroundColor: teacher.color, color: teacher.textColor }}
                className={`flex-1 p-6 rounded-[2rem] shadow-xl transition-transform hover:scale-[1.02] duration-300 border border-gray-100 relative overflow-hidden`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`text-[9px] font-black uppercase tracking-widest opacity-70 mb-1 block`}>
                      {teacher.badge}
                    </span>
                    <h4 className="text-2xl font-black tracking-tight">{teacher.name}</h4>
                    <span className="text-[10px] font-bold opacity-60">+{teacher.reviews} Reviews</span>
                  </div>
                  <div className={`text-2xl font-black ${teacher.id === 1 ? 'text-white' : 'text-navy'}`}>
                    {teacher.score.toFixed(2)}
                  </div>
                </div>
                {/* Decoración sutil */}
                <div className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full ${teacher.id === 1 ? 'bg-white/5' : 'bg-navy/5'}`}></div>
              </div>
            ))}
          </div>

          {/* Gráfico de Barras */}
          <div className="bg-white rounded-[2rem] p-6 border border-gray-50 shadow-inner h-[400px]">
            <canvas ref={chartRef}></canvas>
          </div>

          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span className="text-[10px] font-black text-navy uppercase tracking-widest">Profesor A</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-[10px] font-black text-navy uppercase tracking-widest">Profesor B</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
