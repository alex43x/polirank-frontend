import { useNavigate } from "react-router-dom";

export default function SubjectCard({ subject }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/reviews/${subject.id}`, {
      state: { subjectName: subject.nombre },
    });
  };

  return (
    <div
      onClick={handleClick}
      className="group relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-sm hover:shadow-2xl hover:shadow-navy/10 dark:glow-sm dark:hover:glow hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full min-h-[140px] md:min-h-[220px]"
    >
      {/* Elemento Decorativo de Fondo */}
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-navy/[0.09] dark:bg-indigo-500/10 rounded-full group-hover:scale-150 transition-transform duration-700 ease-out"></div>
      
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-full group-hover:bg-navy group-hover:text-white transition-colors duration-300">
              {subject.departamento.nombre.split(' ').pop()}
            </span>
            <div className="w-8 h-8 rounded-full bg-navy/5 dark:bg-gray-700 flex items-center justify-center text-navy dark:text-gray-200 opacity-0 group-hover:opacity-100 dark:opacity-100 transition-opacity duration-300">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>

          <h3 className="text-xl md:text-2xl font-black text-navy dark:text-gray-100 leading-tight tracking-tight mt-4 transition-colors">
            {subject.nombre}
          </h3>
        </div>

        <div className="mt-8 flex items-center gap-2">
           <div className="h-1 flex-1 bg-gray-50 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-navy/10 w-1/3 group-hover:w-full transition-all duration-700"></div>
           </div>
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Explorar</span>
        </div>
      </div>
    </div>
  );
}
