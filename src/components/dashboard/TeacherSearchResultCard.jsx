import { useNavigate } from "react-router-dom";

export default function TeacherSearchResultCard({ teacher }) {
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  return (
    <div 
      onClick={() => navigate(`/profesor/${teacher.id}`)}
      className="group bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-xl shadow-navy/5 hover:shadow-navy/10 hover:border-navy/20 transition-all duration-500 cursor-pointer flex flex-col h-full relative overflow-hidden"
    >
      {/* Decoración de fondo */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-navy/5 rounded-full blur-2xl group-hover:bg-navy/10 transition-colors"></div>
      
      <div className="flex items-start gap-4 mb-6 relative">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-navy font-black text-xl group-hover:bg-navy group-hover:text-white transition-all duration-500 shadow-inner">
          {getInitials(teacher.nombre)}
        </div>
        <div className="flex-1 pt-1">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Docente</span>
          <h3 className="text-xl font-black text-navy leading-tight group-hover:text-dark-navy transition-colors">
            {teacher.nombre}
          </h3>
        </div>
      </div>

      <div className="mt-auto space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group-hover:bg-blue-50/50 transition-colors">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-0.5">Contacto</span>
            <span className="text-xs font-bold text-navy truncate max-w-[150px]">{teacher.correo}</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-navy shadow-sm group-hover:scale-110 transition-transform">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
