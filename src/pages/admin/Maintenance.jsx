export default function Maintenance() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#36507D] via-[#4A6A95] to-[#5B7BA8] flex items-center justify-center p-5">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-4  text-center animate-fadeIn">
        
        {/* Icono animado */}
        <div className="mb-8 animate-float">
          <div className="w-28 h-28 mx-auto relative">
            <svg 
              className="w-full h-full text-[#36507D] animate-spin-slow" 
              viewBox="0 0 100 100" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ animationDuration: '4s' }}
            >
              <path 
                fill="currentColor"
                d="M50,20 L55,30 L65,28 L68,38 L78,40 L75,50 L78,60 L68,62 L65,72 L55,70 L50,80 L45,70 L35,72 L32,62 L22,60 L25,50 L22,40 L32,38 L35,28 L45,30 Z"
              />
              <circle cx="50" cy="50" r="12" fill="white"/>
            </svg>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#36507D] mb-6 leading-tight">
          Poli<span className="text-neutral-900">Rank</span> 
          <p className="text-2xl sm:text-xl">en Mantenimiento</p>
        </h1>
        
        {/* Descripción */}
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          Estamos realizando mejoras en nuestro sistema para brindarte una mejor experiencia.
        </p>

        {/* Info box */}
        <div className="bg-gray-50 border-l-4 border-[#36507D] rounded-lg p-6 mb-6 text-left">
          <p className="text-gray-700 m-0">
            <strong className="font-semibold">⏱️ Tiempo estimado:</strong> El sitio estará disponible nuevamente el 27/01/2026.
          </p>
        </div>

        {/* Mensaje adicional */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          Estamos trabajando para{' '}
          <span className="text-[#36507D] font-semibold">incluir nuevas carreras</span> y{' '}
          <span className="text-[#36507D] font-semibold">actualizar</span> nuestros servicios. 
          Agradecemos tu paciencia y comprensión.
        </p>

        {/* Barra de progreso */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#36507D] to-[#5B7BA8] rounded-full animate-progress"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes progress {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 0%;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}