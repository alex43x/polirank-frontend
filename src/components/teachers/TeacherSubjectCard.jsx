export default function TeacherSubjectCard({ 
  subject, 
  selected, 
  reviews="-", 
  score=0, 
  position=0,
  sectionNumber 
}) {
  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  const avatarText = `${getInitials(subject?.nombre)}${sectionNumber || position}`;

  return (
    <div
      className={`
        relative overflow-hidden rounded-[1.5rem] p-4 h-full cursor-pointer transition-all duration-300
        border-2 shadow-sm
        ${selected
          ? "bg-navy text-white border-navy scale-[1.02] shadow-xl"
          : "bg-white dark:bg-gray-800 text-navy dark:text-gray-100 border-gray-100 dark:border-gray-700 hover:border-navy dark:hover:border-indigo-400 hover:shadow-lg dark:hover:glow-sm"}
      `}
    >
      {position === 1 && (
        <div className={`absolute top-0 right-0 px-2 py-0.5 rounded-bl-lg text-[8px] font-black uppercase tracking-widest ${selected ? "bg-white text-navy" : "bg-navy text-white"}`}>
          Top #1
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className={`
          flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center font-black text-[10px] tracking-tighter
          ${selected ? "bg-white/10 text-white" : "bg-blue-50 dark:bg-gray-700 text-navy dark:text-gray-100"}
        `}>
          {avatarText}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className={`text-[8px] font-black uppercase tracking-tighter ${selected ? "text-blue-200" : "text-gray-400 dark:text-gray-500"}`}>
              {reviews} RESEÑAS
            </span>
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${selected ? "bg-white/20" : "bg-navy/5 dark:bg-gray-700"}`}>
              <span className={selected ? "text-white" : "text-navy dark:text-gray-100"}>{score.toFixed(2)}</span>
            </div>
          </div>
          
          <h3 className={`text-base font-black leading-tight mb-1 truncate ${selected ? "text-white" : "text-navy dark:text-gray-100"}`}>
            {subject?.nombre || "Materia"}
          </h3>
          
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg 
                key={star} 
                className={`w-2.5 h-2.5 ${star <= Math.round(score) ? (selected ? "text-yellow-300" : "text-navy dark:text-gray-100") : (selected ? "text-white/20" : "text-gray-100 dark:text-gray-600")}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
