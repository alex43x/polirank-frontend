import { useNavigate } from "react-router-dom";
import { BADGES, getBadgeStyles, getBadgeLabel } from "../../constants/badges";

const steps = [
  {
    number: "01",
    title: "Explorá Materias y Docentes",
    description:
      "Desde el Dashboard podés buscar asignaturas por nombre, departamento o semestre. También podés cambiar a modo búsqueda de profesores para encontrar a un docente específico.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Valorá a tus Docentes",
    description:
      "Entrá a la página de una materia y calificá a cada docente con puntuaciones del 1 al 5 en distintos aspectos como claridad, puntualidad, y dominio del tema. También podés dejar un comentario escrito.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.243.58 1.8l-3.968 2.88a1 1 0 00-.364 1.118l1.52 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.88a1 1 0 00-1.178 0l-3.97 2.88c-.784.57-1.838-.197-1.539-1.118l1.52-4.674a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h4.908a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Comentarios y Moderación",
    description:
      "Los comentarios escritos pasan por un proceso de moderación antes de ser visibles para toda la comunidad. Si tu comentario está pendiente, solo vos y los administradores pueden verlo.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Chipitómetro",
    description:
      "Registrá cuántas veces cursaste cada materia para que otros estudiantes puedan ver la experiencia en conjunto con las valoraciones docentes.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "Rankings y Reputación",
    description:
      "Cada vez que valorás un docente o registrás un intento, contribuís a la comunidad y ganás puntos de reputación. ¡Acumulá aportes y subí de rango!",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
];

export default function Tutorial() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-black/10 p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-navy/5 dark:bg-gray-700 rounded-[1.5rem] flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-navy dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-navy dark:text-white tracking-tight mb-3">
            Tutorial
          </h1>
          <p className="text-gray-400 dark:text-gray-500 font-bold text-sm max-w-xl mx-auto leading-relaxed">
            Aprendé a usar PoliRank para valorar docentes, registrar intentos y contribuir a la comunidad académica.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-6 items-start">
              <div className="hidden sm:flex w-14 h-14 bg-navy dark:bg-indigo-600 text-white rounded-xl items-center justify-center font-black text-sm shrink-0 shadow-lg shadow-navy/15">
                {step.number}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <div className="sm:hidden w-10 h-10 bg-navy dark:bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-xs shrink-0">
                    {step.number}
                  </div>
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                    {step.icon}
                  </div>
                  <h2 className="text-lg font-black text-navy dark:text-white">{step.title}</h2>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed ml-1">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Consejos */}
        <div className="mt-14 pt-10 border-t border-gray-100 dark:border-gray-700">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-[1.25rem] flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-navy dark:text-white tracking-tight mb-2">Consejos para mejores reseñas</h2>
            <p className="text-gray-400 dark:text-gray-500 font-bold text-sm max-w-lg mx-auto">
              Una buena reseña ayuda a toda la comunidad. Seguí estos consejos para que tus valoraciones sean útiles y objetivas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 flex gap-4 items-start shadow-sm">
              <div className="w-9 h-9 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-black text-navy dark:text-white uppercase tracking-wider mb-0.5">Sé específico</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                  Comentá aspectos concretos como la claridad al explicar, la organización del curso o la disposición del docente. Evitá generalidades.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 flex gap-4 items-start shadow-sm">
              <div className="w-9 h-9 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-black text-navy dark:text-white uppercase tracking-wider mb-0.5">Sé objetivo</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                  Basá tu valoración en tu experiencia real en la cursada. Las reseñas sesgadas o emocionales no aportan información útil.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 flex gap-4 items-start shadow-sm">
              <div className="w-9 h-9 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-black text-navy dark:text-white uppercase tracking-wider mb-0.5">Respetá la privacidad</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                  No compartas información personal tuya ni del docente. Si tenés un problema puntual, canalizalo por las vías oficiales.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 flex gap-4 items-start shadow-sm">
              <div className="w-9 h-9 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-black text-navy dark:text-white uppercase tracking-wider mb-0.5">Actualizá tus reseñas</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                  Si cursaste la misma materia con distintos docentes o en diferentes semestres, actualizá tus valoraciones para reflejar tu experiencia más reciente.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-10 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-black text-navy dark:text-white uppercase tracking-wider text-center mb-5">Preguntas Frecuentes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <h4 className="text-[11px] font-black text-navy dark:text-white uppercase tracking-wider mb-1">¿Cuánto tarda la moderación?</h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                  Los comentarios son revisados por los administradores. El tiempo puede variar, pero generalmente se aprueban dentro de las 24 horas hábiles.
                </p>
              </div>
              <div>
                <h4 className="text-[11px] font-black text-navy dark:text-white uppercase tracking-wider mb-1">¿Puedo editar mi reseña?</h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                  Sí, desde la página de la materia podés modificar tu reseña en cualquier momento. Si editás el comentario escrito, volverá a pasar por moderación.
                </p>
              </div>
              <div>
                <h4 className="text-[11px] font-black text-navy dark:text-white uppercase tracking-wider mb-1">¿Qué es el Chipitómetro?</h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                  Es una herramienta que permite registrar cuántas veces cursaste cada materia. Ayuda a otros estudiantes a conocer la dificultad real y la experiencia acumulada.
                </p>
              </div>
              <div>
                <h4 className="text-[11px] font-black text-navy dark:text-white uppercase tracking-wider mb-1">¿Cómo se calcula la reputación?</h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                  Cada reseña publicada y cada intento registrado suma 1 punto de aporte. Acumulando aportes desbloqueás nuevos rangos en tu perfil.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Logros / Rangos */}
        <div className="mt-14 pt-10 border-t border-gray-100 dark:border-gray-700">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-[1.25rem] flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-navy dark:text-white tracking-tight mb-2">Logros y Reputación</h2>
            <p className="text-gray-400 dark:text-gray-500 font-bold text-sm max-w-lg mx-auto">
              Cada reseña o intento registrado suma puntos. Acumulá aportes y desbloqueá rangos dentro de la comunidad.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {BADGES.map((b) => {
              const style = getBadgeStyles(b.color);
              const label = getBadgeLabel(b, b.min);
              return (
                <div key={b.id} className={`${style.card} rounded-2xl p-6 text-center`}>
                  <div className={`w-10 h-10 ${style.cardIcon} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    {b.icon("w-5 h-5")}
                  </div>
                  <span className={`text-xs font-black uppercase tracking-wider ${style.name}`}>{b.name}</span>
                  <p className={`text-[10px] ${style.desc} font-bold mt-1`}>{label}</p>
                </div>
              );
            })}
          </div>

          <p className="text-center text-[11px] text-gray-400 dark:text-gray-500 font-bold mt-6">
            Los aportes incluyen tanto reseñas a docentes como intentos registrados en el Chipitómetro.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 text-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-3 bg-navy dark:bg-indigo-600 hover:bg-dark-navy dark:hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-xl shadow-navy/15 dark:shadow-indigo-500/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
