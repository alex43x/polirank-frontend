import { useState, useEffect } from "react";

const TARGET = new Date("2026-06-19T09:00:00");

function calcDiff(now) {
  let diff = Math.max(0, TARGET - now);
  const days = Math.floor(diff / 86400000);
  diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000);
  diff -= hours * 3600000;
  const minutes = Math.floor(diff / 60000);
  diff -= minutes * 60000;
  const seconds = Math.floor(diff / 1000);
  return { days, hours, minutes, seconds };
}

export default function Maintenance() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const { days, hours, minutes, seconds } = calcDiff(now);
  const ended = TARGET - now <= 0;

  return (
    <div className="min-h-screen bg-[#F3F4F6] dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none max-w-xl w-full p-10 text-center animate-fadeIn">

        {/* Icono animado */}
        <div className="mb-8">
          <div className="w-28 h-28 mx-auto relative animate-float">
            <svg className="w-full h-full text-navy dark:text-indigo-400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="gearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#36507D" />
                  <stop offset="100%" stopColor="#5B7BA8" />
                </linearGradient>
              </defs>
              <path fill="url(#gearGrad)" d="M50,20 L55,30 L65,28 L68,38 L78,40 L75,50 L78,60 L68,62 L65,72 L55,70 L50,80 L45,70 L35,72 L32,62 L22,60 L25,50 L22,40 L32,38 L35,28 L45,30 Z" className="animate-spin-slow" style={{ transformOrigin: "50px 50px", animationDuration: "6s" }} />
              <circle cx="50" cy="50" r="14" fill="white" className="dark:fill-gray-800" />
            </svg>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-3xl sm:text-4xl font-black text-navy dark:text-gray-100 mb-2 leading-tight">
          PoliRank
        </h1>
        <p className="text-lg text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mb-8">
          en Mantenimiento
        </p>

        {/* countdown */}
        <div className="bg-navy/5 dark:bg-gray-900/50 rounded-[2rem] p-8 mb-8 border border-gray-100 dark:border-gray-700">
          <p className="text-xs font-black text-navy/40 dark:text-gray-500 uppercase tracking-widest mb-5">
            {ended ? "Ya disponible" : "La nueva versión llega en"}
          </p>
          {ended ? (
            <div className="text-2xl font-black text-navy dark:text-gray-100 animate-pulse">
              ¡Ya está aquí!
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Días", value: days },
                { label: "Horas", value: hours },
                { label: "Minutos", value: minutes },
                { label: "Segundos", value: seconds },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center">
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl w-full py-4 shadow-sm">
                    <span className="text-3xl md:text-4xl font-black text-navy dark:text-gray-100 tabular-nums">
                      {String(value).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-2">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mensaje de suspenso */}
        <div className="bg-gradient-to-r from-navy/5 via-navy/10 to-navy/5 dark:from-indigo-500/5 dark:via-indigo-500/10 dark:to-indigo-500/5 rounded-2xl p-6 mb-8 border border-navy/10 dark:border-indigo-500/20">
          <p className="text-navy dark:text-indigo-300 text-sm font-black uppercase tracking-widest leading-relaxed">
            <span className="animate-pulse">⬡</span> Algo grande se aproxima... <span className="animate-pulse">⬡</span>
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-bold mt-3 leading-relaxed">
            Estamos rearmando todo para traerte una experiencia renovada. Nuevas funciones, más carreras y una interfaz más rápida. Prepárate.
          </p>
        </div>

        {/* disclaimer */}
        <p className="text-[10px] text-gray-400 dark:text-gray-600 font-bold uppercase tracking-widest">
          El sitio permanecerá inactivo durante la actualización
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin 6s linear infinite; }
      `}</style>
    </div>
  );
}
