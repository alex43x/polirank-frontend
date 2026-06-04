import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BADGES, getBadgeStyles, getBadgeLabel } from "../../constants/badges";

const SECTIONS = [
  { id: "quickstart", label: "Guía Rápida" },
  { id: "steps", label: "Pasos Detallados" },
  { id: "preview", label: "Probá el Rating" },
  { id: "tips", label: "Consejos" },
  { id: "faq", label: "Preguntas Frecuentes" },
  { id: "badges", label: "Logros y Reputación" },
];

const steps = [
  {
    number: "01",
    title: "Explorá Materias y Docentes",
    description:
      "Desde el Dashboard podés buscar asignaturas por nombre, departamento o semestre. También podés cambiar a modo búsqueda de profesores para encontrar a un docente específico.",
    detail:
      "Usá la barra de búsqueda en la parte superior del Dashboard. Podés filtrar por semestre o departamento usando los dropdowns. Cambiá entre modo Materias y modo Docentes con el botón de alternancia.",
    illustration: (
      <svg className="w-full h-full" viewBox="0 0 200 120" fill="none">
        <rect x="10" y="10" width="180" height="100" rx="12" className="fill-blue-50 dark:fill-blue-950/30 stroke-blue-200 dark:stroke-blue-800" strokeWidth="1.5"/>
        <rect x="25" y="25" width="60" height="12" rx="6" className="fill-blue-300 dark:fill-blue-700"/>
        <rect x="95" y="25" width="80" height="12" rx="6" className="fill-gray-200 dark:fill-gray-700"/>
        <rect x="25" y="47" width="150" height="8" rx="4" className="fill-gray-100 dark:fill-gray-800"/>
        <rect x="25" y="63" width="150" height="8" rx="4" className="fill-gray-100 dark:fill-gray-800"/>
        <rect x="25" y="79" width="150" height="8" rx="4" className="fill-gray-100 dark:fill-gray-800"/>
        <circle cx="170" cy="85" r="12" className="fill-navy dark:fill-indigo-600"/>
        <path d="M166 85l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    number: "02",
    title: "Valorá a tus Docentes",
    description:
      "Entrá a la página de una materia y calificá a cada docente con puntuaciones del 1 al 5 en distintos aspectos como claridad, puntualidad, y dominio del tema. También podés dejar un comentario escrito.",
    detail:
      "Hacé clic en una materia desde el Dashboard. Elegí el año y semestre que cursaste. Luego pasá por cada categoría (Facilidad, Dominio, Claridad, etc.) y puntuá del 1 al 5. Al final podés agregar un comentario opcional.",
    illustration: (
      <svg className="w-full h-full" viewBox="0 0 200 120" fill="none">
        <rect x="10" y="10" width="180" height="100" rx="12" className="fill-amber-50 dark:fill-amber-950/30 stroke-amber-200 dark:stroke-amber-800" strokeWidth="1.5"/>
        {[0,1,2,3,4].map((i) => (
          <polygon key={i}
            points={`${35+i*28},90 ${38+i*28},80 ${45+i*28},80 ${40+i*28},74 ${42+i*28},66 ${35+i*28},70 ${28+i*28},66 ${30+i*28},74 ${25+i*28},80 ${32+i*28},80`}
            className={i < 3 ? "fill-amber-400" : "fill-gray-200 dark:fill-gray-600"}
          />
        ))}
        <rect x="25" y="25" width="80" height="10" rx="5" className="fill-amber-300 dark:fill-amber-700"/>
        <rect x="25" y="42" width="140" height="6" rx="3" className="fill-gray-200 dark:fill-gray-700"/>
        <circle cx="170" cy="30" r="8" className="fill-green-100 dark:fill-green-900/50 stroke-green-400" strokeWidth="1.5"/>
        <path d="M167 30l2 2 4-4" stroke="green" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    number: "03",
    title: "Comentarios y Moderación",
    description:
      "Los comentarios escritos pasan por un proceso de moderación antes de ser visibles para toda la comunidad. Si tu comentario está pendiente, solo vos y los administradores pueden verlo.",
    detail:
      "Después de puntuar al docente, podés escribir un comentario adicional. Una vez enviado, aparecerá como \"Pendiente\" hasta que un administrador lo apruebe. Si no aprueba moderación, solo vos lo ves. También podés reportar comentarios inapropiados usando el ícono de bandera.",
    illustration: (
      <svg className="w-full h-full" viewBox="0 0 200 120" fill="none">
        <rect x="10" y="10" width="180" height="100" rx="12" className="fill-green-50 dark:fill-green-950/30 stroke-green-200 dark:stroke-green-800" strokeWidth="1.5"/>
        <rect x="20" y="20" width="120" height="16" rx="8" className="fill-green-100 dark:fill-green-900/50"/>
        <rect x="25" y="24" width="8" height="8" rx="2" className="fill-green-400"/>
        <rect x="38" y="24" width="60" height="8" rx="4" className="fill-green-300 dark:fill-green-700"/>
        <rect x="108" y="24" width="12" height="8" rx="4" className="fill-green-400"/>
        <rect x="20" y="44" width="120" height="16" rx="8" className="fill-gray-100 dark:fill-gray-800"/>
        <rect x="25" y="48" width="8" height="8" rx="2" className="fill-gray-300 dark:fill-gray-600"/>
        <rect x="38" y="48" width="60" height="8" rx="4" className="fill-gray-200 dark:fill-gray-700"/>
        <circle cx="115" cy="52" r="6" className="fill-yellow-100 dark:fill-yellow-900/50 stroke-yellow-400" strokeWidth="1.5"/>
        <path d="M113 50l4 4" stroke="red" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="20" y="68" width="120" height="16" rx="8" className="fill-gray-100 dark:fill-gray-800"/>
        <rect x="25" y="72" width="8" height="8" rx="2" className="fill-gray-300 dark:fill-gray-600"/>
        <rect x="38" y="72" width="60" height="8" rx="4" className="fill-gray-200 dark:fill-gray-700"/>
      </svg>
    ),
  },
  {
    number: "04",
    title: "Chipitómetro",
    description:
      "Registrá cuántas veces te tomó pasar cada materia. Ayuda a otros estudiantes a saber la dificultad real de la cursada.",
    detail:
      "En la página de cada materia, encontrás el Chipitómetro en la parte superior. Hacé clic en \"Registrar Intento\" y seleccioná cuántas veces cursaste. Es solo para referencia de la comunidad.",
    illustration: (
      <svg className="w-full h-full" viewBox="0 0 200 120" fill="none">
        <rect x="10" y="10" width="180" height="100" rx="12" className="fill-purple-50 dark:fill-purple-950/30 stroke-purple-200 dark:stroke-purple-800" strokeWidth="1.5"/>
        <rect x="25" y="25" width="70" height="14" rx="7" className="fill-purple-300 dark:fill-purple-700"/>
        <text x="32" y="35" fontSize="8" fontWeight="bold" className="fill-white">Chipitómetro</text>
        <rect x="110" y="25" width="60" height="14" rx="7" className="fill-purple-500"/>
        <text x="120" y="35" fontSize="7" fontWeight="bold" className="fill-white">+ Registrar</text>
        <rect x="25" y="50" width="150" height="8" rx="4" className="fill-gray-100 dark:fill-gray-800"/>
        <rect x="25" y="63" width="120" height="8" rx="4" className="fill-gray-100 dark:fill-gray-800"/>
        <rect x="25" y="76" width="140" height="8" rx="4" className="fill-gray-100 dark:fill-gray-800"/>
        <rect x="25" y="89" width="100" height="8" rx="4" className="fill-gray-100 dark:fill-gray-800"/>
        <circle cx="165" cy="54" r="4" className="fill-green-400"/>
        <circle cx="165" cy="67" r="4" className="fill-green-400"/>
        <circle cx="165" cy="80" r="4" className="fill-amber-400"/>
        <circle cx="165" cy="93" r="4" className="fill-red-400"/>
      </svg>
    ),
  },
  {
    number: "05",
    title: "Rankings y Reputación",
    description:
      "Cada vez que valorás un docente o registrás un intento, contribuís a la comunidad y ganás puntos de reputación. ¡Acumulá aportes y subí de rango!",
    detail:
      "Cada reseña publicada suma 1 punto. Cada intento registrado suma 1 punto. En tu perfil (menú desplegable arriba a la derecha) podés ver tu rango actual y cuántos puntos necesitás para el siguiente nivel. ¡Mientras más aportás, más alto escalás!",
    illustration: (
      <svg className="w-full h-full" viewBox="0 0 200 120" fill="none">
        <rect x="10" y="10" width="180" height="100" rx="12" className="fill-rose-50 dark:fill-rose-950/30 stroke-rose-200 dark:stroke-rose-800" strokeWidth="1.5"/>
        {[0,1,2,3,4].map((i) => (
          <rect key={i} x={25+i*30} y={55-i*8} width="22" height={8+i*8} rx="4"
            className={i === 4 ? "fill-amber-400" : i >= 2 ? "fill-rose-300 dark:fill-rose-700" : "fill-gray-200 dark:fill-gray-600"}
          />
        ))}
        {[0,1,2,3,4].map((i) => (
          <rect key={i} x={28+i*30} y={90} width="16" height="3" rx="1.5"
            className="fill-gray-300 dark:fill-gray-600"
          />
        ))}
        <circle cx="40" cy="105" r="5" className="fill-gray-200 dark:fill-gray-700"/>
        <circle cx="40" cy="105" r="3" className="fill-gray-400 dark:fill-gray-500"/>
        <circle cx="160" cy="105" r="5" className="fill-amber-200 dark:fill-amber-900/50"/>
        <circle cx="160" cy="105" r="3" className="fill-amber-500"/>
        <path d="M157 105l2 1 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const faqs = [
  {
    q: "¿Cuánto tarda la moderación?",
    a: "Los comentarios son revisados por los administradores. El tiempo puede variar, pero generalmente se aprueban dentro de las 24 horas hábiles. Si pasa más tiempo, contactá con un administrador.",
  },
  {
    q: "¿Puedo editar mi reseña?",
    a: "Sí, desde la página de la materia podés modificar tu reseña en cualquier momento. Si editás el comentario escrito, volverá a pasar por moderación. Las calificaciones numéricas se actualizan al instante.",
  },
  {
    q: "¿Qué es el Chipitómetro?",
    a: "Es una herramienta para registrar cuántas veces te tomó pasar cada materia. Sirve como referencia para que otros estudiantes conozcan la dificultad real de la cursada, nada más.",
  },
  {
    q: "¿Cómo se calcula la reputación?",
    a: "Cada reseña publicada y cada intento registrado en el Chipitómetro suma 1 punto de aporte. Acumulando aportes desbloqueás nuevos rangos: Habitante del CEP, Bicho, Padrino, Polisaurio, Abuedrino e Inge/Licen.",
  },
  {
    q: "¿Puedo reportar un comentario?",
    a: "Sí. Si ves un comentario inapropiado, hacé clic en el ícono de bandera que aparece junto a cada comentario. Un administrador revisará el reporte y tomará las medidas necesarias.",
  },
];

const tips = [
  {
    title: "Sé específico",
    desc: "Comentá aspectos concretos como la claridad al explicar, la organización del curso o la disposición del docente. Evitá generalidades.",
    color: "blue",
    icon: "info",
  },
  {
    title: "Sé objetivo",
    desc: "Basá tu valoración en tu experiencia real en la cursada. Las reseñas sesgadas o emocionales no aportan información útil.",
    color: "green",
    icon: "check",
  },
  {
    title: "Respetá la privacidad",
    desc: "No compartas información personal tuya ni del docente. Si tenés un problema puntual, canalizalo por las vías oficiales.",
    color: "amber",
    icon: "lock",
  },
  {
    title: "Actualizá tus reseñas",
    desc: "Si cursaste la misma materia con distintos docentes o en diferentes semestres, actualizá tus valoraciones para reflejar tu experiencia más reciente.",
    color: "purple",
    icon: "refresh",
  },
];

const tipIcons = {
  info: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  check: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  lock: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  refresh: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
};

const tipColors = {
  blue: { bg: "bg-blue-50 dark:bg-blue-950/30", icon: "text-blue-600 dark:text-blue-400" },
  green: { bg: "bg-green-50 dark:bg-green-950/30", icon: "text-green-600 dark:text-green-400" },
  amber: { bg: "bg-amber-50 dark:bg-amber-950/30", icon: "text-amber-600 dark:text-amber-400" },
  purple: { bg: "bg-purple-50 dark:bg-purple-950/30", icon: "text-purple-600 dark:text-purple-400" },
};

export default function Tutorial() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("quickstart");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [demoRating, setDemoRating] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const observerRef = useRef(null);

  useEffect(() => {
    const ids = SECTIONS.map(s => s.id);
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -55% 0px", threshold: 0.1 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  }, []);

  const sectionIndex = SECTIONS.findIndex(s => s.id === activeSection);
  const goToSection = (direction) => {
    const next = sectionIndex + direction;
    if (next >= 0 && next < SECTIONS.length) {
      scrollTo(SECTIONS[next].id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      <div className="flex gap-8 relative">
        {/* ===== SIDEBAR TOC ===== */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 space-y-1">
            <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-4 px-3">
              En esta página
            </span>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  activeSection === s.id
                    ? "bg-navy dark:bg-indigo-600 text-white shadow-lg shadow-navy/20 dark:shadow-indigo-500/20"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-navy dark:hover:text-gray-200"
                }`}
              >
                {s.label}
              </button>
            ))}
            <div className="pt-6 px-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full flex items-center justify-center gap-2 text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest hover:text-navy dark:hover:text-gray-200 transition-colors py-2"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver al Dashboard
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile TOC */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-2xl rounded-t-3xl">
          <div className="flex overflow-x-auto scrollbar-hide gap-1 p-2 px-3">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`shrink-0 px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeSection === s.id
                    ? "bg-navy dark:bg-indigo-600 text-white"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* ===== MAIN CONTENT ===== */}
        <div className="flex-1 min-w-0 pb-24 lg:pb-10">
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-black/10 p-6 md:p-10 lg:p-12">
            
            {/* Header */}
            <div className="text-center mb-10">
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

            {/* ===== GUÍA RÁPIDA ===== */}
            <section id="quickstart" className="scroll-mt-20 mb-14">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-6 bg-navy rounded-full"></div>
                <div>
                  <h2 className="text-xl font-black text-navy dark:text-gray-100 uppercase tracking-tight">Guía Rápida</h2>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">3 pasos para empezar</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-navy dark:bg-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0">1</div>
                  <div>
                    <h3 className="text-xs font-black text-navy dark:text-white uppercase tracking-wider">Buscá tu materia</h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-1 leading-relaxed">Desde el Dashboard, buscá tu materia por nombre o departamento.</p>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-navy dark:bg-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0">2</div>
                  <div>
                    <h3 className="text-xs font-black text-navy dark:text-white uppercase tracking-wider">Calificá al docente</h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-1 leading-relaxed">Puntuá cada aspecto del 1 al 5 y agregá un comentario opcional.</p>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-navy dark:bg-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0">3</div>
                  <div>
                    <h3 className="text-xs font-black text-navy dark:text-white uppercase tracking-wider">Sumá experiencia</h3>
                     <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-1 leading-relaxed">Registrá tus intentos para que todos conozcan la dificultad real de cada materia.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="inline-flex items-center gap-2 bg-navy dark:bg-indigo-600 hover:bg-dark-navy dark:hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-navy/15 dark:shadow-indigo-500/20"
                >
                  Ir al Dashboard
                </button>
                <button
                  onClick={() => scrollTo("steps")}
                  className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider hover:bg-gray-200 dark:hover:bg-gray-600 transition-all active:scale-95"
                >
                  Ver Pasos Detallados
                </button>
              </div>
            </section>

            {/* ===== PASOS DETALLADOS ===== */}
            <section id="steps" className="scroll-mt-20 mb-14">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-6 bg-navy rounded-full"></div>
                <div>
                  <h2 className="text-xl font-black text-navy dark:text-gray-100 uppercase tracking-tight">Pasos Detallados</h2>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">Aprendé el funcionamiento completo</p>
                </div>
              </div>

              <div className="space-y-6">
                {steps.map((step, idx) => (
                  <div
                    key={step.number}
                    id={`step-${step.number}`}
                    className="bg-gray-50 dark:bg-gray-900/50 rounded-[2rem] border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Illustration */}
                      <div className="md:w-48 lg:w-56 h-36 md:h-auto bg-white dark:bg-gray-800/50 p-4 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700">
                        <div className="w-full h-full max-w-[200px]">
                          {step.illustration}
                        </div>
                      </div>
                      {/* Content */}
                      <div className="flex-1 p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="w-8 h-8 bg-navy dark:bg-indigo-600 text-white rounded-lg flex items-center justify-center font-black text-[11px]">{step.number}</span>
                          <h3 className="text-lg font-black text-navy dark:text-white">{step.title}</h3>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-3">
                          {step.description}
                        </p>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                          <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                            <span className="font-black text-navy dark:text-indigo-400 uppercase tracking-wider text-[9px]">Tips: </span>
                            {step.detail}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Step navigation */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => goToSection(-1)}
                  disabled={sectionIndex <= 0}
                  className="px-6 h-12 rounded-2xl font-black uppercase tracking-wider text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all disabled:opacity-20 active:scale-95 flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                  Anterior
                </button>
                <button
                  onClick={() => goToSection(1)}
                  disabled={sectionIndex >= SECTIONS.length - 1}
                  className="px-6 h-12 rounded-2xl font-black uppercase tracking-wider text-[10px] bg-navy dark:bg-indigo-600 text-white hover:bg-dark-navy dark:hover:bg-indigo-500 transition-all disabled:opacity-20 active:scale-95 flex items-center gap-2 shadow-lg shadow-navy/20 dark:shadow-indigo-500/20"
                >
                  Siguiente
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </section>

            {/* ===== PREVIEW INTERACTIVO ===== */}
            <section id="preview" className="scroll-mt-20 mb-14">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-6 bg-amber-400 rounded-full"></div>
                <div>
                  <h2 className="text-xl font-black text-navy dark:text-gray-100 uppercase tracking-tight">Probá el Rating</h2>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">Interactuá con las estrellas</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-[2rem] border border-amber-100 dark:border-amber-900/50 p-8 md:p-10 text-center">
                <div className="max-w-sm mx-auto">
                  <p className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-6">
                    ¿Qué tal te parece esta demo?
                  </p>
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setDemoRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        className="transition-all duration-150 transform hover:scale-125 focus:outline-none"
                      >
                        <svg
                          className={`w-10 h-10 transition-all duration-150 ${
                            star <= (hoveredStar || demoRating)
                              ? "text-amber-400 drop-shadow-md"
                              : "text-gray-200 dark:text-gray-600"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  {demoRating > 0 && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <span className="inline-block bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400 text-lg font-black px-6 py-2 rounded-full shadow-sm border border-amber-200 dark:border-amber-800">
                        {demoRating === 1 && "Muy malo"}
                        {demoRating === 2 && "Regular"}
                        {demoRating === 3 && "Normal"}
                        {demoRating === 4 && "Bueno"}
                        {demoRating === 5 && "Excelente"}
                      </span>
                    </div>
                  )}
                  {demoRating === 0 && (
                    <p className="text-xs text-amber-500 dark:text-amber-400 font-bold animate-pulse">
                      Tocá una estrella para probar
                    </p>
                  )}
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium mt-4">
                    Esta es una demo. Las estrellas no guardan nada — solo es para que veas cómo funciona.
                  </p>
                </div>
              </div>
            </section>

            {/* ===== CONSEJOS ===== */}
            <section id="tips" className="scroll-mt-20 mb-14">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-6 bg-green-500 rounded-full"></div>
                <div>
                  <h2 className="text-xl font-black text-navy dark:text-gray-100 uppercase tracking-tight">Consejos para mejores reseñas</h2>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">Hacé que tus valoraciones sean útiles</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tips.map((tip) => {
                  const c = tipColors[tip.color];
                  return (
                    <div key={tip.title} className={`${c.bg} border border-gray-100 dark:border-gray-700 rounded-2xl p-5 flex gap-4 items-start shadow-sm transition-all hover:shadow-md`}>
                      <div className={`w-9 h-9 ${c.bg} ${c.icon} rounded-xl flex items-center justify-center shrink-0`}>
                        {tipIcons[tip.icon]}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-navy dark:text-white uppercase tracking-wider mb-0.5">{tip.title}</h4>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{tip.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ===== FAQ ===== */}
            <section id="faq" className="scroll-mt-20 mb-14">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
                <div>
                  <h2 className="text-xl font-black text-navy dark:text-gray-100 uppercase tracking-tight">Preguntas Frecuentes</h2>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">Resolvé tus dudas</p>
                </div>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <span className="text-sm font-bold text-navy dark:text-white pr-4">{faq.q}</span>
                      <svg
                        className={`w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0 transition-transform duration-200 ${
                          expandedFaq === idx ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-200 ${
                        expandedFaq === idx ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="px-5 pb-5 text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ===== LOGROS ===== */}
            <section id="badges" className="scroll-mt-20 mb-14">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
                <div>
                  <h2 className="text-xl font-black text-navy dark:text-gray-100 uppercase tracking-tight">Logros y Reputación</h2>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">Subí de rango en la comunidad</p>
                </div>
              </div>

              <div className="bg-amber-50/50 dark:bg-amber-950/10 rounded-[2rem] border border-amber-100 dark:border-amber-900/30 p-6 md:p-8">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold text-center mb-8 max-w-lg mx-auto leading-relaxed">
                  Cada reseña o intento registrado suma puntos. Acumulá aportes y desbloqueá rangos dentro de la comunidad.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                  {BADGES.map((b) => {
                    const style = getBadgeStyles(b.color);
                    const label = getBadgeLabel(b, b.min);
                    return (
                      <div key={b.id} className={`${style.card} rounded-2xl p-5 text-center transition-all hover:scale-105 hover:shadow-lg`}>
                        <div className={`w-12 h-12 ${style.cardIcon} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                          {b.icon("w-6 h-6")}
                        </div>
                        <span className={`text-xs font-black uppercase tracking-wider ${style.name}`}>{b.name}</span>
                        <p className={`text-[10px] ${style.desc} font-bold mt-1`}>{label}</p>
                      </div>
                    );
                  })}
                </div>
                <p className="text-center text-[10px] text-gray-400 dark:text-gray-500 font-bold mt-6">
                   Los aportes incluyen tanto reseñas a docentes como registros en el Chipitómetro.
                </p>
              </div>
            </section>

            {/* Footer */}
            <div className="pt-8 border-t border-gray-100 dark:border-gray-700 text-center">
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
      </div>
    </div>
  );
}
